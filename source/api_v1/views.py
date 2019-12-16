from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api_v1.permissions import IsAuthenticatedOrReadAddOnly
from api_v1.serializers import QuoteSerializer
from webapp.models import Quote


class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.none()
    serializer_class = QuoteSerializer
    permission_classes = [IsAuthenticatedOrReadAddOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Quote.objects.all()
        return Quote.objects.filter(status='checked')

    def get_object(self):
        self.object = super(QuoteViewSet, self).get_object()
        if self.request.user.is_authenticated:
            return self.object
        else:
            print(self.object.status)
            if self.object.status == 'checked':
                return self.object
            raise ValidationError('Unauthorised users cannot access new quotes!')



    @action(methods=['patch'], detail=True)
    def rate_up(self, request, pk=None):
        quote = self.get_object()
        quote.rating += 1
        quote.save()
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