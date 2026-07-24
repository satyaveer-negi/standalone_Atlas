from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class User(AbstractUser):

    class RoleChoices(models.TextChoices):
        SUPERADMIN = 'SUPERADMIN', 'Super Admin'
        ORG_ADMIN = 'ORG_ADMIN', 'Org Admin'
        HR = 'HR', 'HR'
        PRODUCT_OWNER = 'PRODUCT_OWNER', 'Product Owner'
        TECH_LEAD = 'TECH_LEAD', 'Tech Lead'
        DEVELOPER = 'DEVELOPER', 'Developer'
        TESTER = 'TESTER', 'Tester'
        DESIGNER = 'DESIGNER', 'Designer'

    role = models.CharField(
        max_length=20,
        choices=RoleChoices.choices,
        default=RoleChoices.DEVELOPER
    )

    phone = models.CharField(max_length=15, blank=True, null=True)

    @property
    def organization(self):
        membership = self.workspace_memberships.select_related("workspace__organization").first()
        return membership.workspace.organization if membership else None

    @property
    def organization_name(self):
        org = self.organization
        return org.name if org else None

    def __str__(self):
        return f"{self.username} ({self.role})"


from django.core.validators import MinValueValidator


class Organization(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    allotted_users = models.PositiveIntegerField(
        default=10,
        validators=[MinValueValidator(1)]
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Workspace(models.Model):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="workspaces",
    )
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_workspaces",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("organization", "slug")

    def __str__(self):
        return f"{self.organization.name} / {self.name}"


class WorkspaceMembership(models.Model):
    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="memberships",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="workspace_memberships",
    )
    role = models.CharField(max_length=50, default="MEMBER")
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("workspace", "user")


class WorkspaceInvite(models.Model):
    class StatusChoices(models.TextChoices):
        PENDING = "PENDING", "Pending"
        ACCEPTED = "ACCEPTED", "Accepted"
        EXPIRED = "EXPIRED", "Expired"

    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="invites",
    )
    email = models.EmailField()
    token = models.CharField(max_length=64, unique=True)
    invited_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="sent_workspace_invites",
    )
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("workspace", "email")


class Team(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="teams",
    )
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(User, related_name="teams", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.organization.name})"

