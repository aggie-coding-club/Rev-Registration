# Generated by Django 2.2.10 on 2020-04-11 19:02

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.CharField(max_length=15, primary_key=True, serialize=False)),
                ('dept', models.CharField(db_index=True, max_length=4)),
                ('course_num', models.CharField(db_index=True, max_length=5)),
                ('title', models.CharField(max_length=100)),
                ('credit_hours', models.IntegerField(null=True)),
                ('term', models.CharField(blank=True, max_length=6)),
            ],
            options={
                'db_table': 'courses',
            },
        ),
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('code', models.CharField(max_length=4)),
                ('description', models.TextField(max_length=100)),
                ('term', models.CharField(db_index=True, max_length=6)),
            ],
            options={
                'db_table': 'departments',
            },
        ),
        migrations.CreateModel(
            name='Instructor',
            fields=[
                ('id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('email_address', models.CharField(max_length=48, null=True)),
            ],
            options={
                'db_table': 'instructors',
            },
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.BigIntegerField(primary_key=True, serialize=False)),
                ('subject', models.CharField(db_index=True, max_length=4)),
                ('course_num', models.CharField(db_index=True, max_length=5)),
                ('section_num', models.CharField(db_index=True, max_length=4)),
                ('term_code', models.IntegerField(db_index=True)),
                ('crn', models.IntegerField(db_index=True, default=0)),
                ('min_credits', models.IntegerField()),
                ('max_credits', models.IntegerField(null=True)),
                ('honors', models.BooleanField(null=True)),
                ('web', models.BooleanField(null=True)),
                ('max_enrollment', models.IntegerField()),
                ('current_enrollment', models.IntegerField()),
                ('instructor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='scraper.Instructor')),
            ],
            options={
                'db_table': 'sections',
            },
        ),
        migrations.CreateModel(
            name='Grades',
            fields=[
                ('section', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='scraper.Section')),
                ('gpa', models.FloatField()),
                ('A', models.IntegerField(db_index=True)),
                ('B', models.IntegerField(db_index=True)),
                ('C', models.IntegerField(db_index=True)),
                ('D', models.IntegerField(db_index=True)),
                ('F', models.IntegerField(db_index=True)),
                ('I', models.IntegerField(db_index=True)),
                ('S', models.IntegerField(db_index=True)),
                ('U', models.IntegerField(db_index=True)),
                ('Q', models.IntegerField(db_index=True)),
                ('X', models.IntegerField(db_index=True)),
            ],
            options={
                'db_table': 'grades',
            },
        ),
        migrations.CreateModel(
            name='Meeting',
            fields=[
                ('id', models.BigIntegerField(primary_key=True, serialize=False)),
                ('building', models.CharField(max_length=5, null=True)),
                ('meeting_days', django.contrib.postgres.fields.ArrayField(base_field=models.BooleanField(), size=7)),
                ('start_time', models.TimeField(null=True)),
                ('end_time', models.TimeField(null=True)),
                ('meeting_type', models.CharField(max_length=4)),
                ('section', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='scraper.Section')),
            ],
            options={
                'db_table': 'meetings',
            },
        ),
    ]
