
# Create your views here.
from django.template import RequestContext, loader
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse

from .models import Text, Image, Video, Link

import logging
logger = logging.getLogger(__name__)


def editSketch(request):
    text_list = Text.objects.all()
    num_frames = len(text_list)

    context = {'text_list': text_list, 'num_frames': num_frames}
    return render(request, 'skengine_app/editSketch.html', context)

