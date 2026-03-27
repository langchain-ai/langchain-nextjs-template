import { createUploadConfig } from "pushduck/server";

const { s3 } = createUploadConfig()
  .provider("aws", {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
    region: process.env.AWS_S3_REGION ?? "us-east-1",
    bucket: process.env.AWS_S3_BUCKET_NAME!,
  })
  .paths({ prefix: "documents" })
  .build();

const uploadRouter = s3.createRouter({
  documentUpload: s3
    .file()
    .types(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "text/markdown"])
    .maxFileSize("16MB"),
});

export type AppUploadRouter = typeof uploadRouter;
export const { GET, POST } = uploadRouter.handlers;
