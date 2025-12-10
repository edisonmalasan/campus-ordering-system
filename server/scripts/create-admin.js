/**
create admin
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const ADMIN_EMAIL = "edisonadmin@gmail.com";
const ADMIN_PASSWORD = "edisonmalasan17";
const ADMIN_NAME = "Edison Admin";
const ADMIN_PHONE = "09123456789";

async function createOrUpdateAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI not found in .env file");
    }

    console.log("connecting to db...");
    await mongoose.connect(mongoUri);
    console.log("connected to db\n");

    const usersCollection = mongoose.connection.collection("users");

    const existingAdmin = await usersCollection.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log("Admin user already exists");
      console.log("Email:", existingAdmin.email);
      console.log("Access Level:", existingAdmin.access_level || "not set");
      console.log("");

      if (
        existingAdmin.access_level !== "admin" ||
        existingAdmin.role !== "admin"
      ) {
        console.log("🔧 Updating access level/role to admin...");
        await usersCollection.updateOne(
          { _id: existingAdmin._id },
          {
            $set: {
              access_level: "admin",
              role: "admin",
            },
          }
        );
        console.log("Access level & role updated to: admin\n");
      } else {
        console.log("dmin access level and role already set correctly\n");
      }
    } else {
      console.log("Creating new admin user...");

      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

      await usersCollection.insertOne({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        contact_number: ADMIN_PHONE,
        access_level: "admin",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("admin user created successfully!\n");
    }
  } catch (error) {
    console.error("error: ", error.message);
    process.exit(1);
  }
}

createOrUpdateAdmin();
