# Navin Kawal Booking API

Standalone Express, TypeScript, MongoDB, Zod, and Nodemailer service for institutional offline-course booking queries.

## Local setup

1. Copy `.env.example` to `.env` and provide the SMTP credentials and `NAVIN_EMAIL`.
2. Start MongoDB locally.
3. Install and run:

```bash
npm install
npm run dev
```

The API listens on `http://localhost:4000`.

## Docker

From the project root, copy the environment values into a root `.env` file, then run:

```bash
docker compose up --build
```

MongoDB data persists in the `mongo_data` volume. Do not commit SMTP credentials or production database URLs.

## API

`POST /api/bookings` accepts JSON:

```json
{
  "institutionName": "Acme University",
  "contactPerson": "Priya Shah",
  "email": "priya@example.com",
  "phone": "+91 98765 43210",
  "expectedAudience": "40 final-year students",
  "preferredDate": "2027-02-15",
  "selectedModules": ["Presentation Skills", "Interview Skills"]
}
```

Successful submissions return `201` with a `bookingId`. Invalid payloads return `400` with field-level Zod errors. The frontend should submit to `/api/bookings` (or the deployed API origin) and handle `201`, `400`, and `500` responses.

`GET /health` reports API and MongoDB connectivity for deployment health checks.
