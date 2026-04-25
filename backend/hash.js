// hash.js
import bcrypt from "bcrypt";

const run = async () => {
  const hashed = await bcrypt.hash("UserPass123!", 10);
  console.log("Hashed password:", hashed);
};
run();
