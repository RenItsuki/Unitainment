from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Q
from django.http import Http404
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse

from .form import DiscussionCommentForm, DiscussionForm, LoginForm, RegisterForm
from .models import Discussion, DiscussionComment, Media, PersonalList, SearchHistory


LIST_SECTIONS = [
    {
        "status": "planning",
        "label": "Plan To",
        "description": "Queue up your next watch, play, or read.",
        "caption": "Plan to watch / play / read",
    },
    {
        "status": "current",
        "label": "Current",
        "description": "What you are actively into right now.",
        "caption": "Watching, playing, or reading now",
    },
    {
        "status": "completed",
        "label": "Completed",
        "description": "Everything you already finished.",
        "caption": "Done and dusted",
    },
    {
        "status": "dropped",
        "label": "Dropped",
        "description": "Stuff that did not survive the vibe check.",
        "caption": "Paused indefinitely",
    },
]

HOT_SECTION_TYPES = [
    ("anime", "Hot Anime"),
    ("game", "Hot Games"),
    ("book", "Hot Books"),
    ("webseries", "Hot Web Series"),
]


def _build_hot_sections():
    return [
        {
            "slug": media_type,
            "label": label,
            "items": Media.objects.filter(media_type=media_type, is_hot=True)[:4],
        }
        for media_type, label in HOT_SECTION_TYPES
    ]


def _get_recent_searches(request):
    history = SearchHistory.objects.all()
    if request.user.is_authenticated:
        history = history.filter(user=request.user)
    else:
        history = history.filter(user__isnull=True)
    return history[:5]


def _save_search(request, query, media_type, genre):
    if not any([query, media_type, genre]):
        return

    SearchHistory.objects.create(
        user=request.user if request.user.is_authenticated else None,
        query=query,
        media_type=media_type,
        genre=genre,
    )


def _status_counts_for(user):
    counts = {
        row["status"]: row["total"]
        for row in PersonalList.objects.filter(user=user)
        .values("status")
        .annotate(total=Count("id"))
    }
    sections = []
    for section in LIST_SECTIONS:
        sections.append({**section, "count": counts.get(section["status"], 0)})
    return sections


def _redirect_back(request, fallback_name):
    return redirect(request.POST.get("next") or request.META.get("HTTP_REFERER") or reverse(fallback_name))


def home(request):
    featured_media = list(Media.objects.filter(featured=True)[:4])
    if len(featured_media) < 4:
        featured_ids = [media.id for media in featured_media]
        fallback_media = Media.objects.filter(is_hot=True).exclude(id__in=featured_ids)[: 4 - len(featured_media)]
        featured_media.extend(list(fallback_media))

    recent_discussions = Discussion.objects.all()[:5]
    fresh_picks = Media.objects.filter(is_hot=True)[:8]
    recent_entries = []
    list_sections = []
    if request.user.is_authenticated:
        recent_entries = PersonalList.objects.filter(user=request.user).select_related("media")[:4]
        list_sections = _status_counts_for(request.user)

    context = {
        "featured_media": featured_media,
        "recent_discussions": recent_discussions,
        "fresh_picks": fresh_picks,
        "list_sections": list_sections,
        "recent_entries": recent_entries,
    }
    return render(request, "home.html", context)


def discussions(request):
    discussions_list = list(Discussion.objects.all()[:8])
    featured_discussion = discussions_list[0] if discussions_list else None
    timeline = discussions_list[1:] if len(discussions_list) > 1 else []
    context = {
        "featured_discussion": featured_discussion,
        "timeline": timeline,
    }
    return render(request, "discussions.html", context)


def add_discussion(request):
    form = DiscussionForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        discussion = form.save(commit=False)
        discussion.author_name = request.user.username if request.user.is_authenticated else "guest"
        if not discussion.community:
            discussion.community = "r/unitainment"
        discussion.save()
        messages.success(request, "Discussion created.")
        return redirect("discussion-detail", discussion_id=discussion.id)

    return render(
        request,
        "discussion_form.html",
        {
            "form": form,
            "title": "Add Discussion",
            "submit_label": "Post Discussion",
        },
    )


def discussion_detail(request, discussion_id):
    discussion = get_object_or_404(Discussion, id=discussion_id)
    form = DiscussionCommentForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        comment = form.save(commit=False)
        comment.discussion = discussion
        if request.user.is_authenticated:
            comment.author_name = request.user.username
        comment.save()
        discussion.comment_count = discussion.comments.count()
        discussion.save(update_fields=["comment_count"])
        messages.success(request, "Comment added.")
        return redirect("discussion-detail", discussion_id=discussion.id)

    context = {
        "discussion": discussion,
        "comments": discussion.comments.all(),
        "form": form,
    }
    return render(request, "discussion_detail.html", context)


