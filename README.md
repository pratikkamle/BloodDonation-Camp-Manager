# Blood Donation Camp Manager - Strategic Plan & Architecture (2026)

## Overview
This project is a user-friendly, web-based dashboard for managing blood donation camp data, designed to prevent duplicate entries, support multi-user access, and provide real-time analytics. The solution leverages Google Sheets as the backend for easy export and collaboration, with a modern HTML/JS frontend.

---

## Key Challenges Addressed

- Duplicate donor entries due to manual search and spelling errors
- Multi-user, concurrent data entry (reception, supervisors)
- Real-time dashboard and gender-wise/overall stats
- Data must remain easily exportable (CSV/Excel)
- Adaptable for biannual camps, keeping master data intact

---

## Architecture

### 1. Frontend: Single-Page Web App (HTML/JS)
- Hosted on GitHub Pages (free, no server needed)
- Responsive UI for desktop/tablet/mobile
- Features:
	- Search donor by name or mobile (with fuzzy matching to reduce duplicates)
	- Add/update donor status (Ongoing, Accepted, Rejected)
	- Real-time dashboard: counts by status/gender, hourly updates
	- Export data as CSV/Excel

### 2. Backend: Google Sheets via Apps Script Web API
- Google Sheet as the database (one sheet per camp, or a master sheet with a “Camp Date” column)
- Google Apps Script as a REST API (doGet/doPost for CRUD)
- All edits go through the web app, not direct sheet editing (prevents duplicates)

### 3. Optional: Authentication
- Use Cloudflare Access or Google sign-in for volunteer-only access

---

## Data Model

- Columns: Based on the provided CSV (add a unique `id` for each donor, and a `Camp Date` or `Camp Name` column)
- Status: Ongoing, Accepted, Rejected
- Gender, Age, Group, etc. as per CSV

---

## Duplicate Prevention Strategy

- Fuzzy search (by name and mobile) before adding a new donor
- Show possible matches with similarity score before allowing new entry
- Option to update existing donor if found

---

## Multi-Camp Support

- Option 1: One sheet per camp (easiest for export, but harder for cross-camp analytics)
- Option 2: One master sheet, add a “Camp Date” or “Camp Name” column (recommended for analytics, easier to manage)

---

## Visualization

- Dashboard cards: Ongoing, Accepted, Rejected, Grand Total
- Gender-wise breakdown for each status
- Hourly trend chart (donors per hour)
- All visualizations update in real-time as data changes

---

## Deployment & Workflow

1. Prepare Google Sheet (with correct columns, add `id` and `Camp Date`)
2. Deploy Apps Script as Web API
3. Configure the web app with the API endpoint
4. Host the web app on GitHub Pages
5. Share the link with volunteers
6. All data entry and updates go through the app (not direct sheet editing)
7. Export to CSV/Excel anytime from Google Sheets

---

## Why This Works

- No server or database to manage
- Free, scalable, and familiar tools
- Prevents duplicates with fuzzy search and controlled entry
- Real-time dashboard for supervisors
- Easy export for reporting/MIS
- Adaptable for future camps (just add a new “Camp Date” or duplicate the sheet)

---

## Next Steps

1. Generate the HTML/JS dashboard (ready for GitHub Pages)
2. Provide the Google Apps Script code for your Sheet
3. Instructions for setup and deployment
4. (Optional) Add authentication layer

---

For any questions or to request the latest code, contact the project maintainer.
# BloodDonation-Camp-Manager
This repository is created for managing the MIS data of Blood donation camps
