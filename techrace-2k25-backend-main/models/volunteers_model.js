import { async } from "@firebase/util";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import ref from "../database/database.js";
import { firestore_db } from "../database/firestore_db.js";
import dotenv from "dotenv";
import { WaitingForGameStart, Playing } from "../utils/GameStates.js";
import {
  freezeDuration,
  futureUndo,
  invisibilityDuration,
  meterOffDuration,
} from "../controllers/game.js";

import moment from "moment-timezone";
moment.tz.setDefault("Asia/Kolkata");
dotenv.config();


const teamRef = ref.child("dummy_teams"); // chaneg to teams for final thing
export const adminVolRefF = "dummy_admin_volunteers"; // chaneg to admin_volunteers for final thing

// not used yet
const clueRef = ref.child("clues");
const _clues = ["c1", "c2", "c3", "c3", "c5", "c6"];


// this does the freeze wala thingy 
export const resetFutureUndosRT = async () => {
  const snapshot = await teamRef.once("value");

  let updates = {};
  snapshot.forEach((teamSnapshot) => {
    const data = teamSnapshot.val();

    if (data.freezed_on && nowMinusOn(data.freezed_on) > freezeDuration) {
      if (data.is_freezed) {
        updates[teamSnapshot.key + "/is_freezed"] = false;
      } else {
        const timeLeftForFreezeReversal = freezeDuration - nowMinusOn(data.freezed_on);
        futureUndo(teamSnapshot.key, { is_freezed: false }, timeLeftForFreezeReversal * 1000);
      }
    }

    if (data.meter_off_on && nowMinusOn(data.meter_off_on) > meterOffDuration) {
      if (data.is_meter_off) {
        updates[teamSnapshot.key + "/is_meter_off"] = false;
      } else {
        const timeLeftForMeterOfReversal = meterOffDuration - nowMinusOn(data.meter_off_on);
        futureUndo(teamSnapshot.key, { is_meter_off: false }, timeLeftForMeterOfReversal * 1000);
      }
    }

    if (data.invisible_on && nowMinusOn(data.invisible_on) > invisibilityDuration) {
      if (data.is_invisible) {
        updates[teamSnapshot.key + "/is_invisible"] = false;
      } else {
        const timeLeftForInvisibleReversal = invisibilityDuration - nowMinusOn(data.invisible_on);
        futureUndo(teamSnapshot.key, { is_invisible: false }, timeLeftForInvisibleReversal * 1000);
      }
    }
  });

  await teamRef.update(updates);
};

export const fetchTeamDataRegistrationRT = (tid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const snapShot = await teamRef.child(tid).get();
      if (!snapShot.exists()) {
        resolve(null); 
      } else {
        resolve(snapShot.val()); 
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const setEveryOnePlayingRT = async () => {
  try {
    const snapshot = await teamRef.once("value");
    let updates = {};

    snapshot.forEach((teamSnapshot) => {
      if (teamSnapshot.val().state === WaitingForGameStart) {
        updates[`${teamSnapshot.key}/state`] = Playing;
      }
    });

    if (Object.keys(updates).length > 0) {
      await teamRef.update(updates);
      console.log("Successfully updated all eligible teams to 'Playing' state.");
    } else {
      console.log("No teams found in 'WaitingForGameStart' state.");
    }
  } catch (error) {
    console.error("Error updating teams to 'Playing' state:", error);
    throw error;
  }
};

export const setEveryOneLogoutFirestore = async () => {
  try {

    const teamsCollectionRef = collection(firestore_db, "dummy_teams"); 
    const snapshot = await getDocs(teamsCollectionRef);

    if (snapshot.empty) {
      console.log("No teams found.");
      return;
    }

    const updates = [];
    snapshot.forEach((teamDoc) => {
      updates.push(
        updateDoc(doc(firestore_db, "dummy_teams", teamDoc.id), { is_logged_in: false })
      );
    });

    await Promise.all(updates); 
    console.log("Successfully logged out all teams.");
  } catch (error) {
    console.error("Error logging out teams:", error);
    throw error;
  }
};

export const updateTimeRT = (payload) => {
  ref.update({ start_datetime: payload.new_start_datetime });
};

// checks time diff between given time and now
const nowMinusOn = (on_wala_timestamp) => {
  const diff = moment().diff(on_wala_timestamp, "seconds");
  return diff;
};

// for login route helper
export const getVolDataFirestore = async (vid) => {
  return await getDoc(doc(firestore_db, adminVolRefF, vid));
};


