# Generated by Django 5.1.1 on 2024-10-09 12:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_user_latitude_user_longitude'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='profile_picture',
            field=models.ImageField(blank=True, default='profile_pictures/default.jpeg', null=True, upload_to='profile_pictures/'),
        ),
    ]
