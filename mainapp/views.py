
from django.shortcuts import render,redirect
from .models import Media

def home(request):
    media=Media.objects.all()
    return render(request,'home.html',{'media':media})

def search(request):
    q=request.GET.get('q')
    results=Media.objects.filter(title__icontains=q) if q else []
    return render(request,'search.html',{'results':results,'query':q})

def add_media(request):
    if request.method=='POST':
        Media.objects.create(
        title=request.POST['title'],
        media_type=request.POST['media_type'],
        rating=request.POST['rating'],
        status=request.POST['status']
        )
        return redirect('home')
    return render(request,'add.html')

def delete_media(request,id):
    Media.objects.get(id=id).delete()
    return redirect('home')
