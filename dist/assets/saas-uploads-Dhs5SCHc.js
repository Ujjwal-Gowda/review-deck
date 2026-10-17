const e=`<p class="goal">Secure file uploads: direct browser-to-S3/R2 uploads with pre-signed URLs, file validation, antivirus scanning, and tenant path isolation.</p>
<pre data-lang="typescript"><code class="language-typescript">import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "us-east-1" });

export async function createUploadUrl(tenantId: string, filename: string, contentType: string) {
  const key = \`tenants/\${tenantId}/uploads/\${Date.now()}_\${filename}\`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  return { uploadUrl, key };
}</code></pre>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>383.1 <span class="levels">basic</span> Upload a file directly from React to S3 using the pre-signed URL via PUT request.</summary><div><p>Monitor upload progress with <code>XMLHttpRequest</code> onprogress.</p></div></details>
</div>`;export{e as default};
