from rest_framework import serializers

from webapp.models import Quote


class QuoteSerializer(serializers.ModelSerializer):
    rating = serializers.IntegerField(read_only=True)

    class Meta:
        model = Quote
        fields = ('id', 'text', 'author', 'email', 'added', 'rating')