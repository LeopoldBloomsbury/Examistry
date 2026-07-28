import {
  getMobileAuthSession,
  listPendingSyncItems,
  markSyncItemsFailed,
  markSyncItemsSynced
} from "../db/database";

export interface SyncResult {
  pushed: number;
  rejected: number;
  mode: "demo" | "server";
}

export async function syncPendingChanges(serverBaseUrl?: string): Promise<SyncResult> {
  const pending = await listPendingSyncItems();

  if (!pending.length) {
    return { pushed: 0, rejected: 0, mode: serverBaseUrl ? "server" : "demo" };
  }

  if (!serverBaseUrl) {
    await markSyncItemsSynced(pending.map((item) => item.id));
    return { pushed: pending.length, rejected: 0, mode: "demo" };
  }

  const session = await getMobileAuthSession();
  const response = await fetch(`${serverBaseUrl.replace(/\/$/, "")}/api/mobile/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {})
    },
    body: JSON.stringify({
      client: "cpa-studypilot-mobile",
      mutations: pending.map((item) => ({
        id: item.id,
        operation: item.operation,
        recordId: item.recordId,
        payload: JSON.parse(item.payloadJson),
        createdAt: item.createdAt
      }))
    })
  });

  if (!response.ok) {
    throw new Error("Sync failed.");
  }

  const result = (await response.json()) as {
    acceptedMutationIds?: string[];
    rejected?: Array<{ id: string; message: string }>;
  };
  const acceptedMutationIds = result.acceptedMutationIds ?? [];
  const rejected = result.rejected ?? [];

  await markSyncItemsSynced(acceptedMutationIds);
  await markSyncItemsFailed(rejected);

  return { pushed: acceptedMutationIds.length, rejected: rejected.length, mode: "server" };
}
