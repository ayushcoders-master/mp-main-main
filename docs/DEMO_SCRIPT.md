# Five-Minute Demo Script

## Before the review

- Start MongoDB and the app with `npm run dev`.
- Configure the initial admin account in `.env.local` before starting the server.
- Keep a traveler registration email ready; do not display credentials during the demo.

## Demo Flow

### 0:00-0:40 | Register a traveler

**Do:** Open the app, choose Register, and create a traveler account.

**Say:** “This system gives travelers a transparent, rule-based estimate using NCRB 2022 crime baselines and the trip context they provide. It is an advisory tool, not an emergency service.”

### 0:40-1:35 | Delhi night walk, solo

**Do:** Open the dashboard and search Delhi. Choose Calculate My Travel Risk, set Travel Window to Night, Arrival Time to 23:00, Travel Party to Solo, and Planned Transport to Walking. Choose Solo Traveler and re-evaluate.

**Say:** “I’m checking a solo walking trip in Delhi at night. The score combines Delhi’s NCRB baseline with the selected time, party, and transport factors; the result is capped at 94.”

### 1:35-2:15 | Goa daytime comparison

**Do:** Search Goa, open Calculate My Travel Risk, select Day, Solo, and Public transport, then re-evaluate. Compare the score and tier with Delhi.

**Say:** “Goa does not have a city row in this NCRB dataset, so its baseline uses the state-level proxy. This is a useful comparison, but it is not a live or absolute safety probability.”

### 2:15-3:10 | Explain the factors

**Do:** Return to the Delhi result and scroll to the explainable risk breakdown. Point out the crime baseline, time, transport, weather, and group/incident contributions.

**Say:** “Each displayed contribution comes from a documented weight. The weights are expert judgments, not trained model parameters, and the five contributions reconcile to the raw score before the final cap.”

### 3:10-4:10 | Inspect the safety map

**Do:** Open Safety Map from the navigation and inspect crime and emergency-service layers. Point out the incident-position disclosure.

**Say:** “Incident positions are approximate or simulated when exact coordinates are not stored. This map is for orientation, not a verified live incident feed.”

### 4:10-5:00 | Review the admin dashboard

**Do:** Sign out, sign in with the preconfigured admin account, then open Admin Hub. Show the crime data and prediction summaries.

**Say:** “Administrators can review the stored records and submitted feedback. The scoring model runs in-process; there is no separate Python or machine-learning service.”

## Known Limitations

- NCRB frequency and severity inputs are relative percentile scores, not probabilities or absolute measures of personal danger.
- The crime baseline is a 2022 snapshot and does not include a live crime feed.
- Destinations without city-level NCRB records may use a state-level proxy; states and cities are not strictly comparable because reporting practices differ.
- The model is a deterministic, explainable rule-based formula with expert-selected weights, not a trained machine-learning model.
- Incident map positions may be approximate or simulated; they should not be interpreted as verified crime locations.
