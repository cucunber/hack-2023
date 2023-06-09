# Generated by Django 4.1.8 on 2023-05-27 08:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("halls", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("chat", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="message",
            name="sender",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="message_sender",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="conversation",
            name="hall",
            field=models.ForeignKey(
                null=True, on_delete=django.db.models.deletion.SET_NULL, to="halls.hall"
            ),
        ),
        migrations.AddField(
            model_name="conversation",
            name="user_from",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="convo_starter",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="conversation",
            name="user_to",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="convo_participant",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
