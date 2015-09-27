from django.contrib import admin

# Register your models here.
from .models import Text, Image, Video, Link

class TextAdmin(admin.ModelAdmin):
    fields = ['txt','pos_from_centre_X', 'pos_from_centre_Y', 'width', 'height']
    list_display = ('txt', 'pos_from_centre_X', 'pos_from_centre_Y', 'width', 'height')

admin.site.register(Text, TextAdmin)
admin.site.register(Image)
admin.site.register(Video)
admin.site.register(Link)