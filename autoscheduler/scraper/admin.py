from django.contrib import admin

# Register the models here, so we can see them in /admin
from scraper.models import Section, Course, Meeting, Instructor, Department

admin.site.register(Section)
admin.site.register(Course)
admin.site.register(Meeting)
admin.site.register(Instructor)
admin.site.register(Department)
