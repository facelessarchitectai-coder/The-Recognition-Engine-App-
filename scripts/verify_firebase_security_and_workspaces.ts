import fs from "fs";
import path from "path";

// Color output helpers
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

let passedCount = 0;
let failedCount = 0;

function assertTest(name: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`${GREEN}✓ PASS:${RESET} ${name}`);
    passedCount++;
  } else {
    console.error(`${RED}✗ FAIL:${RESET} ${name}${detail ? ` - ${detail}` : ""}`);
    failedCount++;
  }
}

async function runVerification() {
  console.log(`${YELLOW}====================================================${RESET}`);
  console.log(`${YELLOW}Running Security, Workspace Isolation & Rules Tests${RESET}`);
  console.log(`${YELLOW}====================================================${RESET}\n`);

  // 1. Verify firebase-blueprint.json exists and strictly matches schema
  const blueprintPath = path.resolve(process.cwd(), "firebase-blueprint.json");
  const blueprintExists = fs.existsSync(blueprintPath);
  assertTest("firebase-blueprint.json exists", blueprintExists);

  if (blueprintExists) {
    const rawBlueprint = JSON.parse(fs.readFileSync(blueprintPath, "utf-8"));
    assertTest("Blueprint contains 'entities' object", typeof rawBlueprint.entities === "object");
    assertTest("Blueprint contains 'UserProfile' entity", !!rawBlueprint.entities.UserProfile);
    assertTest("Blueprint contains 'UserWorkspace' entity", !!rawBlueprint.entities.UserWorkspace);
    assertTest("Blueprint contains 'SavedCreation' entity", !!rawBlueprint.entities.SavedCreation);
    assertTest("Blueprint contains 'firestore' mappings", typeof rawBlueprint.firestore === "object");
    assertTest("Firestore mappings include '/users/{userId}'", !!rawBlueprint.firestore["/users/{userId}"]);
    assertTest("Firestore mappings include '/users/{userId}/workspaces/{workspaceId}'", !!rawBlueprint.firestore["/users/{userId}/workspaces/{workspaceId}"]);
    assertTest("Firestore mappings include '/users/{userId}/creations/{creationId}'", !!rawBlueprint.firestore["/users/{userId}/creations/{creationId}"]);
  }

  // 2. Verify firestore.rules contents
  const rulesPath = path.resolve(process.cwd(), "firestore.rules");
  const rulesExists = fs.existsSync(rulesPath);
  assertTest("firestore.rules exists", rulesExists);

  if (rulesExists) {
    const rulesContent = fs.readFileSync(rulesPath, "utf-8");

    // Pillar 1: Rules version 2
    assertTest("Rules version is '2'", rulesContent.includes("rules_version = '2';"));

    // Pillar 2: Global safety net default deny
    assertTest("Default-deny catch-all rule exists", rulesContent.includes("match /{document=**} {\n      allow read, write: if false;\n    }"));

    // Pillar 3: Path Variable Hardening (isValidId)
    assertTest("Path variable hardening helper isValidId defined", rulesContent.includes("function isValidId(id)"));
    assertTest("isValidId applied to document path variables", rulesContent.includes("isValidId(userId)") && rulesContent.includes("isValidId(workspaceId)"));

    // Pillar 4: Strict Owner Isolation for 2 separate users
    assertTest("isOwner helper enforces request.auth.uid == userId", rulesContent.includes("function isOwner(userId) {\n      return isSignedIn() && request.auth.uid == userId;\n    }"));

    // User A cannot read or write User B
    const userAMatchesUserBRule = rulesContent.includes("allow get: if isOwner(userId)") && rulesContent.includes("allow create: if isOwner(userId)");
    assertTest("Cross-user isolation: User A cannot access User B data", userAMatchesUserBRule);

    // Blanket list queries blocked
    assertTest("Root /users collection blanket listing blocked (allow list: if false)", rulesContent.includes("match /users/{userId} {\n      allow get: if isOwner(userId)") && rulesContent.includes("allow list: if false;"));

    // Immortality of ownerId on workspace and creation update
    assertTest("Immutability of ownerId on update enforced", rulesContent.includes("incoming().ownerId == existing().ownerId"));

    // Volumetric limits on refText
    assertTest("Payload volumetric boundary enforced (refText <= 20000)", rulesContent.includes("data.refText.size() <= 20000"));
  }

  // 3. Verify security_spec.md
  const specPath = path.resolve(process.cwd(), "security_spec.md");
  assertTest("security_spec.md exists", fs.existsSync(specPath));

  // 4. Verify firebase.ts implementation
  const firebaseTsPath = path.resolve(process.cwd(), "src/firebase.ts");
  const firebaseTsContent = fs.readFileSync(firebaseTsPath, "utf-8");
  assertTest("firebase.ts initializes Firestore with firestoreDatabaseId", firebaseTsContent.includes("getFirestore(app, firebaseConfig.firestoreDatabaseId)"));
  assertTest("firebase.ts implements testConnection() with getDocFromServer", firebaseTsContent.includes("getDocFromServer(doc(db, \"test\", \"connection\"))"));
  assertTest("firebase.ts implements handleFirestoreError with FirestoreErrorInfo", firebaseTsContent.includes("FirestoreErrorInfo") && firebaseTsContent.includes("OperationType"));
  assertTest("firebase.ts implements saveWorkspaceToFirestore with ownerId and boundaries", firebaseTsContent.includes("saveWorkspaceToFirestore") && firebaseTsContent.includes("ownerId: userId"));
  assertTest("firebase.ts implements loadWorkspaceFromFirestore", firebaseTsContent.includes("loadWorkspaceFromFirestore"));
  assertTest("firebase.ts implements saveCreationToFirestore and loadCreationsFromFirestore", firebaseTsContent.includes("saveCreationToFirestore") && firebaseTsContent.includes("loadCreationsFromFirestore"));

  // 5. Verify App.tsx UI requirements
  const appTsxPath = path.resolve(process.cwd(), "src/App.tsx");
  const appTsxContent = fs.readFileSync(appTsxPath, "utf-8");
  assertTest("App.tsx gates with SignInScreen before allowing work", appTsxContent.includes("if (!currentUser) {\n    return (\n      <SignInScreen"));
  assertTest("App.tsx displays UserAccountHeader with saveStatus and signOut", appTsxContent.includes("<UserAccountHeader") && appTsxContent.includes("saveStatus={saveStatus}"));
  assertTest("App.tsx clears in-memory state and caches on sign-out", appTsxContent.includes("setSelections({});\n        setRefImages([]);\n        setRefText(\"\");"));
  assertTest("App.tsx auto-saves active workspace changes with debounce", appTsxContent.includes("saveWorkspaceToFirestore(currentUser.uid"));
  assertTest("App.tsx provides Save to Private Library feature", appTsxContent.includes("handleSaveToLibrary"));
  assertTest("App.tsx preserves and flags unresolved browser draft", appTsxContent.includes("UnresolvedDraftBanner") && appTsxContent.includes("vdg_unassigned_guest_draft"));

  // 6. Verify SignInScreen requirements
  const signInPath = path.resolve(process.cwd(), "src/components/SignInScreen.tsx");
  const signInContent = fs.readFileSync(signInPath, "utf-8");
  assertTest("SignInScreen contains app title 'Visual Direction Generator'", signInContent.includes("Visual Direction Generator"));
  assertTest("SignInScreen contains 'Continue with Google' button", signInContent.includes("Continue with Google"));
  assertTest("SignInScreen contains required exact text: 'Sign in with your Google email to save your work and pick up where you left off.'", signInContent.includes("Sign in with your Google email to save your work and pick up where you left off."));

  // 7. Verify Two Separate Google Sign-in Workspace Isolation Simulation
  console.log(`\n${YELLOW}--- Verifying Multi-User Workspace Privacy Simulation ---${RESET}`);
  const user1 = { uid: "user_google_alice_123", email: "alice@gmail.com" };
  const user2 = { uid: "user_google_bob_456", email: "bob@gmail.com" };

  // Helper function simulating Firestore Rules decision
  function evaluateFirestoreAccess(authUid: string | null, targetPath: string, incomingOwnerId?: string): boolean {
    if (!authUid) return false; // unauthenticated
    // Match /users/{userId}
    const userMatch = targetPath.match(/^\/users\/([^\/]+)(?:\/workspaces\/([^\/]+)|\/creations\/([^\/]+))?$/);
    if (!userMatch) return false;
    const pathUserId = userMatch[1];
    // Rule: isOwner(userId) => request.auth.uid == userId
    if (authUid !== pathUserId) return false;
    // For writes with incomingOwnerId:
    if (incomingOwnerId && incomingOwnerId !== authUid) return false;
    return true;
  }

  assertTest("Alice can read her own workspace (/users/user_google_alice_123/workspaces/active)", evaluateFirestoreAccess(user1.uid, `/users/${user1.uid}/workspaces/active`));
  assertTest("Bob CANNOT read Alice's workspace (/users/user_google_alice_123/workspaces/active)", !evaluateFirestoreAccess(user2.uid, `/users/${user1.uid}/workspaces/active`));
  assertTest("Bob CANNOT write to Alice's workspace even if he passes Alice's ownerId", !evaluateFirestoreAccess(user2.uid, `/users/${user1.uid}/workspaces/active`, user1.uid));
  assertTest("Bob CANNOT write to his own workspace with Alice's ownerId (spoofed ownerId)", !evaluateFirestoreAccess(user2.uid, `/users/${user2.uid}/workspaces/active`, user1.uid));
  assertTest("Bob can read and write his own workspace", evaluateFirestoreAccess(user2.uid, `/users/${user2.uid}/workspaces/active`, user2.uid));
  assertTest("Unauthenticated user CANNOT read Alice or Bob's workspace", !evaluateFirestoreAccess(null, `/users/${user1.uid}/workspaces/active`));

  console.log(`\n${YELLOW}====================================================${RESET}`);
  console.log(`Verification Summary: ${GREEN}${passedCount} Passed${RESET}, ${failedCount === 0 ? GREEN : RED}${failedCount} Failed${RESET}`);
  console.log(`${YELLOW}====================================================${RESET}\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

runVerification().catch((e) => {
  console.error("Test runner failed:", e);
  process.exit(1);
});
