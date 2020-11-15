# Generated by Django 2.2.7 on 2020-08-23 18:34

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserToDataSession',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.IntegerField()),
                ('session_key', models.CharField(max_length=40)),
            ],
            options={
                'db_table': 'user_to_data_session',
            },
        ),
    ]
