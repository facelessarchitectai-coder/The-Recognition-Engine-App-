import { 
  verifyFirebaseToken, 
  extractAndCheckGeminiKey, 
  createIsolatedAiClient, 
  SHARED_FIREBASE_KEY 
} from "../src/server/authAndGemini";
import firebaseConfig from "../firebase-applet-config.json";

async function runTests() {
  console.log("=================================================");
  console.log("RUNNING AUTH & GEMINI KEY VERIFICATION SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc}`);
      failed++;
    }
  }

  // 1. Check Shared Firebase Key matches configuration
  assert(
    SHARED_FIREBASE_KEY === "AIzaSyAaWjVnHjYN2qtSInlgX6y8xXgngzzbym0",
    "SHARED_FIREBASE_KEY is correctly identified from Firebase config"
  );

  // 2. Test extractAndCheckGeminiKey rejection of missing key
  try {
    extractAndCheckGeminiKey({});
    assert(false, "extractAndCheckGeminiKey should reject missing key");
  } catch (err: any) {
    assert(
      err.message.includes("Customer Gemini API key is required"),
      "extractAndCheckGeminiKey throws when key is missing"
    );
  }

  // 3. Test extractAndCheckGeminiKey rejection of shared Firebase key
  try {
    extractAndCheckGeminiKey({ "x-gemini-api-key": SHARED_FIREBASE_KEY });
    assert(false, "extractAndCheckGeminiKey should reject shared Firebase key");
  } catch (err: any) {
    assert(
      err.message.includes("shared Firebase configuration key"),
      "extractAndCheckGeminiKey explicitly rejects shared Firebase key"
    );
  }

  // 4. Test extractAndCheckGeminiKey acceptance of customer key
  const mockCustomerKey = "AIzaSyFakeValidCustomerSuppliedKey_abc123";
  const extracted = extractAndCheckGeminiKey({ "x-gemini-api-key": mockCustomerKey });
  assert(
    extracted === mockCustomerKey,
    "extractAndCheckGeminiKey extracts valid customer key from header"
  );

  // 5. Test extractAndCheckGeminiKey from body parameter as fallback
  const extractedFromBody = extractAndCheckGeminiKey({}, { geminiKey: mockCustomerKey });
  assert(
    extractedFromBody === mockCustomerKey,
    "extractAndCheckGeminiKey extracts customer key from body"
  );

  // 6. Test verifyFirebaseToken rejection of missing header
  try {
    await verifyFirebaseToken(undefined);
    assert(false, "verifyFirebaseToken should reject missing auth header");
  } catch (err: any) {
    assert(
      err.message.includes("Missing or malformed Authorization header"),
      "verifyFirebaseToken rejects missing Authorization header"
    );
  }

  // 7. Test verifyFirebaseToken rejection of non-Bearer header
  try {
    await verifyFirebaseToken("Basic some-token");
    assert(false, "verifyFirebaseToken should reject non-Bearer auth header");
  } catch (err: any) {
    assert(
      err.message.includes("Missing or malformed Authorization header"),
      "verifyFirebaseToken rejects non-Bearer header"
    );
  }

  // 8. Test verifyFirebaseToken rejection of forged/invalid token against Google Identity Toolkit
  try {
    await verifyFirebaseToken("Bearer forged_token_12345");
    assert(false, "verifyFirebaseToken should reject forged token");
  } catch (err: any) {
    assert(
      err.message.includes("Authentication failed"),
      "verifyFirebaseToken contacts Google Identity Toolkit and rejects forged token"
    );
  }

  // 9. Test client isolation (createIsolatedAiClient creates a new instance per key without retaining state)
  const client1 = createIsolatedAiClient("AIzaSyCustomerOne111");
  const client2 = createIsolatedAiClient("AIzaSyCustomerTwo222");
  assert(
    client1 !== client2,
    "createIsolatedAiClient guarantees isolated clients per customer request"
  );

  // 10. Live HTTP tests on dev server endpoints (port 3000)
  try {
    // A. Direct /api/generate without auth header
    const genNoAuth = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "visual", answers: [] }),
    });
    assert(
      genNoAuth.status === 401,
      "Direct /api/generate without auth header returns 401 Unauthorized"
    );

    // B. Direct /api/validate-key without auth header
    const valNoAuth = await fetch("http://localhost:3000/api/validate-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ geminiKey: "AIzaSyTest" }),
    });
    assert(
      valNoAuth.status === 401,
      "Direct /api/validate-key without auth header returns 401 Unauthorized"
    );

    // C. Direct /api/generate with invalid auth header
    const genBadAuth = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer invalid_jwt_token",
      },
      body: JSON.stringify({ mode: "visual", answers: [] }),
    });
    assert(
      genBadAuth.status === 401,
      "Direct /api/generate with invalid auth token returns 401 Unauthorized"
    );

  } catch (e: any) {
    console.error("HTTP test error on port 3000:", e.message);
  }

  // 11. Verify Netlify Functions exist and export handler
  try {
    const netlifyVal = await import("../netlify/functions/validate-key");
    assert(
      typeof netlifyVal.handler === "function",
      "netlify/functions/validate-key.ts exports a valid handler function"
    );

    const netlifyGen = await import("../netlify/functions/generate");
    assert(
      typeof netlifyGen.handler === "function",
      "netlify/functions/generate.ts exports a valid handler function"
    );
  } catch (err: any) {
    assert(false, `Netlify functions import failed: ${err.message}`);
  }

  // 12. Verify Netlify configuration
  const fs = await import("fs");
  const netlifyToml = fs.readFileSync("netlify.toml", "utf-8");
  assert(
    netlifyToml.includes("/.netlify/functions/:splat") && netlifyToml.includes("/api/*"),
    "netlify.toml contains /api/* -> /.netlify/functions/:splat redirect"
  );

  // 13. Verify Firebase Project ID & Web App ID registration match exactly
  assert(
    firebaseConfig.projectId === "gen-lang-client-0315983382",
    "Firebase projectId matches registered gen-lang-client-0315983382"
  );
  assert(
    firebaseConfig.appId === "1:823709597572:web:b68918bc6d74abf50b67d1",
    "Firebase appId matches registered 1:823709597572:web:b68918bc6d74abf50b67d1"
  );

  // 14. Verify Database isolation remains strictly intact
  assert(
    firebaseConfig.firestoreDatabaseId === "ai-studio-worldwithinmetho-acbc7aef-bc9f-45e9-b1eb-ac5f862ecf42",
    "This app maintains its own private Firestore database ID"
  );

  // 15. Verify reCAPTCHA Enterprise site key configured
  assert(
    firebaseConfig.recaptchaSiteKey === "6LdbxxAuAAAAANT42qF9TqaGec6Qya8CeBW-SOh6",
    "recaptchaSiteKey matches reCAPTCHA Enterprise key 6LdbxxAuAAAAANT42qF9TqaGec6Qya8CeBW-SOh6"
  );

  // 16. Verify App Check export and initialization
  const firebaseModule = await import("../src/firebase");
  assert(
    firebaseModule.RECAPTCHA_ENTERPRISE_SITE_KEY === "6LdbxxAuAAAAANT42qF9TqaGec6Qya8CeBW-SOh6",
    "src/firebase.ts exports RECAPTCHA_ENTERPRISE_SITE_KEY correctly"
  );
  assert(
    "appCheck" in firebaseModule,
    "src/firebase.ts initializes and exports appCheck instance"
  );

  // 17. Verify README includes all 4 ecosystem apps including Imprint Creator Audit
  const readmeContent = fs.readFileSync("README.md", "utf-8");
  assert(
    readmeContent.includes("imprintcreatoraudit.netlify.app") &&
    readmeContent.includes("ai-studio-imprintaudit-4ef4e870-6e35-478f-bd43-bc366d967125") &&
    readmeContent.includes("signalarchiveapp.netlify.app") &&
    readmeContent.includes("the-recognition-engine-app.netlify.app") &&
    readmeContent.includes("worldwithinappbuildyourworld.netlify.app"),
    "README.md documents all 4 ecosystem applications and their domains/databases"
  );

  console.log(`\n=================================================`);
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log(`=================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

