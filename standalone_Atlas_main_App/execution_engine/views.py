from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import EngineeringJob, SimulationRun, Dataset
from django.utils import timezone
import requests
import os
import hashlib

# Webhook endpoint URL of the external Project Management software
PM_WEBHOOK_URL = os.environ.get("PM_WEBHOOK_URL", "http://127.0.0.1:8000/api/v1/integrations/atlas/event/")

def dispatch_external_event(event_type, payload):
    try:
        data = {
            "event_type": event_type,
            "payload": payload,
            "timestamp": timezone.now().isoformat()
        }
        # Fire-and-forget REST post call to external project management system
        requests.post(PM_WEBHOOK_URL, json=data, timeout=3.0)
    except Exception as e:
        print(f"Failed to dispatch webhook event: {e}")

class EngineeringJobViewSet(viewsets.ModelViewSet):
    queryset = EngineeringJob.objects.all().order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        # Create Job
        name = request.data.get("name")
        solver_type = request.data.get("solver_type", "CFD")
        parameters = request.data.get("parameters", {})
        
        job = EngineeringJob.objects.create(name=name, solver_type=solver_type, parameters=parameters)
        
        # Dispatch event to Project Management system
        dispatch_external_event("JobCreated", {
            "job_id": str(job.id),
            "name": job.name,
            "solver_type": job.solver_type
        })
        
        return Response({"id": job.id, "name": job.name}, status=status.HTTP_201_CREATED)

class SimulationRunViewSet(viewsets.ModelViewSet):
    queryset = SimulationRun.objects.all()
    
    @action(detail=True, methods=["post"], url_path="execute")
    def execute_run(self, request, pk=None):
        run = self.get_object()
        run.status = "RUNNING"
        run.started_at = timezone.now()
        run.save()
        
        # Notify project management externally that simulation has started
        dispatch_external_event("SimulationStarted", {
            "run_id": str(run.id),
            "job_id": str(run.job.id)
        })
        
        # Mocking solver execution success
        run.status = "COMPLETED"
        run.completed_at = timezone.now()
        run.save()
        
        # Create final Dataset
        mock_file_path = f"/storage/runs/{run.id}/output.h5"
        mock_hash = hashlib.sha256(str(run.id).encode()).hexdigest()
        Dataset.objects.create(run=run, file_path=mock_file_path, file_hash=mock_hash)
        
        # Notify project management externally that simulation succeeded
        dispatch_external_event("SimulationCompleted", {
            "run_id": str(run.id),
            "job_id": str(run.job.id),
            "file_path": mock_file_path,
            "file_hash": mock_hash
        })
        
        return Response({"id": run.id, "status": run.status, "file_path": mock_file_path})
