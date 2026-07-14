import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

// Models
import CropListing from "../models/Crop.js";
import Order from "../models/Order.js";
import HarvestAlert from "../models/HarvestAlert.js";
import CropAdvisory from "../models/Advisory.js";
import PlatformStat from "../models/Stat.js";

dotenv.config();

// ─── Seed Data (mirrors client/src/data/mockData.js) ─────

const cropListings = [
  {
    listing_id: "LST001",
    crop_name: "Big Onion",
    farmer_name: "Suresh Perera",
    origin: "Dambulla, North Central",
    district: "Matale",
    quantity_kg: 2500,
    available_kg: 2500,
    price_per_kg: 210,
    harvest_date: "2026-07-10",
    delivery_days: 2,
    category: "Vegetables",
    grade: "A",
    packaging: "Ventilated Crate",
    jit_status: "Awaiting Order",
    organic: false,
    icon: "🧅",
    rating: 4.8,
    orders: 24,
    image_url: "/assets/products/big-onion.png",
  },
  {
    listing_id: "LST002",
    crop_name: "Tomato (Cherry)",
    farmer_name: "Dilani Rathnayake",
    origin: "Nuwara Eliya, Central",
    district: "Nuwara Eliya",
    quantity_kg: 800,
    available_kg: 650,
    price_per_kg: 185,
    harvest_date: "2026-07-05",
    delivery_days: 1,
    category: "Vegetables",
    grade: "A+",
    packaging: "Ventilated Crate",
    jit_status: "Harvest Triggered",
    organic: true,
    icon: "🍅",
    rating: 4.9,
    orders: 41,
    image_url: "/assets/products/tomato.png",
  },
  {
    listing_id: "LST003",
    crop_name: "Carrot",
    farmer_name: "Nimal Bandara",
    origin: "Nuwara Eliya, Central",
    district: "Nuwara Eliya",
    quantity_kg: 1200,
    available_kg: 1200,
    price_per_kg: 145,
    harvest_date: "2026-07-12",
    delivery_days: 2,
    category: "Root Crops",
    grade: "A",
    packaging: "Ventilated Crate",
    jit_status: "Awaiting Order",
    organic: false,
    icon: "🥕",
    rating: 4.6,
    orders: 18,
    image_url: "/assets/products/carrot.png",
  },
  {
    listing_id: "LST004",
    crop_name: "Capsicum",
    farmer_name: "Priya Kumari",
    origin: "Dambulla, North Central",
    district: "Matale",
    quantity_kg: 600,
    available_kg: 450,
    price_per_kg: 320,
    harvest_date: "2026-07-08",
    delivery_days: 2,
    category: "Vegetables",
    grade: "A+",
    packaging: "Ventilated Crate",
    jit_status: "Harvest Triggered",
    organic: true,
    icon: "🫑",
    rating: 4.7,
    orders: 33,
    image_url: "/assets/products/capsicum.png",
  },
  {
    listing_id: "LST005",
    crop_name: "Leeks",
    farmer_name: "Arjuna Silva",
    origin: "Badulla, Uva",
    district: "Badulla",
    quantity_kg: 900,
    available_kg: 900,
    price_per_kg: 165,
    harvest_date: "2026-07-15",
    delivery_days: 3,
    category: "Vegetables",
    grade: "A",
    packaging: "Ventilated Crate",
    jit_status: "Awaiting Order",
    organic: false,
    icon: "🥬",
    rating: 4.5,
    orders: 12,
    image_url: "/assets/products/leeks.png",
  },
  {
    listing_id: "LST006",
    crop_name: "Potato",
    farmer_name: "Kamala Jayawardena",
    origin: "Badulla, Uva",
    district: "Badulla",
    quantity_kg: 3000,
    available_kg: 3000,
    price_per_kg: 130,
    harvest_date: "2026-07-18",
    delivery_days: 3,
    category: "Root Crops",
    grade: "A",
    packaging: "Ventilated Crate",
    jit_status: "Awaiting Order",
    organic: false,
    icon: "🥔",
    rating: 4.4,
    orders: 9,
    image_url: "/assets/products/potato.png",
  },
];

