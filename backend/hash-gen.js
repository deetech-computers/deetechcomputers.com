import bcrypt from "bcrypt";

const plain = "Admin123!";

const run = async () => {
  const hash = await bcrypt.hash(plain, 10);
  console.log("Generated hash for Admin123!: ", hash);
};

run();
