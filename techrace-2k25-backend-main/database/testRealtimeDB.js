import ref from "./database.js";

async function testRealtimeDatabase() {
  try {
    const testRef = ref.child("testConnection");

    // Write test data
    await testRef.set({ message: "Realtime DB connected!" });

    // Read test data
    testRef.once("value", (snapshot) => {
      console.log("Realtime DB Data:", snapshot.val());
    });

    console.log("✅ Realtime Database connection successful!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Realtime Database connection failed:", error);
  }
}

testRealtimeDatabase();
