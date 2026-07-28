import { getMobileAuthSession, importCatalogBundle } from "../db/database";
import type { ServerCatalogBundle } from "../types";

export async function bootstrapFromServer(serverBaseUrl: string) {
  const session = await getMobileAuthSession();
  const response = await fetch(`${serverBaseUrl.replace(/\/$/, "")}/api/mobile/bootstrap`, {
    headers: session?.accessToken
      ? {
          Authorization: `Bearer ${session.accessToken}`
        }
      : undefined
  });

  if (!response.ok) {
    throw new Error("Mobile bootstrap failed.");
  }

  const bundle = (await response.json()) as ServerCatalogBundle;
  await importCatalogBundle(bundle);
  return bundle;
}
