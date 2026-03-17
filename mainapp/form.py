from django.forms import ModelForm
from .models import Media

class RoomForm(ModelForm):
    class Meta:
        model=Media
        fields='__all__'