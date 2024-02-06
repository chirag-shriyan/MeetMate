from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.main,name="main"),
    path('room/', views.room,name="room"),
    path('roomend/', views.roomend,name="roomend"),
    path('lobby/', views.lobby,name="lobby"),
    path('lobby2/', views.lobby2,name="lobby2"),
    path('room2/<invitecode>', views.room2,name="room2"),
    path('joinStream/', views.joinStream,name="joinStream"),

    path('ulogin/', views.ulogin,name="ulogin"),
    path('login/', views.main,name="login"),
    path('ulogout/', views.ulogout,name="ulogout"),
    path('signup/', views.signup,name="signup"),
    path('payment/', views.payment,name="payment"),
    path('room-record/', views.createRoomRecord,name="room-record"),


    path('reset_password/', auth_views.PasswordResetView.as_view(), name='reset_password'),
    path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password_reset_complete/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]