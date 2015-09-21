# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('pos_from_centre_X', models.IntegerField(default=0)),
                ('pos_from_centre_Y', models.IntegerField(default=0)),
                ('width', models.IntegerField(default=100)),
                ('height', models.IntegerField(default=100)),
                ('img', models.CharField(max_length=200)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
