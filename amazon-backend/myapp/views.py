from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import Products, UserProfile
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes
from decimal import Decimal, InvalidOperation


def parse_price(value):
    """Return a valid Decimal price or None if invalid/out of range."""
    try:
        price = Decimal(str(value)).quantize(Decimal('0.01'))
        if price <= 0 or price > Decimal('99999.99'):
            return None
        return price
    except InvalidOperation:
        return None


@api_view(['POST'])
def register(request):
    name = request.data.get('name', '')
    email = request.data.get('email', '')
    password = request.data.get('password', '')

    if not name or not email or not password:
        return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if len(password) < 6:
        return Response({'error': 'Password must be at least 6 characters.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=email, email=email, password=password, first_name=name)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'name': name, 'email': email}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login(request):
    email = request.data.get('email', '')
    password = request.data.get('password', '')

    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=email, password=password)
    if not user:
        return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'name': user.first_name, 'email': user.email})


@api_view(['POST'])
def logout(request):
    request.auth.delete()
    return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def checkout(request):
    return Response({'message': 'Order placed successfully.'})


@api_view(['GET'])
def get_products(request):
    products = Products.objects.all()
    data = [
        {'id': p.id, 'name': p.name, 'type': p.type, 'price': str(p.price), 'image': p.image.url if p.image else None}
        for p in products
    ]
    return Response(data)


@api_view(['POST'])
def create_product(request):
    name = request.data.get('name', '').strip()
    type = request.data.get('type', '').strip()
    price = request.data.get('price')
    image = request.FILES.get('image')

    if not name or not type or not price:
        return Response({'error': 'name, type and price are required.'}, status=status.HTTP_400_BAD_REQUEST)

    price = parse_price(price)
    if price is None:
        return Response({'error': 'Price must be a positive number up to 99999.99.'}, status=status.HTTP_400_BAD_REQUEST)

    product = Products.objects.create(name=name, type=type, price=price, image=image)
    return Response({'id': product.id, 'name': product.name}, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    profile, _ = UserProfile.objects.get_or_create(user=user)

    if request.method == 'GET':
        return Response({
            'name': user.first_name,
            'email': user.email,
            'mobile': profile.mobile,
            'address': profile.address,
            'image': profile.image.url if profile.image else None,
        })

    elif request.method == 'PUT':
        profile.mobile = request.data.get('mobile', profile.mobile)
        profile.address = request.data.get('address', profile.address)
        if request.FILES.get('image'):
            profile.image = request.FILES.get('image')
        profile.save()
        return Response({'message': 'Profile updated successfully.'})


@api_view(['GET', 'PUT', 'DELETE'])
def product_detail(request, id):
    try:
        product = Products.objects.get(id=id)
    except Products.DoesNotExist:
        return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({'id': product.id, 'name': product.name, 'type': product.type, 'price': str(product.price), 'image': product.image.url if product.image else None})

    elif request.method == 'PUT':
        product.name = request.data.get('name', product.name)
        product.type = request.data.get('type', product.type)
        raw_price = request.data.get('price')
        if raw_price is not None:
            parsed = parse_price(raw_price)
            if parsed is None:
                return Response({'error': 'Price must be a positive number up to 99999.99.'}, status=status.HTTP_400_BAD_REQUEST)
            product.price = parsed
        if request.FILES.get('image'):
            product.image = request.FILES.get('image')
        product.save()
        return Response({'message': 'Product updated.'})

    elif request.method == 'DELETE':
        product.delete()
        return Response({'message': 'Product deleted.'})