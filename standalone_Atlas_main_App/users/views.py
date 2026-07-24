import secrets
from rest_framework import viewsets
from .models import User
from .models import Organization, Workspace, WorkspaceMembership, WorkspaceInvite, Team
from .serializers import UserSerializer, TeamSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied
from .serializers import LoginSerializer, RegisterSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from .serializers import AdminUserSerializer
from .serializers import OrganizationSerializer, WorkspaceSerializer, WorkspaceMembershipSerializer, WorkspaceInviteSerializer
from rest_framework.decorators import action
from rest_framework.throttling import ScopedRateThrottle
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str


# 🔥 NEW IMPORTS
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer


# ============================
# USER VIEWSET (UPDATED 🔥)
# ============================
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        user = self.request.user
        if user and user.is_authenticated and (getattr(user, "role", None) in ["ORG_ADMIN", "SUPERADMIN", "HR"] or user.is_staff):
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def get_serializer_class(self):
        user = self.request.user
        is_admin_or_hr = user and user.is_authenticated and (getattr(user, "role", None) in ["ORG_ADMIN", "SUPERADMIN", "HR"] or user.is_staff)
        if is_admin_or_hr:
            return AdminUserSerializer
        return UserSerializer

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "username", None) == "sattuadmin":
            return User.objects.all().order_by("id")
        
        org = user.organization
        if org:
            return User.objects.filter(
                workspace_memberships__workspace__organization=org
            ).distinct().order_by("id")
        return User.objects.filter(id=user.id)

    def perform_create(self, serializer):
        request_user = self.request.user
        is_superuser = request_user.is_staff or request_user.username == "sattuadmin"
        
        if not is_superuser:
            new_role = serializer.validated_data.get("role")
            if new_role in ["ORG_ADMIN", "SUPERADMIN"]:
                raise ValidationError({"role": "You cannot create a user with ORG_ADMIN or SUPERADMIN role."})
        
        org_id = serializer.validated_data.pop("organization_id", None)
        
        user = serializer.save()
        
        # Associate user with organization
        target_org = None
        if is_superuser and org_id:
            try:
                target_org = Organization.objects.get(id=org_id)
            except Organization.DoesNotExist:
                raise ValidationError({"organization_id": "Organization does not exist."})
        elif not is_superuser:
            target_org = request_user.organization
            
        if target_org:
            workspace = target_org.workspaces.first()
            if not workspace:
                workspace = Workspace.objects.create(
                    organization=target_org,
                    name="General Workspace",
                    slug="general-workspace",
                    created_by=request_user
                )
            
            # Check seat limit
            current_users = User.objects.filter(
                workspace_memberships__workspace__organization=target_org
            ).distinct().count()
            if current_users >= target_org.allotted_users:
                user.delete()
                raise ValidationError({"detail": f"Cannot create user. The organization '{target_org.name}' has reached its limit of {target_org.allotted_users} allotted users."})
                
            WorkspaceMembership.objects.get_or_create(
                workspace=workspace,
                user=user,
                defaults={"role": "MEMBER"}
            )

    def perform_update(self, serializer):
        user = self.get_object()
        request_user = self.request.user
        is_superuser = request_user.is_staff or request_user.username == "sattuadmin"
        
        if not is_superuser:
            # Cannot modify an ADMIN or superuser
            if user.role in ["ORG_ADMIN", "SUPERADMIN"] or user.is_staff or user.username == "sattuadmin":
                raise PermissionDenied("You cannot modify an administrator or superuser.")
            
            # Cannot change role to ADMIN
            new_role = serializer.validated_data.get("role")
            if new_role in ["ORG_ADMIN", "SUPERADMIN"]:
                raise ValidationError({"role": "You cannot assign the ORG_ADMIN or SUPERADMIN role."})
                
        serializer.save()

    def perform_destroy(self, instance):
        request_user = self.request.user
        is_superuser = request_user.is_staff or request_user.username == "sattuadmin"
        
        if not is_superuser:
            if instance.role in ["ORG_ADMIN", "SUPERADMIN"] or instance.is_staff or instance.username == "sattuadmin":
                raise PermissionDenied("You cannot delete an administrator or superuser.")
        instance.delete()


# ============================
# REGISTER VIEW 🔥
# ============================
class RegisterView(APIView):
    throttle_scope = "auth"
    throttle_classes = [ScopedRateThrottle]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # 🔥 Generate tokens and auto-login
            refresh = RefreshToken.for_user(user)

            response = Response({
                "access": str(refresh.access_token),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": getattr(user, "role", None),
                    "organization": user.organization.id if user.organization else None,
                    "organization_name": user.organization_name,
                }
            }, status=status.HTTP_201_CREATED)

            # 🔥 STORE REFRESH TOKEN IN COOKIE
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=False,   # ⚠️ True in production (HTTPS)
                samesite="Lax"
            )

            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================
