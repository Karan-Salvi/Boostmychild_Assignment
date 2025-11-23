const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const users = [
  { name: "John Doe", role_no: 101 },
  { name: "Sara Lee", role_no: 102 },
  { name: "Amit Kumar", role_no: 103 },
  { name: "Priya Sharma", role_no: 104 },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DATABASE_NAME}`
    );
    console.log("MongoDB connected...");

    await User.insertMany(users);
    console.log("Users seeded successfully!");

    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedUsers();
