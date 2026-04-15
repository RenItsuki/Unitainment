from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.forms import ModelForm

from .models import Discussion, DiscussionComment, Media


def _style_fields(form):
    for field in form.fields.values():
        existing_class = field.widget.attrs.get("class", "")
        field.widget.attrs["class"] = f"{existing_class} form-input".strip()


class MediaForm(ModelForm):
    class Meta:
        model = Media
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        _style_fields(self)


class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = get_user_model()
        fields = ["username", "email", "password1", "password2"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        _style_fields(self)
        self.fields["username"].widget.attrs["placeholder"] = "Pick a username"
        self.fields["email"].widget.attrs["placeholder"] = "you@example.com"
        self.fields["password1"].widget.attrs["placeholder"] = "Create a password"
        self.fields["password2"].widget.attrs["placeholder"] = "Repeat the password"

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user


class LoginForm(AuthenticationForm):
    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "class": "form-input",
                "placeholder": "Username",
                "autocomplete": "username",
            }
        )
    )
    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": "form-input",
                "placeholder": "Password",
                "autocomplete": "current-password",
            }
        )
    )


RoomForm = MediaForm


class DiscussionCommentForm(forms.ModelForm):
    class Meta:
        model = DiscussionComment
        fields = ["author_name", "body"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        _style_fields(self)
        self.fields["author_name"].widget.attrs["placeholder"] = "Your name"
        self.fields["body"].widget.attrs["placeholder"] = "Write a comment"
        self.fields["body"].widget = forms.Textarea(
            attrs={
                "class": "form-input",
                "placeholder": "Write a comment",
                "rows": 4,
            }
        )


class DiscussionForm(forms.ModelForm):
    class Meta:
        model = Discussion
        fields = ["topic", "description", "community", "topic_type", "image_url"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        _style_fields(self)
        self.fields["topic"].widget.attrs["placeholder"] = "Discussion title"
        self.fields["description"].widget = forms.Textarea(
            attrs={
                "class": "form-input",
                "placeholder": "What do you want to discuss?",
                "rows": 5,
            }
        )
        self.fields["community"].widget.attrs["placeholder"] = "r/unitainment"
        self.fields["image_url"].widget.attrs["placeholder"] = "Optional image URL"
    