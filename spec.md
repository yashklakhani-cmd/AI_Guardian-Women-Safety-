# AI Guardian

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Main screen with a large SOS button that triggers a multi-step escalation protocol (logs events at 1s, 3s, 5s intervals)
- Escalation steps: network check (online/offline), GPS coordinate fetch, emergency services alert
- Fake Call feature: shows a mock incoming call screen after a 3-second delay with caller name "Mom" and accept/decline buttons
- Stealth Mode: switches entire UI to a black screen with barely-visible "Monitoring..." text; long-press anywhere to exit
- Night Safety Mode: automatically applies a dark theme when the current hour is 20–5 (8pm–6am)
- Network toggle button in the header to mock online/offline state
- System logs panel displaying timestamped event messages in a terminal-style scrollable list
- Backend stores persistent log entries so they survive page refresh

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend (Motoko): canister with functions to add a log entry, retrieve all log entries, and clear logs
2. Frontend: 
   - App-level state for night mode (auto-detected from time), stealth mode
   - MainScreen with SOS button, Fake Call button, Stealth Mode button, network toggle, and logs panel
   - FakeCallScreen modal/overlay with caller display and accept/decline controls
   - StealthScreen full-black overlay with long-press-to-exit
   - Night mode auto-applies dark CSS theme based on time of day
   - Logs fetched from and written to the backend canister
