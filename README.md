# Go Barber Server API

### Technologies

- Node.js
- Docker
- Postgres
- MongoDB

### Running the app

### Pre requisites

- Docker
- Node.js

### Setup

```bash
git clone repoURL
cd repo
yarn
```

### Run tests

```bash
yarn test
```

### Run development server (the database settings are at ormconfig.json)

#### - The api will start at localhost:3333

```bash
docker run --name postgres -e POSTGRES-PASSWORD=docker -p 5432:5432 -d postgres ## create postgres container
docker run --name mongodb -p 27017:27017 -d -t mongo                            ## create mongodb container
docker run --name redis -p 6379:6379 -d -t redis:alpine                         ## create redis container

docker start postgres mongodb redis                                             ## start all the containers

yarn typeorm migration:run                                                      ## run the database migrations

yarn dev:server                                                                 ## start node server
```

# API Docs

## Entities

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;

  avatar?: string;
  avatar_url?: string;
  isProvider?: bool;
}
```

#### Routes

| **Endpoint**                | **Description**                | **Header**                            | **Query** | **Body**                                                           | **Response**      |
| --------------------------- | ------------------------------ | ------------------------------------- | --------- | ------------------------------------------------------------------ | ----------------- |
| **POST** _/sessions_        | Login/Authenticate user        | -                                     | -         | `{email: string, password: string}`                                | `{User[], token}` |
| **POST** _/users_           | Creates a new user             | Auth: Bearer Token                    | -         | `{name: string, email: string, password: string}`                  | User              |
| **PATCH** _/users/avatar_   | Updates user avatar            | Auth: Bearer Token, Multipart: avatar | -         | -                                                                  | User              |
| **GET** _/profile_          | Get authenticated user profile | Auth: Bearer Token                    | -         | -                                                                  | User              |
| **PUT** _/profile_          | Update user profile            | Auth: Bearer Token                    | -         | `{email: string, name: string, isProvider: bool, user_id: string}` | User              |
| **POST** _/password/forgot_ | Send recover password e-mail   | -                                     | -         | `{email: string}`                                                  | -                 |
| **POST** _/password/reset_  | Reset user password            | -                                     | -         | `{token: string, password: string, password_confirmation: string}` | -                 |

---

### Appointment

```typescript
interface Appointment {
  provider_id: string;
  user_id: string;
  date: Date;
  id: string;
  created_at: Date;
  updated_at: Date;
}
```

#### Routes

| **Endpoint**                                   | **Description**                        | **Header**         | **Query**                     | **Body**                            | **Response**                                                                                                |
| ---------------------------------------------- | -------------------------------------- | ------------------ | ----------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **GET** _/providers/:provider_id/availability_ | Get provider month/day availability    | Auth: Bearer Token | `year, month, day (optional)` | -                                   | `MonthAvailability { {day: 1, available: true}, ...} or Day Availability {{hour: 8, available: true}, ...}` |
| **GET** _/providers_                           | List all providers                     | Auth: Bearer Token | -                             | -                                   | User[]                                                                                                      |
| **GET** _/appointments/me_                     | List authenticated user's appointments | Auth: Bearer Token | `year, month, day`            | -                                   | Appointment[]                                                                                               |
| **POST** _/appointments_                       | Create new appointment                 | Auth: Bearer Token | -                             | `{provider_id: string, date: Date}` | Appointment                                                                                                 |

---

### Notification

```typescript
interface Notification {
  id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: Date;
  updated_at: Date;
}
```

#### Routes

| **Endpoint**                | **Description**                        | **Header**         | **Query**         | **Body**                    | **Response**   |
| --------------------------- | -------------------------------------- | ------------------ | ----------------- | --------------------------- | -------------- |
| **GET** _/notifications_    | Get authenticated user's notifications | Auth: Bearer Token | -                 | -                           | Notification[] |
| **PATCH** _/notifications_  | Mark notification as read              | Auth: Bearer Token | -                 | `{notification_id: string}` | -              |
| **DELETE** _/notifications_ | Delete notification                    | Auth: Bearer Token | `notification_id` | -                           | -              |
