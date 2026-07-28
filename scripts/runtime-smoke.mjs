import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function loadModule(relativePath) {
  const absolutePath = path.join(root, relativePath);
  return import(pathToFileURL(absolutePath).href);
}

function findPageLoader(node) {
  if (Array.isArray(node)) {
    for (const item of node) {
      const loader = findPageLoader(item);
      if (loader) {
        return loader;
      }
    }

    return null;
  }

  if (!node || typeof node !== "object") {
    return null;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key === "page" && Array.isArray(value) && typeof value[0] === "function") {
      return value[0];
    }

    const loader = findPageLoader(value);
    if (loader) {
      return loader;
    }
  }

  return null;
}

async function renderBuiltPage(relativePath, props) {
  const pageModule = await loadModule(relativePath);
  const loader = findPageLoader(pageModule.default?.routeModule?.userland?.loaderTree);

  assert(loader, `${relativePath} did not expose a page loader`);

  const loadedModule = await loader();
  assert(typeof loadedModule.default === "function", `${relativePath} page loader was invalid`);

  return loadedModule.default(props);
}

async function loadBuiltRouteHandlers(relativePath) {
  const routeModule = await loadModule(relativePath);
  const handlers = routeModule.default?.routeModule?.userland;

  assert(handlers && typeof handlers === "object", `${relativePath} did not expose route handlers`);

  return handlers;
}

