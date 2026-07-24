from django.db import models
import uuid

class EngineeringJob(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    solver_type = models.CharField(max_length=100) # e.g. "CFD", "FEA"
    parameters = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

class SimulationRun(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('RUNNING', 'Running'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(EngineeringJob, on_delete=models.CASCADE, related_name='runs')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True, default='')

class Dataset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    run = models.OneToOneField(SimulationRun, on_delete=models.CASCADE, related_name='dataset')
    file_path = models.CharField(max_length=500)
    file_hash = models.CharField(max_length=64) # SHA256 checksum
    created_at = models.DateTimeField(auto_now_add=True)
