import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");

function ensureLine(content, key, fallbackValue) {
  const pattern = new RegExp(`^${key}=.*$`, "m");
  if (pattern.test(content)) {
    return content.replace(pattern, `${key}=${fallbackValue}`);
  }
  const suffix = content.endsWith("\n") ? "" : "\n";
  return `${content}${suffix}${key}=${fallbackValue}\n`;
}

let envContent = "";
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, "utf8");
}

envContent = ensureLine(
  envContent,
  "MONGO_URI",
  "mongodb://localhost:27017/deetech"
);
envContent = ensureLine(envContent, "NODE_ENV", "development");
envContent = ensureLine(envContent, "PORT", "5000");
envContent = ensureLine(envContent, "FRONTEND_URL", "http://localhost:3000");

fs.writeFileSync(envPath, envContent, "utf8");

console.log("Mongo setup complete.");
console.log("Updated .env at:", envPath);
console.log("Next step: set your real MONGO_URI value before production.");
