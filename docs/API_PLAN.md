| Endpoint                           | Method | Auth Required | Description                                       |
| ---------------------------------  | ------ | ------------- | ------------------------------------------------- |
| `/api/register/`                   | POST   | No            | Register a new user                               |
| `/api/login/`                      | POST   | No            | Authenticate and return token/session             |
| `/api/profile/`                    | GET    | Yes           | Get current user's profile                        |
| `/api/profile/update/`             | PUT    | Yes           | Update user's profile                             |
| `/api/locations/`                  | GET    | No            | List all parking locations                        |
| `/api/locations/`                  | POST   | Admin only    | Create new location                               |
| `/api/locations/<id>/`             | PUT    | Admin only    | Update parking location                           |
| `/api/locations/<id>/`             | DELETE | Admin only    | Delete parking location                           |
| `/api/slots/<location_id>/`        | GET    | Yes           | Get slots for a specific location                 |
| `/api/reservations/`               | POST   | Yes           | Make a new reservation                            |
| `/api/reservations/me/`            | GET    | Yes           | List current user’s reservations                  |
| `/api/reservations/<id>/`          | DELETE | Yes           | Cancel a reservation                              |
| `/api/reservations/all/`           | GET    | Admin only    | View all reservations                             |
| `/api/users/`                      | GET    | Admin only    | View all user accounts                            |
| `/api/users/<id>/deactivate/`      | POST   | Admin only    | Deactivate a user                                 |
| `/api/summary/daily/`              | GET    | Admin only    | Get summary: total reservations per day           |
| `/api/reservations/<id>/status`    | PUT    | Admin only    | Toggle slot availability status                   |
| `/api/locations/search/?q=`        | GET    | No            | Search parking locations                          |
| `/api/reservations/<id>/in/`       | POST   | Yes           | Mark time when user last parked in slot           |
| `/api/reservations/<id>/out/`      | POST   | Yes           | Mark time when user last parked out slot          |
| `/api/system/healthcheck/`         | GET    | Yes           | Ping API to confirm it’s running (for monitoring) |