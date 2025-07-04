# Generated by Django 5.2.2 on 2025-06-12 05:44

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_remove_parkinglocation_total_slots_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parkingslot',
            name='slot_id',
            field=models.UUIDField(blank=True, default=uuid.uuid4, editable=False, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='plate_number',
            field=models.CharField(max_length=20, unique=True),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='vehicle_make',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='vehicle_model',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='vehicle_type',
            field=models.CharField(max_length=20),
        ),
    ]
