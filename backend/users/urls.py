from django.urls import path
from .views import RegisterView, LoginView, UserView, LogoutView, UpdateView, UpdateName

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('update',UpdateView.as_view()),
    path('update1/<int:pk>/',UpdateName.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
]
