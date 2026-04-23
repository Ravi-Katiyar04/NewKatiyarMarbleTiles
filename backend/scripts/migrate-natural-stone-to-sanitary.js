import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../configs/db.js";
import Product from "../models/Product.js";

async function main() {
  await connectDB();

  const fromValues = ["Natural_Stone", "natural_stone", "Natural Stone", "NaturalStone"];
  const toValue = "Sanitary";

  const { matchedCount, modifiedCount } = await Product.updateMany(
    { category: { $in: fromValues } },
    { $set: { category: toValue } }
  );

  console.log(
    `Migration complete. Matched: ${matchedCount}, Modified: ${modifiedCount}, New category: ${toValue}`
  );

  await mongoose.connection.close();
}

main().catch(async (err) => {
  console.error("Migration failed:", err);
  try {
    await mongoose.connection.close();
  } catch {
    // ignore
  }
  process.exit(1);
});

