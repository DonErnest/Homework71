from webapp.models import STATUS_CHOICES


def status_generator(request):
    return {'choices': STATUS_CHOICES }