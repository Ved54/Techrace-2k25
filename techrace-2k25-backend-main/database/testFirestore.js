import { firestore_db } from "./firestore_db.js";
import { doc, setDoc, getDoc } from "firebase/firestore";

async function testFirestore() {
  try {
    const testDocRef = doc(firestore_db, "testCollection", "testDoc");

    // Write test data
    await setDoc(testDocRef, { message: "Firestore connected!" });

    // Read test data
    const docSnap = await getDoc(testDocRef);
    if (docSnap.exists()) {
      console.log("Firestore Data:", docSnap.data());
    } else {
      console.log("❌ No Firestore document found!");
    }

    console.log("✅ Firestore connection successful!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Firestore connection failed:", error);
  }
}

testFirestore();
