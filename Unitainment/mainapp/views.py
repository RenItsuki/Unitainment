
from django.shortcuts import render,redirect
from .models import Media
from .form import RoomForm
from django.db.models import Q

def home(request):
    media=Media.objects.all()
    return render(request,'home.html',{'media':media})


def search(request):
    q=request.GET.get('q')
    results=Media.objects.filter(title__icontains=q) if q else []
    return render(request,'search.html',{'results':results,'query':q})

def addMedia(request):
    form=RoomForm()

    if request.method == "POST":
        form = RoomForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('home')
        
    context={'form':form}
    return render(request, 'media_form.html', context)

def updateMedia(request,pk):
    room=Media.objects.get(id=pk)
    form= RoomForm(instance=room)

    if request.method=="POST":
        form=RoomForm(request.POST, instance=room)
        if form.is_valid():
            form.save()
            return redirect('home')

    context={'form':form}
    return render(request, 'media_form.html', context)

def delete_media(request,pk):
    room=Media.objects.get(id=pk)
    if request.method == "POST":
        room.delete()
        return redirect('home')
    return render(request, 'delete.html', {'obj':room.title})
