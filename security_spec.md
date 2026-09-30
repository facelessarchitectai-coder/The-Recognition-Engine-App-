# Security Specification & Test Matrix

## 1. Data Invariants

1. **User Identity Invariant**: Documents in `/users/{userId}`, `/users/{userId}/workspaces/{workspaceId}`, and `/users/{userId}/creations/{creationId}` belong exclusively to the user where `request.auth.uid == userId`.
2. **Owner Verification Invariant**: Any write or update to `workspaces` or `creations` must have `incoming().ownerId == request.auth.uid` and path variable `{userId} == request.auth.uid`.
3. **No Cross-Tenant Read/Write**: User A cannot read, list, create, update, or delete any record under User B's `/users/{userId}` hierarchy.
4. **Unauthenticated Access Block**: All unauthenticated requests (`request.auth == null`) are strictly denied on all paths.
5. **Catch-All Default Deny**: All unmapped collections or paths are blocked by `{document=**} { allow read, write: if false; }`.
6. **Payload Boundary Limits**: String fields like `refText` and `title` must be bounded in length to prevent resource exhaustion / Denial of Wallet attacks.

---

## 2. The Dirty Dozen Payloads (Designed to Break Security Boundaries)

1. **Spoofed Owner UID on Workspace Create**:
   - Attacker authenticated as `user_bob` sends payload with `ownerId: "user_alice"` to `/users/user_alice/workspaces/default`.
   - *Expected Result*: `PERMISSION_DENIED`.
2. **Unauthenticated Profile Access**:
   - Anonymous/unauthenticated request attempts `get` on `/users/user_alice`.
   - *Expected Result*: `PERMISSION_DENIED`.
3. **Cross-User Workspace Read**:
   - `user_bob` attempts `get` or `list` on `/users/user_alice/workspaces`.
   - *Expected Result*: `PERMISSION_DENIED`.
4. **Ghost Field Injection (Shadow Update)**:
   - Authenticated user sends `isAdmin: true` or `role: "superuser"` inside a workspace update.
   - *Expected Result*: `PERMISSION_DENIED` (strict schema validation via `affectedKeys()`).
5. **Path Variable Mismatch**:
   - `user_bob` sends write to `/users/user_bob/workspaces/default` but with `ownerId: "user_alice"`.
   - *Expected Result*: `PERMISSION_DENIED`.
6. **Immortal Field Tampering (ownerId alteration)**:
   - `user_alice` attempts to update `/users/user_alice/workspaces/default` by changing `ownerId` to `user_bob`.
   - *Expected Result*: `PERMISSION_DENIED` (`incoming().ownerId == existing().ownerId`).
7. **Junk ID Poisoning Attack**:
   - Request to `/users/user_alice/workspaces/` with a 2KB junk character ID.
   - *Expected Result*: `PERMISSION_DENIED` (`isValidId` check).
8. **Denial-of-Wallet Payload Flooding**:
   - `refText` payload containing 2MB string.
   - *Expected Result*: `PERMISSION_DENIED` (`size() <= 10000`).
9. **Creation Tampering by Third Party**:
   - `user_bob` attempts `delete` on `/users/user_alice/creations/creation_123`.
   - *Expected Result*: `PERMISSION_DENIED`.
10. **Client-Forced Global Collection Read**:
    - Direct query requesting all users `/users` without scoping to user's UID.
    - *Expected Result*: `PERMISSION_DENIED` (no blanket reads, no root collection list).
11. **Direct Test Connection Ping**:
    - `getDocFromServer(doc(db, 'test', 'connection'))` by authenticated or unauthenticated user for offline connectivity verification.
    - Handled safely or allowed read for connection check.
12. **Unverified Email Impersonation**:
    - Attacker with fake unverified email token trying to access protected records.
    - *Expected Result*: `PERMISSION_DENIED`.
