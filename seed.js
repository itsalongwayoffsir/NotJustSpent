/**
 * seed.js — Import sample data into MongoDB
 * Run with: node seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env file");
  process.exit(1);
}

// ── Schemas (must match routes/) ──────────────────
const Expense = mongoose.model("Expense", new mongoose.Schema({
  title: String, category: String, amount: Number, date: String, description: String,
}));
const Income = mongoose.model("Income", new mongoose.Schema({
  name: String, amount: Number, date: String,
}));
const Saving = mongoose.model("Saving", new mongoose.Schema({
  label: String, amount: Number, date: String,
}));

// ── Sample Data ───────────────────────────────────
const expenses = [
  { title: "Woolworths groceries",   category: "Food",          amount: 87.50, date: "2026-04-01", description: "Weekly grocery shop" },
  { title: "Morning coffee",         category: "Food",          amount: 5.80,  date: "2026-04-01", description: "Flat white at campus café" },
  { title: "Opal card top-up",       category: "Transport",     amount: 30.00, date: "2026-04-02", description: "Weekly commute" },
  { title: "Netflix",                category: "Bills",         amount: 22.99, date: "2026-04-02", description: "Monthly subscription" },
  { title: "Sushi lunch",            category: "Food",          amount: 14.50, date: "2026-04-03", description: "Lunch near uni" },
  { title: "Python textbook",        category: "Study",         amount: 68.00, date: "2026-04-04", description: "Required textbook for COMP course" },
  { title: "Kmart haul",             category: "Shopping",      amount: 43.80, date: "2026-04-05", description: "Home essentials" },
  { title: "Movie tickets",          category: "Entertainment", amount: 38.00, date: "2026-04-05", description: "2 tickets with friends" },
  { title: "Electricity bill",       category: "Bills",         amount: 95.40, date: "2026-04-06", description: "March electricity" },
  { title: "Poke bowl",              category: "Food",          amount: 17.90, date: "2026-04-07", description: "Dinner after class" },
  { title: "Uber to airport",        category: "Transport",     amount: 52.00, date: "2026-04-08", description: "Early morning ride" },
  { title: "Coursera subscription",  category: "Study",         amount: 49.00, date: "2026-04-09", description: "Monthly online learning" },
  { title: "Coles top-up",           category: "Food",          amount: 34.20, date: "2026-04-09", description: "Midweek snacks and drinks" },
  { title: "Gym membership",         category: "Bills",         amount: 55.00, date: "2026-04-10", description: "Monthly gym fee" },
  { title: "Thai takeaway",          category: "Food",          amount: 22.50, date: "2026-04-11", description: "Pad thai and spring rolls" },
  { title: "ASOS order",             category: "Shopping",      amount: 89.95, date: "2026-04-12", description: "New jacket and two tops" },
  { title: "Spotify",                category: "Bills",         amount: 11.99, date: "2026-04-13", description: "Monthly music subscription" },
  { title: "Bus fare",               category: "Transport",     amount: 8.40,  date: "2026-04-14", description: "Trip to library" },
  { title: "Bubble tea",             category: "Food",          amount: 8.50,  date: "2026-04-14", description: "Brown sugar milk tea" },
  { title: "Printing & stationery",  category: "Study",         amount: 12.60, date: "2026-04-15", description: "Assignment printing + highlighters" },
  { title: "Bowling night",          category: "Entertainment", amount: 28.00, date: "2026-04-16", description: "Group outing with classmates" },
  { title: "Internet bill",          category: "Bills",         amount: 79.00, date: "2026-04-17", description: "Monthly NBN plan" },
  { title: "Woolworths groceries",   category: "Food",          amount: 91.30, date: "2026-04-18", description: "Weekly grocery shop" },
  { title: "Train to CBD",           category: "Transport",     amount: 6.20,  date: "2026-04-19", description: "Weekend trip to city" },
  { title: "Brunch at café",         category: "Food",          amount: 26.00, date: "2026-04-20", description: "Eggs benedict and coffee" },
  { title: "iCloud storage",         category: "Bills",         amount: 1.49,  date: "2026-04-21", description: "50GB monthly plan" },
  { title: "Stationery haul",        category: "Shopping",      amount: 31.50, date: "2026-04-22", description: "New planner and pens from Officeworks" },
  { title: "Dumpling dinner",        category: "Food",          amount: 19.80, date: "2026-04-23", description: "Dinner in Chinatown" },
  { title: "Concert ticket",         category: "Entertainment", amount: 75.00, date: "2026-04-24", description: "Local band at Manning Bar" },
  { title: "Uber ride home",         category: "Transport",     amount: 18.50, date: "2026-04-24", description: "Late night after concert" },
];

const income = [
  { name: "Casual job — retail",       amount: 980.00, date: "2026-04-07" },
  { name: "Casual job — retail",       amount: 840.00, date: "2026-04-14" },
  { name: "Freelance design project",  amount: 350.00, date: "2026-04-18" },
  { name: "Casual job — retail",       amount: 760.00, date: "2026-04-21" },
];

const savings = [
  { label: "Japan trip fund",  amount: 300.00, date: "2026-04-01" },
  { label: "Emergency fund",   amount: 200.00, date: "2026-04-15" },
  { label: "Japan trip fund",  amount: 150.00, date: "2026-04-22" },
];

// ── Run ───────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Clear existing data first to avoid duplicates
  await Expense.deleteMany({});
  await Income.deleteMany({});
  await Saving.deleteMany({});
  console.log("🗑  Cleared existing data");

  await Expense.insertMany(expenses);
  await Income.insertMany(income);
  await Saving.insertMany(savings);

  console.log(`✅ Inserted ${expenses.length} expenses`);
  console.log(`✅ Inserted ${income.length} income records`);
  console.log(`✅ Inserted ${savings.length} savings deposits`);
  console.log("🎉 Done! Refresh your browser to see the data.");

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("❌ Seed error:", err.message);
  process.exit(1);
});
