from django.urls import path

from webapp.views import IndexView

urlpatterns = [
    path('', IndexView.as_view(), name='main_page'),
]

app_name='webapp'