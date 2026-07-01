export const runtime = "nodejs";

import { BlobServiceClient } from "@azure/storage-blob";

function formatSessionFolderName(isoTime: string) {
  const date = new Date(isoTime);
  if (Number.isNaN(date.getTime())) {
    return "unknown-session-time";
  }

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${String(date.getFullYear()).slice(-2)}:${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function slugifyBlobSegment(value: string) {
  return (
    value
      .trim()
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

function getMilestoneBlobName(milestone: string) {
  const normalized = slugifyBlobSegment(milestone || "snapshot");
  if (
    normalized === "approach-a" ||
    normalized === "approach-b" ||
    normalized === "final-selections"
  ) {
    return normalized;
  }

  return normalized;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER ?? "phase2-data";

    if (!connectionString) {
      return Response.json(
        { ok: false, error: "AZURE_STORAGE_CONNECTION_STRING is missing" },
        { status: 500 }
      );
    }

    const session = body?.session;
    const startTime =
      typeof session?.startTime === "string" ? session.startTime : body?.startTime;
    if (!session || typeof startTime !== "string") {
      return Response.json(
        { ok: false, error: "Missing session payload or startTime" },
        { status: 400 }
      );
    }

    const folderName =
      typeof body?.folderName === "string" && body.folderName.trim().length > 0
        ? body.folderName.trim()
        : formatSessionFolderName(startTime);
    const lastScreenId =
      Array.isArray(session?.screens) && session.screens.length > 0
        ? session.screens[session.screens.length - 1]?.screenId
        : null;
    const screenId =
      typeof body?.screenId === "string" ? body.screenId : (lastScreenId ?? "section");
    const milestone =
      typeof body?.milestone === "string" && body.milestone.trim().length > 0
        ? body.milestone.trim()
        : "snapshot";
    const blobName = `sessions/${folderName}/${getMilestoneBlobName(milestone)}.json`;

    const json = JSON.stringify(
      {
        received_at: new Date().toISOString(),
        folder: folderName,
        blob: blobName,
        sessionId: session.sessionId,
        screenId,
        milestone,
        trigger: body?.trigger ?? "screen_enter",
        session,
      },
      null,
      2
    );

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(Buffer.from(json, "utf8"), {
      blobHTTPHeaders: {
        blobContentType: "application/json",
      },
    });

    return Response.json({
      ok: true,
      blob: blobName,
      folder: folderName,
      milestone,
    });
  } catch (error) {
    console.error(error);

    return Response.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}
