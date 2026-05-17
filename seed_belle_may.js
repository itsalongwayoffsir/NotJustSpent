/**
 * seed_belle_may.js — Add May 2026 data for belle
 * Run with: node seed_belle_may.js
 */
require("dotenv").config();
const mongoose = require("mongoose");

const BELLE_ID = new mongoose.Types.ObjectId("6a095615a49a1a4e6bf355e7");

const Expense = mongoose.model("Expense", new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String, category: String, amount: Number, date: String, description: String,
}));
const Income = mongoose.model("Income", new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String, amount: Number, date: String,
}));
const Saving = mongoose.model("Saving", new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  label: String, amount: Number, date: String,
}));

const expenses = [
  { title: "Woolworths groceries",  category: "Food",          amount: 92.40,  date: "2026-05-01", description: "Weekly grocery shop" },
  { title: "Morning coffee",        category: "Food",          amount: 5.80,   date: "2026-05-01", description: "Flat white at campus café" },
  { title: "Opal card top-up",      category: "Transport",     amount: 30.00,  date: "2026-05-02", description: "Weekly commute top-up" },
  { title: "Netflix",               category: "Bills",         amount: 22.99,  date: "2026-05-02", description: "Monthly subscription" },
  { title: "Sushi train lunch",     category: "Food",          amount: 18.50,  date: "2026-05-03", description: "Lunch near uni" },
  { title: "Data structures book",  category: "Study",         amount: 72.00,  date: "2026-05-04", description: "Required textbook" },
  { title: "Target haul",           category: "Shopping",      amount: 55.30,  date: "2026-05-05", description: "Clothes and home items" },
  { title: "Cinema tickets",        category: "Entertainment", amount: 38.00,  date: "2026-05-06", description: "2 tickets with friends" },
  { title: "Electricity bill",      category: "Bills",         amount: 88.60,  date: "2026-05-07", description: "April electricity" },
  { title: "Pad thai takeaway",     category: "Food",          amount: 19.90,  date: "2026-05-08", description: "Dinner after late study" },
  { title: "Uber to hospital",      category: "Transport",     amount: 24.50,  date: "2026-05-09", description: "Medical appointment" },
  { title: "Udemy course",          category: "Study",         amount: 29.99,  date: "2026-05-10", description: "Web dev course on sale" },
  { title: "Coles mid-week shop",   category: "Food",          amount: 41.20,  date: "2026-05-10", description: "Fruit and snacks" },
  { title: "Gym membership",        category: "Bills",         amount: 55.00,  date: "2026-05-11", description: "Monthly gym fee" },
  { title: "Ramen dinner",          category: "Food",          amount: 23.00,  date: "2026-05-12", description: "Dinner in Chinatown" },
  { title: "ASOS order",            category: "Shopping",      amount: 76.95,  date: "2026-05-13", description: "Winter jacket" },
  { title: "Spotify",               category: "Bills",         amount: 11.99,  date: "2026-05-13", description: "Monthly music subscription" },
  { title: "Bus to library",        category: "Transport",     amount: 6.40,   date: "2026-05-14", description: "Study session at library" },
  { title: "Bubble tea",            category: "Food",          amount: 8.50,   date: "2026-05-14", description: "Brown sugar milk tea" },
  { title: "Stationery & printing", category: "Study",         amount: 14.80,  date: "2026-05-15", description: "Assignment printing" },
  { title: "Trivia night",          category: "Entertainment", amount: 20.00,  date: "2026-05-15", description: "Entry + drinks" },
  { title: "Internet bill",         category: "Bills",         amount: 79.00,  date: "2026-05-16", description: "Monthly NBN plan" },
  { title: "Woolworths groceries",  category: "Food",          amount: 86.70,  date: "2026-05-17", description: "Weekly grocery shop" },
  { title: "Train to CBD",          category: "Transport",     amount: 7.20,   date: "2026-05-18", description: "Weekend city trip" },
  { title: "Brunch with friends",   category: "Food",          amount: 28.50,  date: "2026-05-18", description: "Eggs benny and coffee" },
  { title: "iCloud 50GB",           category: "Bills",         amount: 1.49,   date: "2026-05-19", description: "Monthly storage plan" },
  { title: "Kmart shopping",        category: "Shopping",      amount: 38.00,  date: "2026-05-20", description: "Home essentials and storage" },
  { title: "Vietnamese dinner",     category: "Food",          amount: 21.50,  date: "2026-05-21", description: "Pho and spring rolls" },
  { title: "Comedy show ticket",    category: "Entertainment", amount: 55.00,  date: "2026-05-22", description: "Stand-up comedy night" },
  { title: "Uber home",             category: "Transport",     amount: 16.80,  date: "2026-05-22", description: "Late night after show" },
];

const income = [
  { name: "Casual job — retail",      amount: 920.00, date: "2026-05-05" },
  { name: "Casual job — retail",      amount: 875.00, date: "2026-05-12" },
  { name: "Freelance design project", amount: 420.00, date: "2026-05-16" },
  { name: "Casual job — retail",      amount: 810.00, date: "2026-05-19" },
];

const savings = [
  { label: "Japan trip fund",  amount: 350.00, date: "2026-05-01" },
  { label: "Emergency fund",   amount: 150.00, date: "2026-05-10" },
  { label: "Japan trip fund",  amount: 200.00, date: "2026-05-20" },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Only delete May 2026 data for belle
  await Expense.deleteMany({ userId: BELLE_ID, date: /^2026-05/ });
  await Income.deleteMany({  userId: BELLE_ID, date: /^2026-05/ });
  await Saving.deleteMany({  userId: BELLE_ID, date: /^2026-05/ });
  console.log("🗑  Cleared belle's May 2026 data");

  await Expense.insertMany(expenses.map(e => ({ ...e, userId: BELLE_ID })));
  await Income.insertMany(income.map(e   => ({ ...e, userId: BELLE_ID })));
  await Saving.insertMany(savings.map(e  => ({ ...e, userId: BELLE_ID })));

  console.log(`✅ Inserted ${expenses.length} expenses`);
  console.log(`✅ Inserted ${income.length} income records`);
  console.log(`✅ Inserted ${savings.length} savings deposits`);
  console.log("🎉 Done!");
  await mongoose.disconnect();
}

seed().catch(err => { console.error("❌", err.message); process.exit(1); });
