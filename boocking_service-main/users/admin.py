from django.contrib import admin

from users.models import User, Interest


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = [
        'email',
        'id',
    ]


@admin.register(Interest)
class InterestAdmin(admin.ModelAdmin):
    fields = ['interest_name', ]
