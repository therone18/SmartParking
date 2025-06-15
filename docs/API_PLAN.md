| Endpoint                                   | Method | Auth Required | Description                                               |
| ------------------------------------------ | ------ | ------------- | ----------------------------------------------------------|
| `/api/register/`                           | POST   | No            | Register a new user                                       |
| `/api/login/`                              | POST   | No            | Authenticate and return token/session (Log in)            |
| `/api/profile/`                            | GET    | Yes           | Get current user's profile                                |
| `/api/profile/update/`                     | PUT    | Yes           | Update user's profile                                     |
| `/api/locations/`                          | GET    | No            | List all parking locations                                |
| `/api/locations/`                          | POST   | Admin only    | Create new location                                       |
| `/api/locations/<id>/`                     | GET    | Yes           | Get Location Details                                      |
| `/api/locations/search/?q=`                | GET    | No            | Search parking locations                                  |
| `/api/locations/<id>/`                     | PUT    | Admin only    | Update parking location                                   |
| `/api/locations/<id>/`                     | DELETE | Admin only    | Delete parking location                                   |
| `/api/locations/<id>/users/`               | GET    | Admin only    | List users with at least one reservation at the location. |
| `/api/slots/`                              | POST   | Admin only    | Add a slot in parking location                            |
| `/api/slots/<location_id>/`                | GET    | Yes           | Get slots for a specific location                         |
| `/api/reservations/`                       | POST   | Yes           | Make a new reservation                                    |
| `/api/reservations/me/`                    | GET    | Yes           | List current user’s reservations                          |
| `/api/reservations/<id>/`                  | DELETE | Yes           | Cancel a reservation                                      |
| `/api/reservations/<id>/`                  | GET    | Yes           | Get Reservation details                                   |
| `/api/reservations/all/`                   | GET    | Admin only    | View all reservations                                     |
| `/api/users/`                              | GET    | Admin only    | View all user accounts                                    |
| `/api/users/<id>/deactivate/`              | POST   | Admin only    | Deactivate a user                                         |
| `/api/reservations/<id>/status`            | PUT    | Admin only    | Toggle slot availability status                           |
| `/api/reservations/<id>/in/`               | POST   | Yes           | Mark time when user last parked in slot                   |
| `/api/reservations/<id>/out/`              | POST   | Yes           | Mark time when user last parked out slot                  | 
| `/api/system/healthcheck/`                 | GET    | Yes           | Ping API to confirm it’s running (for monitoring)         |
| `/api/summary/slot-utilization/`           | GET    | Admin only    | % of slots used per day                                   |
| `/api/summary/slot-utilization/overall/`   | GET    | Admin only    | Overall % of slots used per day                           |
| `/api/summary/daily/`                      | GET    | Admin only    | Get summary: total reservations per day                   |
| `/api/summary/slot-active/`                | GET    | Admin only    | Get total number of active slots                          |
| `/api/summary/slot-overdue/`               | GET    | Admin only    | Get total number of overdue slots                         |