# GreenSky Workflow Reference

## Overview

GreenSky is a financing partner for Hamburg Overhead Door. Customers apply for credit, and HOD submits deposit transaction requests against approved applications. This reference covers the full lifecycle.

## Email Detection

- **From:** `noreply@greenskycredit.com`
- **Internal mentions:** Emails from sales reps (Mario, Jordan, etc.) containing "Greensky", "GS", or "GreenSky"

## Workflow Steps

### Step 1: Application Pending
**Trigger:** Sales rep says customer is "applying" or "going with Greensky"

**Action:** Alert William to:
1. Log into GreenSky dealer portal (credentials in password manager)
2. Find the application by customer name or App ID
3. Submit a **50% deposit** transaction request

### Step 2: Transaction Authorized
**Trigger:** Email with subject containing "Transaction Request Authorized By Customer"

**Action:** Alert William to:
1. **Update Work Order:** Add deposit info (amount, date, App ID) to the related WO
2. **Reply to sender:** Confirm deposit is received/receipted
3. **Advise Sales:** Tell the originating sales rep they can now submit the order to Jason for processing

## Key Identifiers

| Field | Example |
|---|---|
| App ID | 2611002817 |
| Amount | $1,342.00 |
| Customer | Jason Mackiewicz |
| WO Number | 216211 |

## Common Threads

- Sales sends WO with "door is broken, handle right away" → urgent
- William replies "Submitted deposit request" → starts workflow
- GreenSky sends "Transaction Authorized" → deposit confirmed
- William updates WO → workflow complete
