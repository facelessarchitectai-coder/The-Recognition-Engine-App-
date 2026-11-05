# Recognition Engine (Visual Direction Generator)

A quiet, beautiful visual recognition engine that translates aesthetic sensibilities and identity into curated Pinterest search queries, emoji fingerprints, and harmonious palettes using advanced server-side AI.

---

## Shared Multi-App Architecture & Ecosystem Setup

This application is part of a 4-application creative ecosystem hosted on Netlify and backed by a single shared Firebase / Google Cloud project with strictly isolated individual Firestore databases.

### The Four Ecosystem Applications

| Application | Netlify Production Domain | Dedicated Firestore Database ID | Primary Function |
|---|---|---|---|
| **Signal States** | `signalarchiveapp.netlify.app` | *(Dedicated DB)* | Visual and cultural signal archive |
| **Recognition Engine** | `the-recognition-engine-app.netlify.app` | `ai-studio-worldwithinmetho-acbc7aef-bc9f-45e9-b1eb-ac5f862ecf42` | Aesthetic search terms, emoji archive, color systems |
| **World Within** | `worldwithinappbuildyourworld.netlify.app` | *(Dedicated DB)* | Core World Within Method™ workspace |
| **Imprint Creator Audit** | `imprintcreatoraudit.netlify.app` | `ai-studio-imprintaudit-4ef4e870-6e35-478f-bd43-bc366d967125` | Creator voice, identity, and imprint audit |

### Shared Firebase Project Details

- **Firebase Project ID**: `gen-lang-client-0315983382`
- **Registered Web App ID**: `1:823709597572:web:b68918bc6d74abf50b67d1`
- **Auth Domain**: `gen-lang-client-0315983382.firebaseapp.com`
- **OAuth Client ID**: `823709597572-s9rg4nb6r6q30lks67j9d0j6aruku8fo.apps.googleusercontent.com`
- **reCAPTCHA Enterprise Site Key**: `6LdbxxAuAAAAANT42qF9TqaGec6Qya8CeBW-SOh6`
- **This App's Database**: `ai-studio-worldwithinmetho-acbc7aef-bc9f-45e9-b1eb-ac5f862ecf42` *(strictly preserved)*

---

## Firebase Console & External Configuration Checklist

> **Note**: The code changes (App Check initialization, API key isolation, and routing) have been completed in the codebase. The items below require Google Cloud / Firebase console owner actions and cannot be verified programmatically by code alone.

### 1. Firebase Authentication Authorized Domains
In the [Firebase Console](https://console.firebase.google.com/project/gen-lang-client-0315983382/authentication/settings) under **Authentication > Settings > Authorized domains**, ensure all four production domains and preview environments are listed:

- [ ] `the-recognition-engine-app.netlify.app` (Recognition Engine)
- [ ] `signalarchiveapp.netlify.app` (Signal States)
- [ ] `worldwithinappbuildyourworld.netlify.app` (World Within)
- [ ] `imprintcreatoraudit.netlify.app` (Imprint Creator Audit)
- [ ] `localhost` (Local development)
- [ ] `gen-lang-client-0315983382.firebaseapp.com` (Default Firebase domain)

### 2. reCAPTCHA Enterprise Key Authorized Domains
In the [Google Cloud Console reCAPTCHA Enterprise](https://console.cloud.google.com/security/recaptcha) under key `6LdbxxAuAAAAANT42qF9TqaGec6Qya8CeBW-SOh6`, ensure domain enforcement includes all four apps:

- [ ] `the-recognition-engine-app.netlify.app`
- [ ] `signalarchiveapp.netlify.app`
- [ ] `worldwithinappbuildyourworld.netlify.app`
- [ ] `imprintcreatoraudit.netlify.app`
- [ ] `localhost`

### 3. Firebase App Check Registration
In the [Firebase Console App Check](https://console.firebase.google.com/project/gen-lang-client-0315983382/appcheck) tab:

- [ ] Register web app `1:823709597572:web:b68918bc6d74abf50b67d1` with reCAPTCHA Enterprise provider using key `6LdbxxAuAAAAANT42qF9TqaGec6Qya8CeBW-SOh6`.
- [ ] Set TTL / token auto-refresh according to security policies.
- [ ] Keep enforcement in **Monitoring** mode until live Netlify verification on all 4 apps confirms token acquisition, then switch to **Enforced**.

---

## Application Access Sequence

The application strictly enforces this 3-step entry order:
1. **Google Sign-In**: Validates identity via Firebase Auth.
2. **Customer Gemini API Key**: Masked input with live server-side validation (`/api/validate-key`). Key is isolated to the active session and never stored permanently or logged.
3. **App Access**: Main workspace unlocks only after both steps are validated.

---

## Local Development & Build

```bash
# Install dependencies
npm install

# Run local development server (port 3000)
npm run dev

# Run production build (Vite client + esbuild server bundle)
npm run build

# Run verification test suite
npx tsx scripts/verify-requirements.ts
```