const orders = [
  {
    order_number: "#ORD-1023",
    crop: "Big Onion",
    quantity: "500 kg",
    status: "Processing",
    status_class: "status-processing",
    price: "₨ 105,000",
    farmer_id: "farmer_001",
  },
  {
    order_number: "#ORD-1022",
    crop: "Capsicum",
    quantity: "200 kg",
    status: "Shipped",
    status_class: "status-shipped",
    price: "₨ 59,160",
    farmer_id: "farmer_001",
  },
  {
    order_number: "#ORD-1021",
    crop: "Carrot",
    quantity: "350 kg",
    status: "Completed",
    status_class: "status-completed",
    price: "₨ 50,750",
    farmer_id: "farmer_001",
  },
  {
    order_number: "#ORD-1020",
    crop: "Leeks",
    quantity: "180 kg",
    status: "Processing",
    status_class: "status-processing",
    price: "₨ 29,700",
    farmer_id: "farmer_001",
  },
];

const harvestAlerts = [
  {
    alert_id: "ALERT001",
    crop: "Big Onion",
    buyer: "Cargills Food City",
    quantity_kg: 500,
    order_value_lkr: 105000,
    harvest_window: "July 10–11, 2026",
    status: "confirmed",
    message:
      "Order confirmed. Harvest ONLY between Jul 10–11. Crate inspection due Jul 9.",
  },
];

const cropAdvisory = [
  {
    advisory_id: 1,
    crop: "Big Onion",
    reason:
      "National import gap: 42,000 MT deficit in Q3. High price spike probability in Weeks 21–29.",
    roi_estimate: "+68%",
    risk: "Medium",
    season: "Plant now for Week 20 harvest",
    icon: "🧅",
    urgency: "high",
  },
  {
    advisory_id: 2,
    crop: "Capsicum",
    reason:
      "Export demand from UAE and Singapore surging. Low domestic supply predicted.",
    roi_estimate: "+54%",
    risk: "Low",
    season: "Ideal for dry zone planting",
    icon: "🌶️",
    urgency: "medium",
  },
  {
    advisory_id: 3,
    crop: "Carrot",
    reason:
      "Stable demand, low volatility. Suitable for first-time JIT participants.",
    roi_estimate: "+38%",
    risk: "Low",
    season: "Upcountry planting window open",
    icon: "🥕",
    urgency: "low",
  },
];

const platformStats = [
  { label: "Farmers Onboarded", value: "2,847", unit: "", icon: "👨‍🌾" },
  { label: "Waste Eliminated", value: "38%", unit: "", icon: "♻️" },
  { label: "Avg. Price Gain", value: "+42%", unit: "", icon: "📈" },
  { label: "LKR Saved (Farmers)", value: "₨ 18.4M", unit: "/mo", icon: "💰" },
];

// ─── Import / Destroy Logic ──────────────────────────────

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await CropListing.deleteMany();
    await Order.deleteMany();
    await HarvestAlert.deleteMany();
    await CropAdvisory.deleteMany();
    await PlatformStat.deleteMany();

    // Insert seed data
    await CropListing.insertMany(cropListings);
    await Order.insertMany(orders);
    await HarvestAlert.insertMany(harvestAlerts);
    await CropAdvisory.insertMany(cropAdvisory);
    await PlatformStat.insertMany(platformStats);

    console.log("✅ Data seeded successfully!");
    console.log(`   📦 ${cropListings.length} crop listings`);
    console.log(`   📋 ${orders.length} orders`);
    console.log(`   🔔 ${harvestAlerts.length} harvest alerts`);
    console.log(`   🌱 ${cropAdvisory.length} crop advisories`);
    console.log(`   📊 ${platformStats.length} platform stats`);
    process.exit();
  } catch (error) {
    console.error(`❌ Seeder Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await CropListing.deleteMany();
    await Order.deleteMany();
    await HarvestAlert.deleteMany();
    await CropAdvisory.deleteMany();
    await PlatformStat.deleteMany();

    console.log("🗑️  All data destroyed!");
    process.exit();
  } catch (error) {
    console.error(`❌ Destroy Error: ${error.message}`);
    process.exit(1);
  }
};

// CLI: npm run seed / npm run seed:destroy
if (process.argv[2] === "--destroy") {
  destroyData();
} else {
  importData();
}
