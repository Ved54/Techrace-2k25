import {
  setIsLoggedInFirestore,
  saveLastLogoutLoc,
  addNewUserFirestore,
  addTeamRT,
} from "../models/user_model.js";
import { fetchTeamDataRegistrationRT } from "../models/volunteers_model.js";
// import { WaitingForReg } from "../utils/GameStates.js";

export const logout = async (req, res) => {
  try {
    const tid = req.user.tid;
    const teamData = await fetchTeamDataRegistrationRT(tid);

    if (!teamData || !teamData.state) {
      return res.json({ status: "0", message: "Team data not found." });
    }

    let mPromises = [setIsLoggedInFirestore(tid, false)];

    // Check if the player is in "Playing" state
    if (teamData.state === "Playing") {
      if (req.body.logout_loc_lat === "-999" || req.body.logout_loc_lng === "-999") {
        return res.json({
          status: "0",
          message: "Logout Failed: GPS location is required while playing.",
        });
      }
      mPromises.push(saveLastLogoutLoc(tid, req.body)); // Save last known location
    }

    await Promise.all(mPromises);
    res.json({ status: "1", message: "Logged Out Successfully" });
  } catch (error) {
    res.json({
      status: "0",
      message: "Log Out Failed\nMake sure your GPS Location is On",
      error: `${error}`,
    });
  }
};

// Saves user data in Firestore.
// Saves team data in Realtime Database.
export const newUser = async (req, res) => {
  try {

    if(req?.user?.vid == null){
      return res.status(400).json({status: "0",message: "Unauthentiated Request"});
    }

    const { tid, ...data } = req.body;

    // Add user to Firestore
    const status = await addNewUserFirestore(tid, data);
    if (status === -999) {
      return res.status(500).json({ status: "0", message: "Failed to add user to Firestore" });
    }

    // Add team to Realtime Database
    await addTeamRT(tid, data);

    res.status(201).json({ status: "1", message: "User added successfully", t_id: tid });
  } catch (error) {
    console.error("Error in newUser:", error);
    res.status(500).json({ status: "0", message: "Internal server error", error: error.message });
  }
};



