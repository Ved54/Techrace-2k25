import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import ref from "../database/database.js";
import { firestore_db } from "../database/firestore_db.js";
import { WaitingForReg } from "../utils/GameStates.js";
import { updateTeamDataRT } from "./game_model.js";

// const teamRef = ref.child("teams");
const teamRef = ref.child("dummy_teams");

export const saveLastLogoutLoc = async (tid, payload) => {
  await updateTeamDataRT(tid, {
    logout_loc_lat: payload.logout_loc_lat,
    logout_loc_lng: payload.logout_loc_lng,
  });
};


// checked
export function constructCid(current_clue_no) {
  return `${current_clue_no}${getRandomRouteId()}`;
}


export const getRandomRouteId = () => {
  let randomNumber = Math.round(Math.random() * Math.pow(10, 5));
  let r2 = randomNumber % Math.pow(10, 4);
  let finalR = (r2 % 2) + 1; // 1 2 is output //only two route
  return finalR;
};

export const addTeamRT = async (id, data) => {

  delete data["password"];
  delete data["tid"];
  delete data["is_logged_in"];

  data.logout_loc_lat = "-999";
  data.logout_loc_lng = "-999";

  data.no_guessed_used = 0; 

  data.balance = 50; 
  data.state = WaitingForReg;

  data.freezed_by = "";
  data.freezed_on = "2020-01-22 14:44:13.520493"; //I think this works
  data.is_freezed = false;

  data.hint_1 = "-999";
  data.hint_2 = "-999";

  data.hint_1_type = "-999";
  data.hint_2_type = "-999";

  data.is_invisible = false;
  data.invisible_on = "2020-01-22 14:44:13.520493"; 

  data.is_meter_off = false;
  data.meter_off_on = "2020-01-22 14:44:13.520493";

  data.prev_clue_solved_timestamp = "2020-01-22 14:44:13.520493";
  data.current_clue_no = 1;
  data.cid = constructCid(data.current_clue_no);

  await teamRef.child(id).set(data); 
};

//checked
export const addNewUserFirestore = async (tid, data) => {
  try {
    data.is_logged_in = false;
    await mAddDocWithCustIdv2Temp(tid, data);
    data.tid = tid;
  } catch (error) {
    console.log(error);
    return -999;
  }
  return 1;
};


//checked
const mAddDocWithCustIdv2Temp = async (id, data) => {
  let result = await setDoc(doc(firestore_db, "dummy_teams", id), data);
  console.log(result);
};

//checked
export const setIsLoggedInFirestore = async (tid, newIsLoggedIn) => {
  try {
    await updateDoc(doc(firestore_db, "dummy_teams", tid), {
      is_logged_in: newIsLoggedIn,
    });
    return { success: true };
  } catch (error) {
    console.error(`Error updating is_logged_in for team ${tid}:`, error);
    return { success: false, error: error.message };
  }
};

// checked
export const searchForTeamIdOnFirestore = async (tid) => {
  try {
    const teamDoc = await getDoc(doc(firestore_db, "dummy_teams", tid));

    if (!teamDoc.exists()) {
      console.log(`Team with ID ${tid} not found.`);
      return -999; // Team ID not found
    }

    const teamData = teamDoc.data();

    if (teamData.is_logged_in) {
      console.log(`Team ${tid} is already logged in.`);
      return -1; // Already logged in on another device
    }

    return teamData;
  } catch (error) {
    console.error(`Error searching for Team ID ${tid}:`, error);
    return { error: "Database error", details: error.message };
  }
};

// checked
export const getStartTimeRT = () =>
  new Promise((resolve, reject) => {
    try {
      ref.child("start_datetime").once("value", (snapShot) => {
        resolve(snapShot.val());
      });
    } catch (err) {
      reject(err);
    }
});

// checked
export const getLogoutLatLng = (tid) =>
  new Promise((resolve, reject) => {
    try {
      ref
        .child("dummy_teams")
        .child(tid)
        .once("value", (snapShot) => {
          console.log(snapShot.val());
          resolve(snapShot.val());
        });
    } catch (err) {
      reject(err);
    }
  });

//checked
export const getTestJWT = (data) => {
  const token2 = jwt.sign(data, "secret", {
    expiresIn: "9999h",
  });
  console.log(token2);
};


