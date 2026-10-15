# AI-Powered Tourist Safety Risk Prediction System

Full-stack app (React + Vite + Express + **MongoDB**) that estimates travel risk for Indian destinations, with explainable risk factors, a safety map, emergency services, driving routes and traveller reviews.

> The risk score is a rule-based advisory estimate built on demo data. It is not verified or official safety information.

## Requirements

- Node.js 20 or newer
- MongoDB 6/7 (local install, Docker, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

## Run locally

1. Install dependencies:
   ```
   npm install
   ```
2. Start MongoDB. Easiest with Docker:
   ```
   docker compose up -d
   ```
   (or install MongoDB locally, or use an Atlas connection string)
3. Create your env file:
   ```
   cp .env.example .env.local
   ```
   Then edit `.env.local`:
   - `MONGODB_URI` – e.g. `mongodb://127.0.0.1:27017` or your Atlas URI
   - `JWT_SECRET` – any long random string (required in production)
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD` – creates your first admin account on startup (password 8+ characters)
4. Run the app:
   ```
   npm run dev
   ```
   Open http://localhost:3000, register an account, or log in with the admin you configured.

On the first run the server inserts demo crime records, emergency services and reviews (turn this off with `SEED_DEMO_DATA=false`). Users, predictions and any admin edits are now saved in MongoDB and survive restarts.

## Database

Database name: `MONGODB_DB` (default `tourist_safety`). Collections:

| Collection | Contents |
|---|---|
| `users` | accounts (bcrypt-hashed passwords, unique email index) |
| `crime_stats` | NCRB 2022 baselines: 19 metro cities + 36 States/UTs (see below) |
| `crime_data` | individual incidents entered by admins (starts empty) |
| `predictions` | saved risk predictions per user |
| `emergency_services` | police / hospital entries |
| `reviews` | traveller reviews |
| `feedback` | authenticated user feedback and admin-managed status |
| `meta` | marker that the demo seed already ran |

All database code is in `server/db.ts`; demo data is in `server/seed.ts`. The feedback collection and its indexes are created automatically on server startup. Feedback requires a signed-in account; users can view their own submissions, while administrators manage statuses and delete records through the protected admin dashboard.

## Crime data (NCRB, free and public)

Risk baselines come from the National Crime Records Bureau's **Crime in India 2022** report (Ministry of Home Affairs), stored in `server/data/ncrb2022.json` and imported into the `crime_stats` collection on first start.

- **Metro cities (19):** Ahmedabad, Bengaluru, Chennai, Coimbatore, Delhi, Ghaziabad, Hyderabad, Indore, Jaipur, Kanpur, Kochi, Kolkata, Kozhikode, Lucknow, Mumbai, Nagpur, Patna, Pune, Surat. Uses city-level IPC crime rate per lakh population plus murder, robbery, kidnapping and theft rates (Tables 1B.1 and 1B.4), and women / cyber crime rates from the NCRB metro tables.
- **Other destinations (Goa, Manali, Agra, Varanasi, ...):** NCRB has no city table, so the state-level rate is used as a proxy and the result is labelled lower-confidence (`shared/cityStateMap.ts` maps destinations to states).
- **Anything else:** a neutral 50/50 baseline, clearly labelled "no NCRB data".

How the 0-100 inputs are computed (`server/crimeStats.ts`):
- `frequencyScore` = percentile rank of the IPC crime rate per lakh within its group (19 metros, or 36 States/UTs).
- `severityScore` = percentile ranks of murder (40%), robbery (30%) and kidnapping (30%) rates, weighted.

Limits to state in your report: scores are *relative* (a city at 0 is the lowest of the 19, not "zero risk"); NCRB warns that cities and states are not strictly comparable because reporting practices differ (e.g. online FIR for theft in Delhi, Kerala); the data is a 2022 snapshot; the risk model itself is a rule-based weighting, not a trained ML model.

To rebuild the JSON from the NCRB volumes: `python3 scripts/extract_ncrb.py --vol1 vol1.txt --women women.csv --cyber cyber.csv` (it checks every parsed column against NCRB's own totals). Sources: [Crime in India 2022 on OpenCity](https://data.opencity.in/dataset/crime-in-india-2022) (public domain) and [ncrb.gov.in](https://ncrb.gov.in/crime-in-india.html).

## Place photos

Photos for destinations, heritage sites, sightseeing places and hotels are looked up by name from Wikipedia / Wikimedia Commons through `GET /api/place-image` (`server/routes/placeImageRoutes.ts`; results are cached in memory, no API key needed). The dashboard (`PlacePhoto` in `src/views/TouristDashboard.tsx`) tries that real photo first, then the image URL stored in `src/data/destinationProfiles.ts`, then a placeholder. The server needs outbound internet access to reach `en.wikipedia.org`.

## Production

```
npm run build
NODE_ENV=production npm start
```

Set `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the environment of your host. The server refuses to start without `JWT_SECRET` in production, and exits with a clear message if MongoDB cannot be reached.

## Google Sign-In (optional)

1. In Google Cloud Console, configure the OAuth consent screen and create an OAuth 2.0 Client ID of type **Web application**.
2. Add your app origin (e.g. `http://localhost:3000` and your deployed HTTPS origin) to **Authorized JavaScript origins**.
3. Set `GOOGLE_CLIENT_ID` in `.env.local`, restart the server and open `/login`.

Google tokens are verified on the server; only verified email addresses are accepted. Without `GOOGLE_CLIENT_ID`, password login keeps working.
