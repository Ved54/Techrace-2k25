import dotenv from "dotenv";
dotenv.config();

import admin from "firebase-admin";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      {
        "type": process.env.SERVICE_TYPE,
        "project_id": process.env.SERVICE_PROJECT_ID,
        "private_key_id": process.env.SERVICE_PRIVATE_KEY_ID,
        "private_key": process.env.SERVICE_PRIVATE_KEY,
        "client_email": process.env.SERVICE_CLIENT_MAIL,
        "client_id": process.env.SERVICE_CLIENT_ID,
        "auth_uri": process.env.SERVICE_AUTH_URI,
        "token_uri": process.env.SERVICE_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.SERVICE_AUTH_PROVIDER,
        "client_x509_cert_url": process.env.SERVICE_CLIENT_URL,
        "universe_domain": process.env.SERVICE_UNIVERSE_DOMAIN
      }
    ),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

async function testAdminSDK() {
  try {
    const userList = await admin.auth().listUsers();
    console.log("✅ Firebase Admin SDK is working! Total users:", userList.users.length);
  } catch (error) {
    console.error("❌ Firebase Admin SDK connection failed:", error);
  }
}

testAdminSDK();
