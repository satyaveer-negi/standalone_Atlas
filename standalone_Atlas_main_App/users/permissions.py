from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and getattr(user, "role", None) in ["ORG_ADMIN", "SUPERADMIN"]
        )


class IsDeveloper(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and getattr(user, "role", None) == "DEVELOPER"
        )


class IsTester(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and getattr(user, "role", None) == "TESTER"
        )


# 🔥 NEW (RECOMMENDED)
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        return bool(
            user
            and user.is_authenticated
            and getattr(user, "role", None) in ["ORG_ADMIN", "SUPERADMIN"]
        )