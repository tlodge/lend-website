export const runtime = "nodejs";

import { BlobServiceClient } from "@azure/storage-blob";

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

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const now = new Date();
    const blobName = `test/${now.toISOString().replace(/[:.]/g, "-")}.json`;

    const json = JSON.stringify(
      {
        received_at: now.toISOString(),
        test: true,
        payload: body,
      },
      null,
      2
    );

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(json, Buffer.byteLength(json), {
      blobHTTPHeaders: {
        blobContentType: "application/json",
      },
    });

    return Response.json({
      ok: true,
      blob: blobName,
    });
  } catch (error) {
    console.error(error);

    return Response.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}
