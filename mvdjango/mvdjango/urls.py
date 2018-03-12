from django.conf.urls import url
from django.contrib import admin
import views
urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^listLayers/', views.listLayers),
    url(r'^modifyLayer/', views.modifyLayer),
    url(r'^checkAdmin/', views.checkAdmin),
    url(r'^modifyAdmin/',views.modifyAdmin)
]
