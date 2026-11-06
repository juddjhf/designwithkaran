# Design With Karan

A React/Vite portfolio and service-request frontend with an Express/MongoDB API. Customers submit a service request with their contact details and project requirements; admins manage requests in the dashboard. Service prices remain available as service display content and do not affect requests.

## Requirements

- Node.js 20.19+ (or 22.12+) and npm
- MongoDB connection string
- Cloudinary account for image/reference uploads

## Local setup

1. Install frontend dependencies from the project root:

   ```sh
   npm install
   ```

2. Set `VITE_API_URL` in the root `.env` (see `.env.example`).

3. Configure the API:

   ```sh
   cd backend
   npm install
   ```

   Copy `backend/.env.example` to `backend/.env`. Set `MONGO_URI` to the intended MongoDB database, a random `JWT_SECRET` of at least 32 characters, `JWT_EXPIRES_IN`, `CLIENT_ORIGIN`, and Cloudinary credentials. `MONGODB_URI` remains supported as a legacy alias; if both Mongo URI variables are set, they must match. Set `ADMIN_EMAIL` and a unique password of at least 12 characters for the first admin.

4. Create the initial admin and editable demo services:

   ```sh
   npm run seed:admin
   npm run seed:services
   ```

   `seed:admin` creates the configured admin only if it does not already exist. To reset its password later, update `ADMIN_PASSWORD` in `backend/.env` and run `npm run reset:admin-password`. `seed:services` only inserts the editable INR sample prices when no services exist. Review all demo pricing before accepting orders.

5. In separate terminals, start the API and frontend:

   ```sh
   cd backend
   npm run dev
   ```

   ```sh
   npm run dev
   ```

6. Sign in at `/admin/login` and configure the real contact details in Settings before launch. The email/contact fields are intentionally blank until supplied.

## Main routes

- `/` — portfolio home
- `/about`, `/work`, `/videos`, `/services`, `/contact`
- `/book/:serviceId` — submit a service request
- `/order/:orderId` — private request confirmation and status
- `/admin/login`, `/admin` — protected studio dashboard
- `GET /api/health` — API health check

Orders start as `New Request`. Admins can update them to `Accepted`, `In Progress`, `Revision`, `Completed`, or `Cancelled`.

## Deployment notes

- Deploy the frontend and API on HTTPS and set `CLIENT_ORIGIN` to the exact frontend origin(s).
- Keep backend secrets only in the hosting provider's secret manager; never expose them in Vite variables.
- Configure MongoDB backups, Cloudinary upload limits/retention, and email/notification delivery as needed.
- Replace demo portfolio cards and demo services with Karan's approved content and final pricing.
