from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from api_v1.serializers import QuoteSerializer
from webapp.models import Quote, STATUS_CHECKED


class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.none()
    serializer_class = QuoteSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Quote.objects.all()
        return Quote.objects.filter(status=STATUS_CHECKED)

    def get_permissions(self):
        print(self.action)
        if self.action not in ['update', 'partial_update', 'destroy']:
            return [AllowAny()]
        return [IsAuthenticated()]


    @action(methods=['patch'], detail=True)
    def rate_up(self, request, pk=None):
        quote = self.get_object()
        quote.rating += 1
        quote.save()
        print(quote)
        return Response({'id': quote.pk, 'rating': quote.rating})

    @action(methods=['patch'], detail=True)
    def rate_down(self, request, pk=None):
        quote = self.get_object()
        quote.rating -= 1
        quote.save()
        return Response({'id': quote.pk, 'rating': quote.rating})


class LogoutView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            user.auth_token.delete()
        return Response({'status': 'ok', 'message':'Вы вышли'})