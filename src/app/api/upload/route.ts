import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION_NAME || "eu-west-1",
  endpoint: process.env.AWS_S3_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Required for Supabase S3 compatibility
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "article_media";

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
    const key = `${folder}/${Date.now()}_${safeName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_STORAGE_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Build the Supabase public URL from the endpoint
    // AWS_S3_ENDPOINT_URL is like: https://[project].supabase.co/storage/v1/s3
    // Public URL format:            https://[project].supabase.co/storage/v1/object/public/[bucket]/[key]
    const endpointBase = process.env.AWS_S3_ENDPOINT_URL!.replace(/\/s3\/?$/, "");
    const publicUrl = `${endpointBase}/object/public/${process.env.AWS_STORAGE_BUCKET_NAME}/${key}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("[/api/upload] Error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
