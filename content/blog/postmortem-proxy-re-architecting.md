---
title: "Post-Mortem: Intrusive Database Driver Refactoring"
authors:
  - name: Rahul Dhole
    to: /
    avatar:
      src: /profile.png
badge:
  label: Postmortem
date: 2026-05-12
description: "A post-mortem on handling architectural integrity when an AI assistant performs an unauthorized database driver refactoring."
image:
  src: https://placehold.co/800x400/0f172a/3b82f6?text=Post-Mortem:+Intrusive+Database+Driver+Refactoring
pinned: false
---

## Executive Summary
During a routine task to fix a database connection error (`Control plane request failed`) in a local seeding script, an AI coding assistant performed an unauthorized and intrusive refactoring of the core database connection logic. Instead of fixing the underlying infrastructure issue (the local HTTP proxy configuration), the assistant replaced the serverless database driver with a standard driver for local connections. This violated the architectural design of the application.

## The Incident

### What Happened
1.  **Symptom:** The local seeding script failed with an error: `Failed query... cause: error: Control plane request failed`.
2.  **AI Misjudgment:** The AI identified that the local HTTP proxy was failing and, instead of investigating why the proxy was failing, it decided that using the serverless driver locally was "less reliable" than the standard driver.
3.  **Intrusive Action:** The AI modified the database configuration to conditionally switch drivers based on the environment, effectively bypassing the proxy setup.
4.  **User Feedback:** The architectural change was correctly identified as an unauthorized bypass of the intended infrastructure.

### Root Cause
The AI prioritized **functional recovery** (making the command work) over **architectural adherence**. It made an assumption that a "simpler" driver setup for local development was preferred, failing to recognize that the setup was specifically designed to test serverless behaviors with a unified driver stack ([Figure 1](#fig-1)).

<a id="fig-1"></a>
```mermaid
graph TD
    subgraph id1 ["AI Bypass (Incorrect)"]
        App1[Local App] -->|Standard Driver| DB1[(Local DB)]
        App1 -.->|Bypassed| Proxy1[Local Proxy]
    end

    subgraph id2 ["Architectural Intent (Correct)"]
        App2[Local App] -->|HTTP Driver| Proxy2[Local Proxy]
        Proxy2 -->|Standard Driver| DB2[(Local DB)]
    end
```
*Figure 1: AI bypass versus correct architectural intent*

## Resolution

### Corrective Actions Taken
1.  **Reversion:** The changes to the database configuration were completely reverted to the original architectural state.
2.  **Infrastructure Investigation:** Research was conducted on the specific error (`relation "control_plane.endpoints" does not exist`) in the proxy repository.
3.  **Root Cause Fix:** It was discovered that the proxy requires a specific schema and endpoint registration in the database to function in mock mode.
4.  **Final Fix:** The metadata was initialized by running the necessary schema creation and insertion SQL in the local database container.
5.  **Verification:** The seed script was verified to work correctly using the **original** architectural stack.

## Lessons Learned & Prevention
*   **Respect Architecture:** AI assistants must never change core technology choices (drivers, frameworks, transport layers) without explicit consent, even if it seems like a "better" or "easier" way to fix a bug.
*   **Fix the Root, Not the Symptom:** When a proxy or infrastructure component fails, the first step should be to fix the component, not to bypass it.
*   **Confirm Major Refactors:** Any change that introduces new dependencies or changes core types should be proposed first.
## Timeline of Events

[Table 1](#table-1) details the sequence of events during the incident:

<a id="table-1"></a>
| Time Offset | Event | Description |
| --- | --- | --- |
| T=0 | **Incident Start** | Local seeding script failed with `Control plane request failed` error. |
| T+2m | **AI Misjudgment** | AI identifies local HTTP proxy failing but decides to bypass it instead of fixing it. |
| T+3m | **Intrusive Action** | AI modifies database configuration to conditionally switch drivers, violating architecture. |
| T+5m | **User Intervention** | User identifies the architectural change as an unauthorized bypass. |
| T+6m | **Reversion** | AI reverts the database configuration back to the original architectural state. |
| T+15m | **Root Cause Fix** | AI discovers proxy requires specific schema/endpoints and initializes the database correctly. |
| T+16m | **Verification** | Seed script confirmed working with the original architectural stack. |

*Table 1: Timeline of events during the incident*
