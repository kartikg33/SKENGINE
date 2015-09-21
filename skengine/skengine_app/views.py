from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.template import RequestContext, loader

from .models import Text, Image, Video, Link

def editSketch(request):
    text_list = Text.objects.all()
    context = {'text_list': text_list}
    return render(request, 'skengine_app/editSketch.html', context)

