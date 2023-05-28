from django.contrib import admin

from halls.models import Hall, HallType, Property, Unit, EventType, HallFavorite, HallModeratingStatus, HallMedia


@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'descriptions',
        'moderated',
        'owner',
    ]

    filter_horizontal = ('hall_type',)


@admin.register(HallType)
class HallTypeAdmin(admin.ModelAdmin):
    list_display = ['id', 'type_name', ]


@admin.register(Property)
class HallPropertyConferenceRoomAdmin(admin.ModelAdmin):
    list_display = ['hall_type', 'property_name', 'property_type' ,]


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ['id', 'unit_name']


@admin.register(EventType)
class EventTypeAdmin(admin.ModelAdmin):
    list_display = ['id', 'event_type_name', ]


@admin.register(HallFavorite)
class HallFavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'hall', ]


@admin.register(HallModeratingStatus)
class HallModeratingStatusAdmin(admin.ModelAdmin):
    list_display = ['id', 'moderating_status_name',]


@admin.register(HallMedia)
class HallMediaAdmin(admin.ModelAdmin):
    list_display = ['hall', 'file', 'is_avatar']
