// This is needed for realt-time data using firebase admin sdk
// for newbies : this connection connects us to realtiem database 

// Example Use Case:

// A backend server storing live game scores in a JSON-like structure.
// Chat messages stored in real-time.

import dotenv from "dotenv";
dotenv.config();
import admin from "firebase-admin";
// admin access is needed to create , delete and update things in database


// now realtime and firebase is true for all
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
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
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.database();
const ref = db.ref("/");

export default ref;