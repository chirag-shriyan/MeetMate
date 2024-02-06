from django.shortcuts import render,redirect
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
import random
import time

# Create your views here.

def main(request):
  username = request.user.username
  context = {"username":username}
  return render(request,"vcallapp/main.html",context)


def lobby(request):
  return render(request,"vcallapp/lobby.html")

def lobby2(request):
  return render(request,"vcallapp/lobby2.html")

def room(request):
  return render(request,"vcallapp/room.html")

def room2(request,invitecode):
  context = {}
  context[invitecode] = invitecode
  return render(request,"vcallapp/room2.html",context)

def roomend(request):
  return render(request,"vcallapp/roomend.html")

def joinStream(request):
  return render(request,"vcallapp/joinStream.html")

def signup(request):
  if request.method =="POST":
    firstname = request.POST['firstname']
    lastname = request.POST['lastname']
    email = request.POST['email']
    password = request.POST['password']
    data = User.objects.create(
      username= f'{firstname} {lastname}' ,
      email=email,
      password=password
    )
    data.set_password(password)
    data.save()
    user = authenticate(email=email, password=password)
    login(request, user)
    return redirect("/")
  else:
    return redirect(request, "/")

def ulogin(request):
  if request.method=="POST":
    email = request.POST['email']
    password = request.POST['password']
    user = authenticate(email=email, password=password)
    print(email , password ,user)
    if user is not None:
      login(request, user)
      return redirect("/")
    else:
      return redirect("/")
  else:
    return redirect(request, "vcallapp/main.html")

def ulogout(req):
    logout(req)
    return redirect("/")

def home(req):
  firstname = req.user.firstname
  context = {"firstname":firstname}
  return render(req,"vcallapp/home.html",context)


# To create user records

from vcallapp.models import RoomRecord
from django.views.decorators.csrf import csrf_exempt
import json


@csrf_exempt
def createRoomRecord(req):
  if req.method=="POST":
    data = req.body     
    content_type = req.content_type
    if content_type == 'application/json':
      try:
          # Parse JSON data
          data = json.loads(data)
          # print(data) # Too see data
          username = data['username']
          room = data['room']
          uid = data['uid']
          if username and room and uid:
            new_RoomRecord = RoomRecord.objects.create(
              username = username,
              room = room,
              uid = uid
            )
            new_RoomRecord.save()
            return JsonResponse({'message': 'Data received successfully'})
          else :
            return JsonResponse({'error': 'All fields are required'})

      except json.JSONDecodeError:
          return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'error': 'Unsupported content type'}, status=415)

  else:
    return JsonResponse({'error': 'Invalid request type'}, status=415)
    

import razorpay  

@csrf_exempt
def payment(req):
  client = razorpay.Client(auth=("rzp_test_J8PjJZwiEKtvxo", "vOrP5NRIQAAzKtceqTNd7Ner"))
  data = { "amount": 99900, "currency": "INR", "receipt": "11" }
  payment = client.order.create(data=data)
  context={}
  context["data"]=payment
  context["amount"]=payment
  return render(req,"vcallapp/payment.html") 
    

def test(req):
  return render(req,'vcallapp/test.html')