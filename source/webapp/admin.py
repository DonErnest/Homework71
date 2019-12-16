from django.contrib import admin

from webapp.models import Quote


class QuoteAdmin(admin.ModelAdmin):
    list_display =  ['id', 'text','author', 'status', 'email', 'rating', 'added']
    list_display_links = ['id']
    fields = ['text','author', 'status', 'email', 'rating']
    readonly_fields = ['added']
    list_filter = ['status', 'author']

admin.site.register(Quote, QuoteAdmin)