import {
  PutObjectCommandOutput,
  PutObjectCommand,
  S3,
} from "@aws-sdk/client-s3";

export interface S3FileResponse {
  file_key: string;
  file_name: string;
}

export async function uploadToS3(file: File): Promise<S3FileResponse> {
  const client = new S3({ region: "eu-central-1" });

  return new Promise((resolve, reject) => {
    try {
      const file_key =
        "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
        Body: file,
      };

      const putCommand = new PutObjectCommand(params);

      client.send(
        putCommand,
        (err: any, data: PutObjectCommandOutput | undefined) => {
          return resolve({
            file_key,
            file_name: file.name,
          });
        }
      );
    } catch (error) {
      console.error("[S3_UPLOAD] Failed to upload to s3: \n", error);
      reject(error);
    }
  });
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-central-1.amazonaws.com/${file_key}`;
  return url;
}
