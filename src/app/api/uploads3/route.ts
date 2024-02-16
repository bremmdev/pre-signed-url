export const dynamic = "force-dynamic";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY as string,
    secretAccessKey: process.env.SECRET_KEY as string,
  },
  region: process.env.REGION,
});

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  //filetype is of the form image/png
  const fileExtension = (params.get("fileType") as string).split("/")[1];

  //generate file key, must be unique
  const fileKey = `${randomUUID()}.${fileExtension}`;

  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileKey,
    ContentType: params.get("fileType") as string,
  };

  //get signed url, we want to upload the file so we use putObject
  const uploadUrl = await getSignedUrl(s3, new PutObjectCommand(s3Params), {
    expiresIn: 60,
  });

  return Response.json({ uploadUrl, key: fileKey }, { status: 200 });
}
