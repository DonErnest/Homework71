from rest_framework import permissions



from rest_framework import permissions

class IsAuthenticatedOrReadAddOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        print('entered')
        if 'pk' in view.kwargs and view.kwargs['pk']:
            obj = view.get_object()
            if request.method in permissions.SAFE_METHODS:
                return True
            return request.user.is_authenticated
        else:
            return True