import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

import CropListing from "../models/Crop.js";
import Order from "../models/Order.js";
import HarvestAlert from "../models/HarvestAlert.js";
import CropAdvisory from "../models/Advisory.js";
import PlatformStat from "../models/Stat.js";
import MarketPrice from "../models/MarketPrice.js";
import Traceability from "../models/Traceability.js";

dotenv.config();


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
    urgency: "low",
  },
];

const platformStats = [
  { label: "Farmers Onboarded", value: "2,847", unit: "" },
  { label: "Waste Eliminated", value: "38%", unit: "" },
  { label: "Avg. Price Gain", value: "+42%", unit: "" },
  { label: "LKR Saved (Farmers)", value: "₨ 18.4M", unit: "/mo" },
];

const marketPrices = [
  { rank: 1, name: 'Big Onion', price: '₨ 310.50', change: '+3.2%', direction: 'positive', label: 'Sage', updated: 'Last updated Jul 6, 2026' },
  { rank: 2, name: 'Capsicum', price: '₨ 295.80', change: '-1.1%', direction: 'negative', label: 'Terracotta', updated: 'Last updated Jul 6, 2026' },
  { rank: 3, name: 'Carrot', price: '₨ 185.10', change: '+2.5%', direction: 'positive', label: 'Sage', updated: 'Last updated Jul 6, 2026' },
];

const traceabilitySteps = [
  { order_id: 'ALERT001', order_index: 0, step: "Advance Payment Verified", date: "Jul 1, 2026 09:12 AM", location: "Cargills Bank", done: true },
  { order_id: 'ALERT001', order_index: 1, step: "JIT Harvest Alert Sent", date: "Jul 1, 2026 09:15 AM", location: "AgroHub AI Node", done: true },
  { order_id: 'ALERT001', order_index: 2, step: "Farmer Accepted", date: "Jul 1, 2026 10:45 AM", location: "Dambulla Farm", done: true },
  { order_id: 'ALERT001', order_index: 3, step: "Crate Inspection", date: "Jul 9, 2026 08:00 AM", location: "Collection Center B", done: false },
  { order_id: 'ALERT001', order_index: 4, step: "Harvest Window Open", date: "Jul 10, 2026", location: "Dambulla Farm", done: false },
  { order_id: 'ALERT001', order_index: 5, step: "Cold Chain Pickup", date: "Jul 11, 2026", location: "Dambulla Farm", done: false },
];


const importData = async () => {
  try {
    await connectDB();

    await CropListing.deleteMany();
    await Order.deleteMany();
    await HarvestAlert.deleteMany();
    await CropAdvisory.deleteMany();
    await PlatformStat.deleteMany();
    await MarketPrice.deleteMany();
    await Traceability.deleteMany();

    await CropListing.insertMany(cropListings);
    await Order.insertMany(orders);
    await HarvestAlert.insertMany(harvestAlerts);
    await CropAdvisory.insertMany(cropAdvisory);
    await PlatformStat.insertMany(platformStats);
    await MarketPrice.insertMany(marketPrices);
    await Traceability.insertMany(traceabilitySteps);

    console.log('Data seeded:');
    console.log(`  ${cropListings.length} crop listings`);
    console.log(`  ${orders.length} orders`);
    console.log(`  ${harvestAlerts.length} harvest alerts`);
    console.log(`  ${cropAdvisory.length} crop advisories`);
    console.log(`  ${platformStats.length} platform stats`);
    process.exit();
  } catch (error) {
    console.error(`Seeder error: ${error.message}`);
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
    await MarketPrice.deleteMany();
    await Traceability.deleteMany();

    console.log('All data destroyed.');
    process.exit();
  } catch (error) {
    console.error(`Destroy error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "--destroy") {
  destroyData();
} else {
  importData();
}