async function main() {
  const results = [];

  const homeTree = await renderBuiltPage(".next/server/app/(marketing)/page.js");
  assert(Boolean(homeTree), "home page did not render");
  results.push("home page");

  const pricingTree = await renderBuiltPage(".next/server/app/(marketing)/pricing/page.js");
  assert(Boolean(pricingTree), "pricing page did not render");
  results.push("pricing page");

  const dashboardTree = await renderBuiltPage(".next/server/app/(app)/dashboard/page.js");
  assert(Boolean(dashboardTree), "dashboard page did not render");
  results.push("dashboard page");

  const plannerTree = await renderBuiltPage(".next/server/app/(app)/planner/page.js");
  assert(Boolean(plannerTree), "planner page did not render");
  results.push("planner page");

  const examTree = await renderBuiltPage(".next/server/app/(marketing)/exam/[examSlug]/page.js", {
    params: Promise.resolve({ examSlug: "cpa" })
  });
  assert(Boolean(examTree), "exam page did not render");
  results.push("dynamic exam page");

  const packTree = await renderBuiltPage(".next/server/app/(marketing)/packs/[slug]/page.js", {
    params: Promise.resolve({ slug: "aud-quickstart-pack" })
  });
  assert(Boolean(packTree), "pack page did not render");
  results.push("dynamic pack page");

  const guideTree = await renderBuiltPage(
    ".next/server/app/(marketing)/free-guides/[slug]/page.js",
    {
    params: Promise.resolve({ slug: "cpa-starter-guide" })
    }
  );
  assert(Boolean(guideTree), "free-guide page did not render");
  results.push("dynamic guide page");

  const thankYouTree = await renderBuiltPage(
    ".next/server/app/(marketing)/free-guides/[slug]/thank-you/page.js",
    {
      params: Promise.resolve({ slug: "cpa-starter-guide" })
    }
  );
  assert(Boolean(thankYouTree), "thank-you page did not render");
  results.push("dynamic thank-you page");

  const studyTree = await renderBuiltPage(
    ".next/server/app/(app)/study/[packSlug]/[[...lessonSlug]]/page.js",
    {
      params: Promise.resolve({ packSlug: "aud-quickstart-pack", lessonSlug: [] })
    }
  );
  assert(Boolean(studyTree), "study page did not render");
  results.push("dynamic study page");

  const leadCaptureRoute = await loadBuiltRouteHandlers(
    ".next/server/app/api/lead-capture/route.js"
  );
  const invalidLeadResponse = await leadCaptureRoute.POST(
    new Request("http://localhost/api/lead-capture", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "bad-email", freeGuideSlug: "cpa-starter-guide" })
    })
  );
  assert(invalidLeadResponse.status === 400, "lead-capture invalid request should be 400");
  results.push("lead-capture invalid");

  const validLeadResponse = await leadCaptureRoute.POST(
    new Request("http://localhost/api/lead-capture", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: "student@example.com",
        freeGuideSlug: "cpa-starter-guide",
        marketingOptIn: true
      })
    })
  );
  const validLeadJson = await validLeadResponse.json();
  assert(validLeadResponse.status === 200, "lead-capture valid request should be 200");
  assert(validLeadJson.guide.slug === "cpa-starter-guide", "lead-capture returned wrong guide");
  results.push("lead-capture valid");

  const checkoutRoute = await loadBuiltRouteHandlers(".next/server/app/api/checkout/route.js");
  const invalidCheckoutResponse = await checkoutRoute.POST(
    new Request("http://localhost/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({})
    })
  );
  assert(invalidCheckoutResponse.status === 400, "checkout invalid request should be 400");
  results.push("checkout invalid");

  const validCheckoutResponse = await checkoutRoute.POST(
    new Request("http://localhost/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ packSlug: "aud-quickstart-pack" })
    })
  );
  assert(validCheckoutResponse.status === 303, "checkout should redirect in demo mode");
  assert(
    validCheckoutResponse.headers.get("location")?.includes("/checkout/success?demo=1") ?? false,
    "checkout redirect location was not the demo success page"
  );
  results.push("checkout valid demo");

  const emailCheckoutResponse = await checkoutRoute.POST(
    new Request("http://localhost/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        packSlug: "aud-quickstart-pack",
        email: "student@example.com"
      })
    })
  );
  assert(emailCheckoutResponse.status === 303, "checkout email-first request should redirect in demo mode");
  results.push("checkout email-first demo");

  const lessonProgressRoute = await loadBuiltRouteHandlers(
    ".next/server/app/api/lesson-progress/route.js"
  );
  const lessonProgressResponse = await lessonProgressRoute.POST(
    new Request("http://localhost/api/lesson-progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        lessonId: "44444444-4444-4444-8444-444444444444",
        completed: true
      })
    })
  );
  assert(lessonProgressResponse.status === 401, "lesson-progress should require auth");
  results.push("lesson-progress auth guard");

  const savedLessonsRoute = await loadBuiltRouteHandlers(
    ".next/server/app/api/saved-lessons/route.js"
  );
  const savedLessonsResponse = await savedLessonsRoute.POST(
    new Request("http://localhost/api/saved-lessons", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        lessonId: "44444444-4444-4444-8444-444444444444",
        saved: true
      })
    })
  );
  assert(savedLessonsResponse.status === 401, "saved-lessons should require auth");
  results.push("saved-lessons auth guard");

  const reconcileRoute = await loadBuiltRouteHandlers(
    ".next/server/app/api/auth/reconcile/route.js"
  );
  const reconcileResponse = await reconcileRoute.POST();
  assert(reconcileResponse.status === 401, "auth reconcile should require auth");
  results.push("reconcile auth guard");

  const exportRoute = await loadBuiltRouteHandlers(
    ".next/server/app/api/admin/leads/export/route.js"
  );
  const exportResponse = await exportRoute.GET();
  assert(exportResponse.status === 403, "lead export should require admin auth");
  results.push("lead export auth guard");

  const webhookRoute = await loadBuiltRouteHandlers(
    ".next/server/app/api/stripe/webhooks/route.js"
  );
  const webhookResponse = await webhookRoute.POST(
    new Request("http://localhost/api/stripe/webhooks", {
      method: "POST",
      body: ""
    })
  );
  const webhookJson = await webhookResponse.json();
  assert(webhookResponse.status === 200, "webhook fallback should be 200");
  assert(
    String(webhookJson.message).includes("disabled"),
    "webhook fallback message should explain disabled state"
  );
  results.push("webhook fallback");

  const callbackRoute = await loadBuiltRouteHandlers(".next/server/app/auth/callback/route.js");
  const callbackResponse = await callbackRoute.GET(
    new Request("http://localhost/auth/callback?next=%2Fdashboard")
  );
  assert(callbackResponse.status === 307, "auth callback should redirect");
  assert(
    callbackResponse.headers.get("location")?.endsWith("/dashboard") ?? false,
    "auth callback redirect should point to dashboard"
  );
  results.push("auth callback redirect");

  const unsafeCallbackResponse = await callbackRoute.GET(
    new Request("http://localhost/auth/callback?next=https%3A%2F%2Fexample.com%2Fphish")
  );
  assert(
    unsafeCallbackResponse.headers.get("location") === "http://localhost/dashboard",
    "auth callback should reject external redirect targets"
  );
  results.push("auth callback safe redirect");

  const signOutRoute = await loadBuiltRouteHandlers(".next/server/app/auth/sign-out/route.js");
  const signOutResponse = await signOutRoute.GET(new Request("http://localhost/auth/sign-out"));
  assert(signOutResponse.status === 307, "sign-out should redirect");
  assert(
    signOutResponse.headers.get("location") === "http://localhost/",
    "sign-out redirect should point to home"
  );
  results.push("sign-out redirect");

  const mobileBootstrapRoute = await loadBuiltRouteHandlers(
    ".next/server/app/api/mobile/bootstrap/route.js"
  );
  const mobileBootstrapResponse = await mobileBootstrapRoute.GET(
    new Request("http://localhost/api/mobile/bootstrap")
  );
  const mobileBootstrapJson = await mobileBootstrapResponse.json();
  assert(mobileBootstrapResponse.status === 200, "mobile bootstrap should return 200");
  assert(Array.isArray(mobileBootstrapJson.packs), "mobile bootstrap should include packs");
  results.push("mobile bootstrap");

  const mobileManifestRoute = await loadBuiltRouteHandlers(
    ".next/server/app/api/mobile/download-manifest/route.js"
  );
  const mobileManifestResponse = await mobileManifestRoute.GET(
    new Request("http://localhost/api/mobile/download-manifest?packSlug=aud-quickstart-pack")
  );
  const mobileManifestJson = await mobileManifestResponse.json();
  assert(mobileManifestResponse.status === 200, "mobile download manifest should return 200 in demo mode");
  assert(mobileManifestJson.pack.slug === "aud-quickstart-pack", "mobile manifest should return the requested pack");
  results.push("mobile download manifest");

  const mobileSyncRoute = await loadBuiltRouteHandlers(".next/server/app/api/mobile/sync/route.js");
  const mobileSyncResponse = await mobileSyncRoute.POST(
    new Request("http://localhost/api/mobile/sync", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        client: "runtime-smoke",
        mutations: [
          {
            id: "mutation-1",
            operation: "lesson_progress",
            recordId: "44444444-4444-4444-8444-444444444444",
            payload: {
              lessonId: "44444444-4444-4444-8444-444444444444",
              completed: true
            },
            createdAt: new Date().toISOString()
          }
        ]
      })
    })
  );
  const mobileSyncJson = await mobileSyncResponse.json();
  assert(mobileSyncResponse.status === 200, "mobile sync should return 200 in demo mode");
  assert(mobileSyncJson.acceptedMutationIds.includes("mutation-1"), "mobile sync should accept demo mutation");
  results.push("mobile sync demo");

  console.log(`Runtime smoke checks passed (${results.length}):`);
  for (const result of results) {
    console.log(`- ${result}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
