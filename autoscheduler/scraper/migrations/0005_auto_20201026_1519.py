# Generated by Django 2.2.16 on 2020-10-26 20:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('scraper', '0004_section_asynchronous'),
    ]

    operations = [
        migrations.AlterField(
            model_name='meeting',
            name='section',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='meetings', to='scraper.Section'),
        ),
    ]
