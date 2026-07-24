# Standalone Atlas Execution Engine

Atlas is a high-performance decoupled engineering execution portal designed to run, validate, and track CFD and FEA simulations. It connects externally with a parent Project Management System (or any external system) using standard HTTP webhook events.

## Architecture Layout

```
+------------------------------------+          +------------------------------------+
|  Project Management System         |          |  Standalone Atlas System           |
|  (FE: Port 5173 / BE: Port 8000)   |          |  (FE: Port 5174 / BE: Port 8001)   |
|                                    |          |                                    |
|   +----------------------------+   |          |   +----------------------------+   |
|   |  Webhook Receiver Endpoint |<--+----------+---|  Simulation Webhook Trigger|   |
|   |  (atlas_integration_webhook|   | HTTP POST|   |  (dispatch_external_event) |   |
|   +----------------------------+   |          |   +----------------------------+   |
+------------------------------------+          +------------------------------------+
```

---

## 🛠️ Getting Started & Setup

### 1. Standalone Backend (Django API)

The backend exposes execution endpoints for scheduling simulation runs, managing datasets, and publishing completion payloads externally.

#### Setup Instructions:
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Set up and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install django django-cors-headers djangorestframework requests django-dotenv
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Set environment variables (Optional, defaults to local port 8000 webhook):
   ```env
   PM_WEBHOOK_URL=http://127.0.0.1:8000/api/v1/integrations/atlas/event/
   ```
6. Start the server on port **8001**:
   ```bash
   python manage.py runserver 8001
   ```

---

### 2. Standalone Frontend (Vite + React)

The frontend is a lightweight, responsive dashboard presenting the digital twin workspace, simulation graphs, and active compute states.

#### Setup Instructions:
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the development server (runs automatically on port **5174**):
   ```bash
   npm run dev
   ```

---

## 📡 Webhook Integration Specifications

Atlas notifies your Project Management System using clean POST payloads. Whenever a simulation runs and completes, the backend publishes the following structure:

### `SimulationCompleted` Event
```json
{
  "event_type": "SimulationCompleted",
  "payload": {
    "run_id": "84c8a2b5ef1a2e99d1469e847c2b0c3f",
    "job_id": "550e8400-e29b-41d4-a716-446655440000",
    "file_path": "/storage/runs/84c8a2b5ef1a2e99d1469e847c2b0c3f/output.h5",
    "file_hash": "a8fd8cdb1a2e99d1469e847c2b0c3fa8fd8cdb1"
  },
  "timestamp": "2026-07-24T12:00:00Z"
}
```
If your external system receives this payload, it can automatically update the status of the related issue or baseline documentation!
