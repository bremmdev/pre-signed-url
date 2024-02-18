export const dynamic = "force-dynamic";

import {
  generateBlobSASQueryParameters,
  ContainerSASPermissions,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  //filetype is of the form image/png
  const fileExtension = (params.get("fileType") as string).split("/")[1];

  //generate file key, must be unique
  const fileKey = `${randomUUID()}.${fileExtension}`;

  const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_ACCOUNT_NAME as string,
    process.env.AZURE_PRIMARY_KEY as string
  );

  // Generate service level SAS for a container
  const containerSAS = generateBlobSASQueryParameters(
    {
      containerName: process.env.AZURE_CONTAINER as string,
      permissions: ContainerSASPermissions.parse("w"), //write permission
      expiresOn: new Date(new Date().valueOf() + 60 * 1000), //expires in 60 seconds
    },
    sharedKeyCredential
  ).toString();

  const uploadUrl = `https://${process.env.AZURE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_CONTAINER}/${fileKey}?${containerSAS}`;

  return Response.json({ uploadUrl, key: fileKey }, { status: 200 });
}