def search(request):
    query = (request.GET.get("q") or "").strip()
    media_type = (request.GET.get("media_type") or "").strip()
    genre = (request.GET.get("genre") or "").strip()

    results = Media.objects.none()
    query_active = any([query, media_type, genre])
    if query_active:
        results = Media.objects.all()
        if query:
            results = results.filter(
                Q(title__icontains=query)
                | Q(tagline__icontains=query)
                | Q(description__icontains=query)
                | Q(genre__icontains=query)
            )
        if media_type:
            results = results.filter(media_type=media_type)
        if genre:
            results = results.filter(genre__iexact=genre)
        _save_search(request, query, media_type, genre)

    genres = (
        Media.objects.exclude(genre="")
        .order_by("genre")
        .values_list("genre", flat=True)
        .distinct()[:10]
    )

    context = {
        "results": results,
        "query": query,
        "selected_type": media_type,
        "selected_genre": genre,
        "recent_searches": _get_recent_searches(request),
        "hot_sections": _build_hot_sections(),
        "genres": [{"value": item, "label": item} for item in genres],
        "query_active": query_active,
    }
    return render(request, "search.html", context)


@login_required
def list_home(request):
    context = {
        "sections": _status_counts_for(request.user),
        "recent_entries": PersonalList.objects.filter(user=request.user).select_related("media")[:6],
        "suggestions": Media.objects.filter(is_hot=True)[:6],
    }
    return render(request, "list_overview.html", context)


@login_required
def list_status(request, status):
    status_info = next((section for section in LIST_SECTIONS if section["status"] == status), None)
    if not status_info:
        raise Http404("Unknown list bucket")

    entries = PersonalList.objects.filter(user=request.user, status=status).select_related("media")
    suggestions = (
        Media.objects.exclude(list_entries__user=request.user, list_entries__status=status)
        .order_by("-featured", "-is_hot", "title")
        .distinct()[:8]
    )

    context = {
        "status_info": status_info,
        "sections": _status_counts_for(request.user),
        "entries": entries,
        "suggestions": suggestions,
    }
    return render(request, "list_status.html", context)


@login_required
def save_to_list(request):
    if request.method != "POST":
        return redirect("list-home")

    media = get_object_or_404(Media, id=request.POST.get("media_id"))
    status = request.POST.get("status", "planning")
    valid_statuses = {section["status"]: section["label"] for section in LIST_SECTIONS}
    if status not in valid_statuses:
        status = "planning"

    PersonalList.objects.update_or_create(
        user=request.user,
        media=media,
        defaults={"status": status},
    )
    messages.success(request, f'"{media.title}" is now in {valid_statuses[status]}.')
    return _redirect_back(request, "list-home")


@login_required
def remove_from_list(request, entry_id):
    if request.method != "POST":
        return redirect("list-home")

    entry = get_object_or_404(PersonalList, id=entry_id, user=request.user)
    title = entry.media.title
    entry.delete()
    messages.info(request, f'"{title}" was removed from your list.')
    return _redirect_back(request, "list-home")


def register_view(request):
    if request.user.is_authenticated:
        return redirect("list-home")

    form = RegisterForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        user = form.save()
        login(request, user)
        messages.success(request, "Your account is ready. Start building your list.")
        return redirect(request.POST.get("next") or "list-home")

    return render(
        request,
        "auth_form.html",
        {
            "form": form,
            "title": "Create your account",
            "subtitle": "Save lists, track what is current, and keep your dropped pile tidy.",
            "submit_label": "Register",
            "alt_url": reverse("login"),
            "alt_text": "Already have an account? Log in",
        },
    )


def login_view(request):
    if request.user.is_authenticated:
        return redirect("list-home")

    form = LoginForm(request, data=request.POST or None)
    if request.method == "POST" and form.is_valid():
        login(request, form.get_user())
        messages.success(request, f"Welcome back, {form.get_user().username}.")
        return redirect(request.POST.get("next") or "list-home")

    return render(
        request,
        "auth_form.html",
        {
            "form": form,
            "title": "Log in",
            "subtitle": "Pick up your lists, discussions, and search trail where you left them.",
            "submit_label": "Log in",
            "alt_url": reverse("register"),
            "alt_text": "Need an account? Register",
        },
    )


def logout_view(request):
    logout(request)
    messages.info(request, "You have been logged out.")
    return redirect("home")


def addMedia(request):
    if request.user.is_authenticated:
        return redirect("list-home")
    return redirect("login")
