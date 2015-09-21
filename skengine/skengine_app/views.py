from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

from .models import Text, Image, Video, Link

def editSketch(request):
    output = [p.txt for p in Text.objects.all()]
    return HttpResponse(output)