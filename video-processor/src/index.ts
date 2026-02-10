import { config } from "./config";
import { ClipStatus } from "./types";

console.log("Hello from video processor!");
console.log("Clip statuses:", Object.values(ClipStatus));
console.log("AWS REGION : ", config.aws.region);
console.log("AWS Bucket : ", config.aws.s3.bucket);
console.log("DB HOST : ", config.database.host);
