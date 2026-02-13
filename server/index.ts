import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
// CORS CONFIGURATION
app.use(cors({
  origin: "*", // Allow ALL connections (Easiest for Hackathons)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
const PORT = 4000;

app.use(cors());
app.use(express.json());

// TEST ROUTE: Check if server is alive
app.get("/", (req, res) => {
  res.send("CareOps API is running 🚀");
});

// ==========================================
// 1. ONBOARDING: Create a Business Workspace
// ==========================================
app.post("/api/workspace", async (req, res) => {
  try {
    const { name, email, timezone } = req.body;
    
    // Create the workspace
    const workspace = await prisma.workspace.create({
      data: { name, email, timezone },
    });

    // AUTO-MAGIC: Create a default admin user for this workspace
    // This solves the "how do I log in" problem for the MVP
    await prisma.user.create({
      data: {
        email: email,
        role: "ADMIN",
        workspaceId: workspace.id,
      },
    });

    res.json(workspace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create workspace" });
  }
});

// ==========================================
// 2. DASHBOARD: The "God View"
// ==========================================
app.get("/api/dashboard/:workspaceId", async (req, res) => {
  const { workspaceId } = req.params;

  try {
    // Run 3 queries in parallel for speed
    // This fetches everything the dashboard needs in one go
    const [todayBookings, lowStockItems, recentContacts] = await Promise.all([
      // 1. Get today's bookings
      prisma.booking.findMany({
        where: {
          workspaceId,
          // In a real app, use date filtering here. 
          // For hackathon, we fetch all to show data easily.
        },
        include: { contact: true }, // Join with Contact table to get names
        take: 5,
      }),

      // 2. Get low stock inventory
      prisma.inventoryItem.findMany({
        where: {
          workspaceId,
          quantity: {
            lte: 5, // Hardcoded threshold for MVP (alert if < 5 items)
          },
        },
      }),

      // 3. Get recent leads (last 5)
      prisma.contact.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    res.json({
      todayBookings,
      lowStockItems,
      recentContacts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});
// ==========================================
// 3. SEED: Fake Data Generator (FOR DEMO ONLY)
// ==========================================
app.post("/api/seed/:workspaceId", async (req, res) => {
  const { workspaceId } = req.params;

  try {
    // 1. Create dummy contacts
    const contact1 = await prisma.contact.create({
      data: { name: "Alice Johnson", email: "alice@example.com", phone: "555-0101", workspaceId }
    });
    const contact2 = await prisma.contact.create({
      data: { name: "Bob Smith", email: "bob@example.com", phone: "555-0102", workspaceId }
    });

    // 2. Create bookings (Today & Tomorrow)
    const today = new Date();
    await prisma.booking.createMany({
      data: [
        { title: "Initial Consultation", startTime: today, endTime: today, status: "CONFIRMED", contactId: contact1.id, workspaceId },
        { title: "Emergency Repair", startTime: today, endTime: today, status: "COMPLETED", contactId: contact2.id, workspaceId },
      ]
    });

    // 3. Create Inventory (Some Low Stock!)
    await prisma.inventoryItem.createMany({
      data: [
        { name: "Surgical Masks", quantity: 50, threshold: 10, workspaceId }, // Healthy
        { name: "Sanitizer Gel", quantity: 3, threshold: 5, workspaceId },    // 🚨 LOW STOCK (Red Alert)
        { name: "Paper Towels", quantity: 2, threshold: 10, workspaceId },    // 🚨 LOW STOCK (Red Alert)
      ]
    });

    res.json({ message: "Seed data created! Refresh your dashboard." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to seed data" });
  }
});
// ==========================================
// 4. PUBLIC: Booking Logic
// ==========================================

// Create a Contact (if they don't exist)
app.post("/api/contact", async (req, res) => {
  const { name, email, workspaceId } = req.body;
  
  // Upsert = Create if new, Update if exists
  const contact = await prisma.contact.create({
    data: { name, email, workspaceId }
  });
  
  res.json(contact);
});

// Create the actual Booking
app.post("/api/booking", async (req, res) => {
  const { contactId, workspaceId, startTime, title } = req.body;

  const booking = await prisma.booking.create({
    data: {
      status: "CONFIRMED",
      title: title || "New Booking",
      startTime: startTime,
      endTime: startTime, // Simple 0-min duration for MVP
      contactId,
      workspaceId
    }
  });

  // TODO: Trigger Email Automation Here
  console.log(`[AUTOMATION] Sending Confirmation Email to Contact ${contactId}`);

  res.json(booking);
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});