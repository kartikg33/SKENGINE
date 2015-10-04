
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

def saveSketch(request):
	if request.method == 'POST':
   		post_id = request.POST.get('id')
    	post_posX = request.POST.get('posX')
    	post_posY = request.POST.get('posY')
        post_width = request.POST.get('width')
        post_height = request.POST.get('height')
        post_text = request.POST.get('text')
    	

        try:
            frame = Text.objects.get(id=post_id)
        except:
            frame = Text.objects.create(id=post_id)
        else:     
            frame.pos_from_centre_X = post_posX
            frame.pos_from_centre_Y = post_posY
            frame.width = post_width
            frame.height = post_height
            frame.txt = post_text
            frame.save()

    	return render(request, 'skengine_app/editSketch.html')