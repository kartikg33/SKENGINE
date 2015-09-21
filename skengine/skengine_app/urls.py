from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.editSketch, name='editSketch'),
]