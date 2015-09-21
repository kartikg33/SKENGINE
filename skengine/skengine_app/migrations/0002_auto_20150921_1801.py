# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('skengine_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Link',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('pos_from_centre_X', models.IntegerField(default=0)),
                ('pos_from_centre_Y', models.IntegerField(default=0)),
                ('width', models.IntegerField(default=100)),
                ('height', models.IntegerField(default=100)),
                ('link', models.CharField(max_length=200)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Text',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('pos_from_centre_X', models.IntegerField(default=0)),
                ('pos_from_centre_Y', models.IntegerField(default=0)),
                ('width', models.IntegerField(default=100)),
                ('height', models.IntegerField(default=100)),
                ('txt', models.CharField(max_length=1000000)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('pos_from_centre_X', models.IntegerField(default=0)),
                ('pos_from_centre_Y', models.IntegerField(default=0)),
                ('width', models.IntegerField(default=100)),
                ('height', models.IntegerField(default=100)),
                ('vid_dir', models.CharField(max_length=200)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.RenameField(
            model_name='image',
            old_name='img',
            new_name='img_dir',
        ),
    ]
