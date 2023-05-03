import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
import { mongooseConnect } from "@admin/lib/mongoose";
// import { isAdminRequest } from "@admin/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { isAdminRequest } from "./auth/[...nextauth]";

const bucketName = process.env.AWS_S3_BUCKET_NAME;

interface FileRequest {
  fields: any;
  files: any;
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method allow only POST" });
  }

  await mongooseConnect();
  await isAdminRequest(req, res);

  const form = new multiparty.Form();
  const { fields, files } = await new Promise<FileRequest>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    }
  );

  const client = new S3Client({
    region: "ap-southeast-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });
  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split(".").pop();
    const newFilename = Date.now() + "." + ext;
    const contentType = mime.lookup(file.path);
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFilename,
        Body: fs.readFileSync(file.path),
        ContentType: contentType ? contentType : undefined,
      })
    );
    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
    links.push(link);
  }
  return res.json({ links });
}

export const config = {
  api: { bodyParser: false },
};
