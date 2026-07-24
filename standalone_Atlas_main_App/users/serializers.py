from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import User
from .models import Organization, Workspace, WorkspaceMembership, WorkspaceInvite, Team
def sanitize_text(text):
    return text.strip() if isinstance(text, str) else text


# ============================
# 👤 USER SERIALIZER (SAFE 🔥)
# ============================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role"]

        # 🔥 IMPORTANT: prevent role editing from frontend
        read_only_fields = ["id", "role"]

    # 🔥 OPTIONAL SAFETY (extra layer)
    def update(self, instance, validated_data):
        # prevent role change even if sent manually
        validated_data.pop("role", None)
        return super().update(instance, validated_data)


class AdminUserSerializer(serializers.ModelSerializer):
    organization_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    organization_name = serializers.CharField(read_only=True)
    workspaces = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "is_active", "first_name", "last_name", "organization_id", "organization_name", "workspaces", "password"]

    def get_workspaces(self, obj):
        memberships = obj.workspace_memberships.select_related("workspace")
        return [{"id": m.workspace.id, "name": m.workspace.name} for m in memberships]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class WorkspaceMembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="user",
        write_only=True,
        required=False,
    )

    class Meta:
        model = WorkspaceMembership
        fields = "__all__"
        read_only_fields = ["joined_at"]

    def validate(self, attrs):
        workspace = attrs.get("workspace")
        user = attrs.get("user")

        if workspace and user:
            org = workspace.organization
            # Check if this user is already a member of any workspace in this organization
            is_already_member = WorkspaceMembership.objects.filter(
                workspace__organization=org,
                user=user
            ).exists()

            if not is_already_member:
                current_users = User.objects.filter(
                    workspace_memberships__workspace__organization=org
                ).distinct().count()

                if current_users >= org.allotted_users:
                    raise serializers.ValidationError(
                        f"Cannot add member. The organization '{org.name}' has reached its limit of {org.allotted_users} allotted users."
                    )
        return attrs


class WorkspaceSerializer(serializers.ModelSerializer):
    memberships = WorkspaceMembershipSerializer(many=True, read_only=True)
    organization_name = serializers.CharField(source="organization.name", read_only=True)

    class Meta:
        model = Workspace
        fields = "__all__"

    def validate_name(self, value):
        return sanitize_text(value)


class OrganizationSerializer(serializers.ModelSerializer):
    workspaces = WorkspaceSerializer(many=True, read_only=True)
    used_users = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ["id", "name", "slug", "allotted_users", "used_users", "is_active", "created_at", "workspaces"]

    def get_used_users(self, obj):
        return User.objects.filter(
            workspace_memberships__workspace__organization=obj
        ).distinct().count()

    def validate_name(self, value):
        return sanitize_text(value)

    def validate_allotted_users(self, value):
        if value < 1:
            raise serializers.ValidationError("Allotted users must be at least 1.")
        return value


class WorkspaceInviteSerializer(serializers.ModelSerializer):
    invited_by = UserSerializer(read_only=True)

    class Meta:
        model = WorkspaceInvite
        fields = "__all__"
        read_only_fields = ["token", "invited_by", "created_at", "status"]


# ============================
# 🔐 LOGIN SERIALIZER (UPDATED 🔥)
# ============================
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        # 🔥 FIX: include request (important for some auth backends)
        user = authenticate(
            request=self.context.get("request"),
            username=username,
            password=password
        )

        # ❌ Invalid credentials
        if not user:
            raise serializers.ValidationError("Invalid username or password")

        # ❌ Inactive user
        if not user.is_active:
            raise serializers.ValidationError("User account is disabled")

        # ❌ Inactive organization
        if user.organization and not user.organization.is_active:
            raise serializers.ValidationError("Your organization account is deactivated")

        # ✅ attach user
        data["user"] = user
        return data


# ============================
# 📝 REGISTER SERIALIZER
# ============================
class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    organization_name = serializers.CharField(max_length=255, required=False, allow_blank=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def validate(self, attrs):
        username = attrs["username"]
        org_name = attrs.get("organization_name") or f"{username}'s Org"
        
        # Check uniqueness of organization name
        if Organization.objects.filter(name=org_name).exists():
            raise serializers.ValidationError({"organization_name": f"The organization name '{org_name}' is already taken. Please specify a unique organization name."})
        
        attrs["organization_name"] = org_name
        return attrs

    def create(self, validated_data):
        username = validated_data["username"]
        email = validated_data["email"]
        password = validated_data["password"]
        org_name = validated_data["organization_name"]

        # 1. Create Organization
        org = Organization.objects.create(
            name=org_name,
            slug=org_name.lower().replace(" ", "-").replace("/", "-")[:255],
            allotted_users=10
        )

        # 2. Create User
        user = User.objects.create(
            username=username,
            email=email,
            role=User.RoleChoices.ORG_ADMIN
        )
        user.set_password(password)
        user.save()

        # 3. Create default workspace
        workspace = Workspace.objects.create(
            organization=org,
            name="General Workspace",
            slug="general-workspace",
            created_by=user
        )

        # 4. Create membership
        WorkspaceMembership.objects.create(
            workspace=workspace,
            user=user,
            role="OWNER"
        )

        return user


# ============================
# 🔑 PASSWORD RESET SERIALIZERS
# ============================
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)


class TeamSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    organization_name = serializers.CharField(source="organization.name", read_only=True)

    class Meta:
        model = Team
        fields = ["id", "name", "members", "organization_name", "created_at"]