# 🔑 PASSWORD RESET REQUEST VIEW
# ============================
class PasswordResetRequestView(APIView):
    throttle_scope = "auth"
    throttle_classes = [ScopedRateThrottle]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            # Look for active user with this email
            user = User.objects.filter(email__iexact=email, is_active=True).first()
            
            if user:
                # Generate reset token and uid
                token = default_token_generator.make_token(user)
                uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
                
                # Construct link (pointing to frontend reset page)
                reset_link = f"http://localhost:5173/reset-password?uid={uidb64}&token={token}"
                
                # Send email
                subject = "Password Reset Request - ERP System"
                message = (
                    f"Hello {user.username},\n\n"
                    f"We received a request to reset your password for your ERP account.\n"
                    f"Please click the link below or copy and paste it into your browser to choose a new password:\n\n"
                    f"{reset_link}\n\n"
                    f"If you did not request this, please ignore this email.\n\n"
                    f"Thanks,\nThe ERP Team"
                )
                
                send_mail(
                    subject=subject,
                    message=message,
                    from_email="noreply@erp.local",
                    recipient_list=[email],
                    fail_silently=False
                )
                
            # Always return a success response to prevent email discovery/enumeration
            return Response(
                {"detail": "If an account matches that email, a password reset link has been sent."},
                status=status.HTTP_200_OK
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================
# 🔑 PASSWORD RESET CONFIRM VIEW
# ============================
class PasswordResetConfirmView(APIView):
    throttle_scope = "auth"
    throttle_classes = [ScopedRateThrottle]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            uidb64 = serializer.validated_data["uidb64"]
            token = serializer.validated_data["token"]
            new_password = serializer.validated_data["new_password"]
            
            try:
                # Decode uid and get user
                uid = force_str(urlsafe_base64_decode(uidb64))
                user = User.objects.get(pk=uid, is_active=True)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                user = None
                
            if user is not None and default_token_generator.check_token(user, token):
                # Token is valid, update password
                user.set_password(new_password)
                user.save()
                return Response(
                    {"detail": "Your password has been reset successfully. You can now log in with your new password."},
                    status=status.HTTP_200_OK
                )
                
            return Response(
                {"detail": "The password reset link is invalid or has expired. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================
# LOGIN VIEW (UPDATED 🔥)
# ============================
class LoginView(APIView):
    throttle_scope = "auth"
    throttle_classes = [ScopedRateThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            # 🔥 Generate tokens
            refresh = RefreshToken.for_user(user)

            response = Response({
                "access": str(refresh.access_token),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": getattr(user, "role", None),
                    "organization": user.organization.id if user.organization else None,
                    "organization_name": user.organization_name,
                }
            })

            # 🔥 STORE REFRESH TOKEN IN COOKIE
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=False,   # ⚠️ True in production (HTTPS)
                samesite="Lax"
            )

            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================
# 🔥 ME VIEW
# ============================
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": getattr(user, "role", None),
            "organization": user.organization.id if user.organization else None,
            "organization_name": user.organization_name,
        })


# ============================
# 🔥 COOKIE TOKEN REFRESH VIEW
# ============================
class CookieTokenRefreshView(APIView):
    throttle_scope = "auth"
    throttle_classes = [ScopedRateThrottle]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"detail": "No refresh token"}, status=401)

        try:
            serializer = TokenRefreshSerializer(data={"refresh": refresh_token})
            serializer.is_valid(raise_exception=True)
            payload = serializer.validated_data

            response = Response({
                "access": payload["access"]
            })
            new_refresh = payload.get("refresh")
            if new_refresh:
                response.set_cookie(
                    key="refresh_token",
                    value=new_refresh,
                    httponly=True,
                    secure=False,
                    samesite="Lax"
                )
            return response

        except (TokenError, ValidationError):
            return Response(
                {"detail": "Invalid or expired token"},
                status=401
            )


# ============================
# 🔥 LOGOUT VIEW
# ============================
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({
            "detail": "Logged out successfully"
        })

        # 🔥 DELETE COOKIE
        response.delete_cookie("refresh_token")

        return response


class OrganizationViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        user = self.request.user
        if user and user.is_authenticated and (user.is_staff or user.username == "sattuadmin"):
            return [IsAuthenticated()]
        from rest_framework.permissions import IsAdminUser
        return [IsAdminUser()]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "username", None) == "sattuadmin":
            return Organization.objects.all().order_by("name")
        return Organization.objects.filter(
            workspaces__memberships__user=user
        ).distinct().order_by("name")

    def perform_create(self, serializer):
        org = serializer.save()
        # Automatically create a default workspace for this organization
        Workspace.objects.create(
            organization=org,
            name="General Workspace",
            slug="general-workspace",
            created_by=self.request.user
        )


class WorkspaceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkspaceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "username", None) == "sattuadmin":
            return Workspace.objects.select_related("organization", "created_by").prefetch_related("memberships__user").all().order_by("name")
        
        # Org Admin (ORG_ADMIN) can see all workspaces in their organization
        if getattr(user, "role", None) in ["ORG_ADMIN", "SUPERADMIN"]:
            org = user.organization
            if org:
                return Workspace.objects.filter(organization=org).select_related("organization", "created_by").prefetch_related("memberships__user").order_by("name")
            return Workspace.objects.none()
            
        # Regular user only sees workspaces they are explicitly a member of
        return Workspace.objects.filter(
            memberships__user=user
        ).distinct().select_related("organization", "created_by").prefetch_related("memberships__user").order_by("name")

    def perform_create(self, serializer):
        user = self.request.user
        is_superuser = user.is_staff or user.username == "sattuadmin"
        
        if not is_superuser:
            org = user.organization
            if not org:
                raise ValidationError("You do not belong to any organization.")
            serializer.validated_data["organization"] = org
            
        workspace = serializer.save(created_by=user)
        WorkspaceMembership.objects.get_or_create(
            workspace=workspace,
            user=user,
            defaults={"role": "OWNER"},
        )

    @action(detail=True, methods=["get"])
    def members(self, request, pk=None):
        workspace = self.get_object()
        serializer = WorkspaceMembershipSerializer(workspace.memberships.select_related("user"), many=True)
        return Response(serializer.data)


class WorkspaceMembershipViewSet(viewsets.ModelViewSet):
    queryset = WorkspaceMembership.objects.select_related("workspace", "user").all().order_by("-id")
    serializer_class = WorkspaceMembershipSerializer
    permission_classes = [IsAuthenticated]


class WorkspaceInviteViewSet(viewsets.ModelViewSet):
    queryset = WorkspaceInvite.objects.select_related("workspace", "invited_by").all().order_by("-created_at")
    serializer_class = WorkspaceInviteSerializer
    permission_classes = [IsAuthenticated]
    throttle_scope = "invites"
    throttle_classes = [ScopedRateThrottle]

    def perform_create(self, serializer):
        invite = serializer.save(
            invited_by=self.request.user,
            token=secrets.token_hex(16),
        )
        send_mail(
            subject=f"Invitation to join {invite.workspace.name}",
            message=f"You were invited to join {invite.workspace.name}. Invite token: {invite.token}",
            from_email="noreply@erp.local",
            recipient_list=[invite.email],
            fail_silently=True,
        )


class TeamViewSet(viewsets.ModelViewSet):
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "username", None) == "sattuadmin":
            return Team.objects.all().order_by("name")
        org = user.organization
        if org:
            return Team.objects.filter(organization=org).order_by("name")
        return Team.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ["ORG_ADMIN", "HR"] and getattr(user, "username", None) != "sattuadmin":
            raise PermissionDenied("Only Org Admin and HR can create teams")
        org = user.organization
        if not org:
            raise ValidationError("You do not belong to any organization")
        serializer.save(organization=org)

    @action(detail=True, methods=["post"])
    def add_member(self, request, pk=None):
        request_user = request.user
        if request_user.role not in ["ORG_ADMIN", "HR"] and getattr(request_user, "username", None) != "sattuadmin":
            raise PermissionDenied("Only Org Admin and HR can add members to teams")
        
        team = self.get_object()
        email = request.data.get("email")
        role = request.data.get("role", "DEVELOPER")
        
        if not email:
            raise ValidationError("Email is required")
        
        # Verify role is one of the valid choices
        valid_roles = [choice[0] for choice in User.RoleChoices.choices]
        if role not in valid_roles:
            raise ValidationError(f"Invalid role choices. Valid options are: {', '.join(valid_roles)}")

        # Check if user already exists
        user = User.objects.filter(email=email).first()
        if not user:
            # Check if user exists by username
            user = User.objects.filter(username=email).first()
            if not user:
                raise ValidationError("User with this email/username does not exist in the system.")

        # Ensure user belongs to the same organization
        if user.organization != team.organization and getattr(request_user, "username", None) != "sattuadmin":
            raise PermissionDenied("You can only add users belonging to your organization to this team.")
        
        # Ensure user role is eligible (cannot be ORG_ADMIN, HR, or SUPERADMIN)
        if user.role in ["ORG_ADMIN", "HR", "SUPERADMIN"]:
            raise ValidationError("HR and Admin users cannot be added to team spaces.")
        
        team.members.add(user)
        
        return Response({
            "success": True,
            "created_new_user": False,
            "user": UserSerializer(user).data
        })

