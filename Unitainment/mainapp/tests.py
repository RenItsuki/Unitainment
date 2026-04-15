from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import Discussion, DiscussionComment, Media, PersonalList, SearchHistory


class UnitainmentFlowTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="jas",
            email="jas@example.com",
            password="testpass12345",
        )
        self.media = Media.objects.create(
            title="Test Shelf Pick",
            media_type="anime",
            genre="Fantasy",
            tagline="A seeded test title.",
            description="Something worth tracking.",
            rating=8.8,
            status="Hot",
        )
        self.discussion = Discussion.objects.create(
            topic="Test Discussion",
            description="A local thread for testing.",
            community="r/testing",
            author_name="tester",
        )

    def test_home_page_renders_new_sections(self):
        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Find something worth watching, playing, or reading.")
        self.assertContains(response, "Recent Discussions")

    def test_list_requires_login(self):
        response = self.client.get(reverse("list-home"))

        self.assertEqual(response.status_code, 302)
        self.assertIn(reverse("login"), response.url)

    def test_save_to_list_moves_media_between_buckets(self):
        self.client.login(username="jas", password="testpass12345")

        self.client.post(
            reverse("save-to-list"),
            {"media_id": self.media.id, "status": "planning"},
        )
        self.client.post(
            reverse("save-to-list"),
            {"media_id": self.media.id, "status": "current"},
        )

        self.assertEqual(PersonalList.objects.filter(user=self.user, media=self.media).count(), 1)
        self.assertEqual(
            PersonalList.objects.get(user=self.user, media=self.media).status,
            "current",
        )

    def test_search_records_recent_searches(self):
        self.client.login(username="jas", password="testpass12345")

        response = self.client.get(reverse("search"), {"q": "Test", "media_type": "anime"})

        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            SearchHistory.objects.filter(user=self.user, query="Test", media_type="anime").exists()
        )

    def test_discussion_detail_renders(self):
        response = self.client.get(reverse("discussion-detail", args=[self.discussion.id]))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test Discussion")

    def test_comment_can_be_posted_to_discussion(self):
        response = self.client.post(
            reverse("discussion-detail", args=[self.discussion.id]),
            {"author_name": "jas", "body": "Nice thread"},
            follow=True,
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            DiscussionComment.objects.filter(discussion=self.discussion, author_name="jas", body="Nice thread").exists()
        )
