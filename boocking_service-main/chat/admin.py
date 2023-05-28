from .models import Message, Conversation
from django.contrib import admin

admin.site.register(Message)

admin.site.register(Conversation)
# @admin.register(Conversation)
# class ConversationAdmin(admin.ModelAdmin):
#     list_display = [
#         'initiator', 'receiver', 'message_set'
#     ]
