# Generated by Django 4.1.8 on 2023-05-27 08:13

from django.db import migrations, models
import django.db.models.deletion
import halls.models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="EventType",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("event_type_name", models.CharField(max_length=120)),
            ],
        ),
        migrations.CreateModel(
            name="Hall",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=160)),
                ("descriptions", models.TextField(max_length=2000)),
                ("view_count", models.BigIntegerField(default=0)),
                (
                    "area_min",
                    models.DecimalField(decimal_places=2, max_digits=100, null=True),
                ),
                (
                    "area",
                    models.DecimalField(decimal_places=2, max_digits=100, null=True),
                ),
                ("capacity_min", models.IntegerField(null=True)),
                ("capacity", models.IntegerField(null=True)),
                ("email", models.EmailField(max_length=254, null=True)),
                ("address", models.CharField(max_length=180, null=True)),
                ("price_min", models.IntegerField(blank=True, null=True)),
                ("price", models.IntegerField(blank=True, null=True)),
                (
                    "longitude",
                    models.DecimalField(decimal_places=6, max_digits=9, null=True),
                ),
                (
                    "latitude",
                    models.DecimalField(decimal_places=6, max_digits=9, null=True),
                ),
                (
                    "condition",
                    models.FileField(
                        null=True,
                        upload_to=halls.models.hall_directory_path_to_condition,
                    ),
                ),
                ("phone", models.CharField(max_length=20, null=True)),
                ("site", models.CharField(max_length=100, null=True)),
                ("vk", models.CharField(max_length=100, null=True)),
                ("telegram", models.CharField(max_length=100, null=True)),
                ("whatsapp", models.CharField(max_length=100, null=True)),
                ("services", models.JSONField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name="HallModeratingStatus",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("moderating_status_name", models.CharField(max_length=120)),
            ],
        ),
        migrations.CreateModel(
            name="HallType",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("type_name", models.CharField(max_length=120)),
            ],
        ),
        migrations.CreateModel(
            name="Unit",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("unit_name", models.CharField(max_length=120)),
            ],
        ),
        migrations.CreateModel(
            name="Property",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("property_name", models.CharField(max_length=160)),
                (
                    "property_type",
                    models.CharField(
                        choices=[
                            ("Boolean", "bool"),
                            ("String", "str"),
                            ("Integer", "int"),
                        ],
                        max_length=20,
                    ),
                ),
                (
                    "hall_type",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="type_properties",
                        to="halls.halltype",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="HallMedia",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("file", models.FileField(upload_to=halls.models.hall_directory_path)),
                ("is_avatar", models.BooleanField(default=False)),
                (
                    "hall",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="files",
                        to="halls.hall",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="HallFavorite",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "hall",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="favorites",
                        to="halls.hall",
                    ),
                ),
            ],
        ),
    ]
