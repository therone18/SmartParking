
# Smart Parking App (MVP)

A web-based Smart Parking Management system built as part of a timed Trial Project. It allows users to reserve parking slots and upload payment receipts, while admins can manage locations, slots, users, and view analytics.

---

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS  
- **Backend:** Django + Django REST Framework  
- **Database:** PostgreSQL (via Render)  
- **Hosting:**  
  - Frontend: Vercel  
  - Backend: Render  

---

## User Features

- User registration & login  
- View and edit profile (with password change)  
- Browse available parking locations  
- View available slots and make reservations  
- Upload a payment receipt after making a reservation  
- Reservation status: "Pending", "Processing", or "Confirmed"  

---

## Payment Flow

1. After choosing a slot, the user makes a reservation.  
2. They are immediately redirected to upload a **QR payment receipt**.  
3. Reservation remains in **"Processing"** status until an admin confirms the payment.  

---

## Admin Features

- Admin login (separate from user login)  
- Manage parking locations and slots:  
  - Add/edit/delete locations  
  - Add/delete slots  
  - Lock/unlock slots  
- User management:  
  - View all users  
  - Deactivate/reactivate accounts  
- Reservation confirmation:  
  - View all reservations  
  - Review uploaded receipts  
  - Mark reservations as **"Confirmed"**  
- Analytics (see below)  

---

## Admin Analytics

**Implemented:**
- Slot utilization summary per location  
- Chart-ready data format  
- Basic time-based support (daily summaries)

**Not Yet Implemented (But Planned):**
- Peak hour heatmaps  
- Average parking durations  
- Most reserved location rankings  

---

## API Overview

- `/api/auth/register/`, `/login/`, `/profile/`, `/profile/update/`  
- `/api/profile/change-password/`  
- `/api/locations/` – list, create (admin), delete (admin)  
- `/api/slots/` – lock/unlock, add/delete (admin)  
- `/api/reservations/` – create, list, view user’s reservations  
- `/api/reservations/<id>/upload-receipt/` – attach image  
- `/api/users/`, `/deactivate/`, `/reactivate/` (admin)  
- `/api/summary/slot-utilization/` – admin dashboard  
- Protected with JWT authentication  

---

## UI Theme

- **Primary:** `#1E3A8A` (indigo-800)  
- **Accent:** `#3B82F6` (blue-500)  
- **Surface:** White cards, light backgrounds (`bg-slate-50`)  
- **Status colors:** Green (success), Amber (warning), Red (error)  

---

## Folder Structure

```
frontend/
├── src/
│   ├── pages/         # Pages like Login, Dashboard, Profile
│   ├── components/    # Reusable UI components
│   └── services/      # Axios instance

backend/
├── core/
│   ├── views/         # Modular views (auth_views, admin_views, etc.)
│   └── models.py      # ParkingLocation, Slot, Reservation, etc.
```

---

## Known Limitations

- No Google Maps or location routing (out of scope due to time)  
- Basic design only; UI polish and responsiveness can be improved  
- Analytics is limited to slot utilization only  

---

## Replicating the Project Locally

While the app is fully deployed, it can also be cloned and run on another machine. Follow the steps below.

### 1. Clone the Repository

```bash
git clone https://github.com/therone18/smart-parking.git
cd smart-parking
```

---

### 2. Backend Setup (Django + DRF)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# (Optional) Create admin account
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

---

### 3. Frontend Setup (React + Vite)

```bash
cd ../frontend

# Install dependencies
npm install

# Set backend API base URL
echo "VITE_API_URL=http://localhost:8000" > .env

# Run dev server
npm run dev
```

---

### 4. Admin Login (Optional)

Once up and running locally, you can access the admin features using the admin credentials you set up during `createsuperuser`.

---

Built as a timed trial project.  
Thank you Ingenuity for the opportunity!

---

TJBA © 2025
