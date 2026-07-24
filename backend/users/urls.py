from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    LoginView,
    RegisterView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    MeView,
    CookieTokenRefreshView,
    LogoutView,
    OrganizationViewSet,
    WorkspaceViewSet,
    WorkspaceMembershipViewSet,
    WorkspaceInviteViewSet,
    TeamViewSet,
)

router = DefaultRouter()

# 🔥 IMPORTANT: add basename (prevents routing issues)
router.register(r'users', UserViewSet, basename='users')
router.register(r'organizations', OrganizationViewSet, basename='organizations')
router.register(r'workspaces', WorkspaceViewSet, basename='workspaces')
router.register(r'workspace-memberships', WorkspaceMembershipViewSet, basename='workspace-memberships')
router.register(r'workspace-invites', WorkspaceInviteViewSet, basename='workspace-invites')
router.register(r'teams', TeamViewSet, basename='teams')


urlpatterns = [

    # 🔥 API ROUTES
    path('', include(router.urls)),

    # 🔐 AUTH ROUTES
    path('login/', LoginView.as_view(), name="login"),
    path('register/', RegisterView.as_view(), name="register"),
    path('password-reset/request/', PasswordResetRequestView.as_view(), name="password_reset_request"),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name="password_reset_confirm"),

    path('auth/me/', MeView.as_view(), name="me"),
    path('auth/refresh/', CookieTokenRefreshView.as_view(), name="token_refresh"),
    path('auth/logout/', LogoutView.as_view(), name="logout"),
]

