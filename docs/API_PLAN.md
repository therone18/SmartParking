| Endpoint                                 | Method | Auth Required | Description                                          |
| ---------------------------------------- | ------ | ------------- | ---------------------------------------------------- |
| `/api/register/`                         | POST   | No            | Register a new user                                  |
| `/api/login/`                            | POST   | No            | Authenticate and return token/session                |
| `/api/profile/`                          | GET    | Yes           | Get current user's profile                           |
| `/api/profile/update/`                   | PUT    | Yes           | Update user's profile                                |
| `/api/locations/`                        | GET    | No            | List all parking locations                           |
| `/api/locations/`                        | POST   | Admin only    | Create new location                                  |
| `/api/locations/<id>/`                   | GET    | Yes           | Get location details                                 |
| `/api/locations/<id>/`                   | PUT    | Admin only    | Update parking location                              |
| `/api/locations/<id>/`                   | DELETE | Admin only    | Delete parking location                              |
| `/api/locations/search/?q=`              | GET    | No            | Search parking locations by keyword                  |
| `/api/locations/<id>/users/`             | GET    | Admin only    | List users with reservations at this location        |
| `/api/slots/`                            | POST   | Admin only    | Add new slots to a location                          |
| `/api/slots/<location_id>/`              | GET    | Yes           | Get all slots for a location                         |
| `/api/slots/<id>/lock/`                  | POST   | Admin only    | Lock a parking slot                                  |
| `/api/slots/<id>/unlock/`                | POST   | Admin only    | Unlock a parking slot                                |
| `/api/slots/<id>/`                       | DELETE | Admin only    | Delete a parking slot                                |
| `/api/reservations/`                     | POST   | Yes           | Create a new reservation                             |
| `/api/reservations/me/`                  | GET    | Yes           | List current user's reservations                     |
| `/api/reservations/<id>/`                | GET    | Yes           | Get reservation details                              |
| `/api/reservations/<id>/`                | DELETE | Yes           | Cancel a reservation                                 |
| `/api/reservations/all/`                 | GET    | Admin only    | List all reservations                                |
| `/api/reservations/<id>/upload-receipt/` | PATCH  | Yes           | Upload payment receipt (sets status to `processing`) |
| `/api/reservations/<id>/approve/`        | POST   | Admin only    | Approve a reservation (sets status to `reserved`)    |
| `/api/reservations/<id>/status/`         | PUT    | Admin only    | Update reservation status                            |
| `/api/reservations/<id>/in/`             | POST   | Yes           | Mark actual check-in time                            |
| `/api/reservations/<id>/out/`            | POST   | Yes           | Mark actual check-out time                           |
| `/api/users/`                            | GET    | Admin only    | View all users                                       |
| `/api/users/<id>/deactivate/`            | POST   | Admin only    | Deactivate or reactivate a user                      |
| `/api/system/healthcheck/`               | GET    | Yes           | Ping to confirm system health                        |
| `/api/summary/slot-utilization/`         | GET    | Admin only    | Slot usage % per location                            |
| `/api/summary/slot-utilization/overall/` | GET    | Admin only    | Overall slot usage % across all locations            |
| `/api/summary/daily/`                    | GET    | Admin only    | Summary of total reservations per day                |
| `/api/summary/slot-active/`              | GET    | Admin only    | Total number of active (in-use) slots                |
| `/api/summary/slot-overdue/`             | GET    | Admin only    | Total number of overdue (not checked out) slots      |
