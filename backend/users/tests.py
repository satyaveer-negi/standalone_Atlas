from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import Organization, Workspace, WorkspaceMembership, Team
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes


User = get_user_model()

class OrgAdminTests(APITestCase):
    def setUp(self):
        # Create Superuser
        self.superuser = User.objects.create_superuser(
            username="sattuadmin",
            email="super@admin.com",
            password="password123"
        )
        
        # Create Org 1
        self.org1 = Organization.objects.create(name="Org One", slug="org-one", allotted_users=2)
        self.ws1 = Workspace.objects.create(organization=self.org1, name="Workspace One", slug="workspace-one", created_by=self.superuser)
        
        # Create Org Admin for Org 1
        self.admin1 = User.objects.create_user(username="orgadmin1", email="admin1@org.com", password="password123", role="ORG_ADMIN")
        WorkspaceMembership.objects.create(workspace=self.ws1, user=self.admin1, role="OWNER")
        
        # Create another user in Org 1
        self.user1 = User.objects.create_user(username="user1", email="user1@org.com", password="password123", role="DEVELOPER")
        WorkspaceMembership.objects.create(workspace=self.ws1, user=self.user1, role="MEMBER")
        
        # Create Org 2
        self.org2 = Organization.objects.create(name="Org Two", slug="org-two", allotted_users=5)
        self.ws2 = Workspace.objects.create(organization=self.org2, name="Workspace Two", slug="workspace-two", created_by=self.superuser)
        self.admin2 = User.objects.create_user(username="orgadmin2", email="admin2@org.com", password="password123", role="ORG_ADMIN")
        WorkspaceMembership.objects.create(workspace=self.ws2, user=self.admin2, role="OWNER")

    def test_org_admin_only_sees_own_org_users(self):
        self.client.force_authenticate(user=self.admin1)
        response = self.client.get(reverse("users-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should see orgadmin1 and user1, but not orgadmin2
        usernames = [u["username"] for u in response.data["results"]]
        self.assertIn("orgadmin1", usernames)
        self.assertIn("user1", usernames)
        self.assertNotIn("orgadmin2", usernames)

    def test_org_admin_only_sees_own_org_workspaces(self):
        self.client.force_authenticate(user=self.admin1)
        response = self.client.get(reverse("workspaces-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        workspace_names = [w["name"] for w in response.data["results"]]
        self.assertIn("Workspace One", workspace_names)
        self.assertNotIn("Workspace Two", workspace_names)

    def test_org_admin_respects_seat_limits(self):
        self.client.force_authenticate(user=self.admin1)
        # Create a new user (limit is 2, currently org has admin1 and user1, so limit is reached)
        response = self.client.post(reverse("users-list"), {
            "username": "user2",
            "email": "user2@org.com",
            "role": "DEVELOPER",
            "password": "password123"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("limit", response.data["detail"])

    def test_org_admin_cannot_assign_admin_role(self):
        self.client.force_authenticate(user=self.admin1)
        # Try to promote user1 to ORG_ADMIN
        response = self.client.patch(reverse("users-detail", args=[self.user1.id]), {
            "role": "ORG_ADMIN"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("You cannot assign the ORG_ADMIN or SUPERADMIN role", str(response.data["role"]))

    def test_deactivated_organization_prevents_login(self):
        # Deactivate Org 1
        self.org1.is_active = False
        self.org1.save()

        # Try to authenticate using Login view
        response = self.client.post(reverse("login"), {
            "username": "user1",
            "password": "password123"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("deactivated", str(response.data))


class RegistrationTests(APITestCase):
    def test_successful_registration(self):
        response = self.client.post(reverse("register"), {
            "username": "newuser",
            "email": "newuser@test.com",
            "password": "password123",
            "organization_name": "New Org"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertEqual(response.data["user"]["username"], "newuser")
        self.assertEqual(response.data["user"]["organization_name"], "New Org")

        # Verify default workspace and relationships were created
        user = User.objects.get(username="newuser")
        self.assertEqual(user.role, "ORG_ADMIN")
        self.assertTrue(Organization.objects.filter(name="New Org").exists())
        self.assertTrue(Workspace.objects.filter(organization__name="New Org", name="General Workspace").exists())
        self.assertTrue(WorkspaceMembership.objects.filter(user=user, workspace__organization__name="New Org", role="OWNER").exists())

    def test_registration_missing_fields(self):
        response = self.client.post(reverse("register"), {
            "username": "newuser",
            "password": "password123",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_registration_duplicate_username(self):
        User.objects.create_user(username="existing", email="existing@test.com", password="password")
        response = self.client.post(reverse("register"), {
            "username": "existing",
            "email": "new@test.com",
            "password": "password123",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)

    def test_registration_duplicate_org_name(self):
        Organization.objects.create(name="Existing Org", slug="existing-org")
        response = self.client.post(reverse("register"), {
            "username": "newuser",
            "email": "new@test.com",
            "password": "password123",
            "organization_name": "Existing Org"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("organization_name", response.data)


class PasswordResetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="resetuser",
            email="resetuser@test.com",
            password="oldpassword123"
        )

    def test_password_reset_request_success(self):
        response = self.client.post(reverse("password_reset_request"), {
            "email": "resetuser@test.com"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("sent", response.data["detail"])

    def test_password_reset_request_nonexistent_email(self):
        # Should still return success response to prevent enumeration
        response = self.client.post(reverse("password_reset_request"), {
            "email": "nonexistent@test.com"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("sent", response.data["detail"])

    def test_password_reset_confirm_success(self):
        # Generate token and uidb64
        token = default_token_generator.make_token(self.user)
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))

        response = self.client.post(reverse("password_reset_confirm"), {
            "uidb64": uidb64,
            "token": token,
            "new_password": "newpassword123"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("success", response.data["detail"])

        # Check that user can log in with new password
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("newpassword123"))

    def test_password_reset_confirm_invalid_token(self):
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        
        response = self.client.post(reverse("password_reset_confirm"), {
            "uidb64": uidb64,
            "token": "invalidtoken",
            "new_password": "newpassword123"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("invalid", response.data["detail"])


class TeamTests(APITestCase):
    def setUp(self):
        # Create Org & Workspace A
        self.org_a = Organization.objects.create(name="Org A", slug="org-a")
        self.ws_a = Workspace.objects.create(organization=self.org_a, name="WS A", slug="ws-a")
        
        self.admin_a = User.objects.create_user(username="admin_a", email="admin_a@test.com", password="password123", role="ORG_ADMIN")
        WorkspaceMembership.objects.create(workspace=self.ws_a, user=self.admin_a, role="OWNER")
        
        self.hr_a = User.objects.create_user(username="hr_a", email="hr_a@test.com", password="password123", role="HR")
        WorkspaceMembership.objects.create(workspace=self.ws_a, user=self.hr_a, role="MEMBER")

        self.dev_a = User.objects.create_user(username="dev_a", email="dev_a@test.com", password="password123", role="DEVELOPER")
        WorkspaceMembership.objects.create(workspace=self.ws_a, user=self.dev_a, role="MEMBER")

        # Create Org & Workspace B
        self.org_b = Organization.objects.create(name="Org B", slug="org-b")
        self.ws_b = Workspace.objects.create(organization=self.org_b, name="WS B", slug="ws-b")
        self.admin_b = User.objects.create_user(username="admin_b", email="admin_b@test.com", password="password123", role="ORG_ADMIN")
        WorkspaceMembership.objects.create(workspace=self.ws_b, user=self.admin_b, role="OWNER")

        # Create Team in Org A
        self.team_a = Team.objects.create(organization=self.org_a, name="Backend Team")

    def test_org_admin_and_hr_can_create_team(self):
        self.client.force_authenticate(user=self.admin_a)
        response = self.client.post(reverse("teams-list"), {"name": "Frontend Team"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Frontend Team")

        self.client.force_authenticate(user=self.hr_a)
        response = self.client.post(reverse("teams-list"), {"name": "QA Team"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_dev_cannot_create_team(self):
        self.client.force_authenticate(user=self.dev_a)
        response = self.client.post(reverse("teams-list"), {"name": "Frontend Team"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_only_sees_own_org_teams(self):
        self.client.force_authenticate(user=self.admin_a)
        # Create a team in Org B
        Team.objects.create(organization=self.org_b, name="Org B Team")

        response = self.client.get(reverse("teams-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should see Backend Team but not Org B Team
        names = [t["name"] for t in response.data["results"]]
        self.assertIn("Backend Team", names)
        self.assertNotIn("Org B Team", names)

    def test_add_member_existing_user(self):
        self.client.force_authenticate(user=self.admin_a)
        url = reverse("teams-add-member", kwargs={"pk": self.team_a.id})
        response = self.client.post(url, {"email": "dev_a@test.com"})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["created_new_user"])
        self.team_a.refresh_from_db()
        self.assertIn(self.dev_a, self.team_a.members.all())

    def test_add_member_fails_for_nonexistent_user(self):
        self.client.force_authenticate(user=self.admin_a)
        url = reverse("teams-add-member", kwargs={"pk": self.team_a.id})
        response = self.client.post(url, {
            "email": "nonexistent_dev@test.com"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("does not exist", str(response.data))

    def test_add_member_fails_for_cross_tenant_user(self):
        self.client.force_authenticate(user=self.admin_a)
        # Attempt to add admin_b (belongs to Org B) to team_a (belongs to Org A)
        url = reverse("teams-add-member", kwargs={"pk": self.team_a.id})
        response = self.client.post(url, {
            "email": "admin_b@test.com"
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("You can only add users belonging to your organization", str(response.data))

    def test_add_member_fails_for_admin_or_hr_role(self):
        self.client.force_authenticate(user=self.admin_a)
        # Attempt to add self.hr_a (HR role) to team_a
        url = reverse("teams-add-member", kwargs={"pk": self.team_a.id})
        response = self.client.post(url, {
            "email": "hr_a@test.com"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("HR and Admin users cannot be added", str(response.data))



