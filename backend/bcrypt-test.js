import bcrypt from "bcrypt";

const plain = "Admin123!";
const hash = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8YPhcA0kI8FiS8FqJkN8Sg7ZkzC2K6";

bcrypt.compare(plain, hash).then(result => {
  console.log("Match? ", result);
});
