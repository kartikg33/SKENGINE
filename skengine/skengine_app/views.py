
# Create your views here.
from django.template import RequestContext, loader
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.db.models import Max
from .models import Text, Image, Video, Link


def editSketch(request):
    text_list = Text.objects.all()
    
    num_frames = Text.objects.all().aggregate(Max('id'))['id__max']  
    if len(text_list) == 0: #check for NaN
        num_frames = 0

    context = {'text_list': text_list, 'num_frames': num_frames}
    
    if request.method == 'POST':

        task = request.POST.get('task')
        if task=="save":

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
            finally:     
                frame.pos_from_centre_X = post_posX
                frame.pos_from_centre_Y = post_posY
                frame.width = post_width
                frame.height = post_height
                frame.txt = post_text
                frame.save()
        
        elif task=="delete":
            post_id = request.POST.get('id')
            frame = Text.objects.get(id=post_id)
            frame.delete()


    return render(request, 'skengine_app/editSketch.html', context)
