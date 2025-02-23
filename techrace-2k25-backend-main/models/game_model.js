import { async } from "@firebase/util";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import ref from "../database/database.js";
import { firestore_db } from "../database/firestore_db.js";
import AES from "crypto-js/aes.js";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";

dotenv.config();

const _clues = ["c1", "c2", "c3", "c3", "c5", "c6"];

// const teamRef = ref.child("teams");
const teamRef = ref.child("dummy_teams");

const clueRef = ref.child("clues");


// check by hitesh
export const fetchTeamDataRT = (tid) =>
  new Promise((resolve, reject) => {
    try {
      teamRef.child(tid).once("value", (snapShot) => {
        resolve(snapShot.val());
      });
    } catch (err) {
      reject(err);
    }
});

export const updateStateRT = async (id, newState) => {
  try {
    await teamRef.child(id).update({ state: newState });
  } catch (error) {
    console.error(`Failed to update state for team ${id}:`, error);
  }
};


// check by hitesh



export const updateTimeRT = (payload) => {
  console.log(new Date("2023-01-10T21:00:00.000+05:30").toISOString());
  const myDate = new Date("2023-01-10T23:00:00.000+05:30");
  const milis = myDate.getTime();
  console.log(milis);
  // return milis

  // console.log();
};

export const addClueFirestore = (payload) => {
  console.log("Payload:", payload);

 

  // Check if payload.cid is defined
  if (!payload.cid) {
    console.error("Error: cid is undefined or missing");
    return;
  }

  // Ensure payload contains valid data
  setDoc(doc(firestore_db, "dummy_clues", String(payload.cid)), payload)
    .then(() => {
      console.log(`Successfully added clue with ID: ${payload.cid}`);
    })
    .catch((error) => {
      console.error("Error adding clue:", error);
    });
};





const getDecrypted = (encryptedString) => {
  return encryptedString; //temp

 
};

export const getClueFirestore = async (cid, forInit) => {
  console.log(cid);
  console.log("cid")
  const clueData = await getDoc(doc(firestore_db, "dummy_clues", cid)); 
  const encryptData = clueData.data();
  let decryptData = {};
  //temp

  if (forInit) {
    delete encryptData["hint_1"];
    delete encryptData["hint_1_type"];
    delete encryptData["hint_2"];
    delete encryptData["hint_2_type"];
  }

  console.log("encryptData");
  console.log(encryptData);
  return encryptData; //temp /test
};

export const setIsFreezedRT = async (tid, isFreezed) => {
  updateTeamDataRT(tid, {
    is_freezed: isFreezed,
  });
};

export const updateTeamDataRT = async (tid, payload) => {
  await teamRef.child(tid).update(payload, (e) => {
    if(e) console.log(e);
  });
};


