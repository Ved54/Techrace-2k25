import {
  searchForTeamIdOnFirestore,
  getStartTimeRT,
  setIsLoggedInFirestore,
} from "../models/user_model.js";

import { fetchTeamDataRT } from "../models/game_model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import moment from "moment-timezone";

dotenv.config();
moment.tz.setDefault("Asia/Kolkata");
function haversine_distance(sLat, sLng, dLat, dLng) {
  // var R = 3958.8; // Radius of the Earth in miles //toh ans bhi shayad miles me hi milega
  var R = 6.371 * 1000000; // Radius of the Earth in miles //toh ans bhi shayad miles me hi milega
  var rlat1 = sLat * (Math.PI / 180); // Convert degrees to radians
  var rlat2 = dLat * (Math.PI / 180); // Convert degrees to radians
  var difflat = rlat2 - rlat1; // Radian difference (latitudes)
  var difflon = (dLng - sLng) * (Math.PI / 180); // Radian difference (longitudes)

  var d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    );
  return d;
}

export const login = async (req, res) => {
  try {
    
    const data = req.body;
    if(!data.hasOwnProperty("tid") || !data.hasOwnProperty("password")){
      return res.status(400).json({status: "0",message: "Invalid Request"});
    }
    const tid = data.tid;
    const prev = await searchForTeamIdOnFirestore(tid);

    // auth for tid credentials
    if (prev == -999) {
      return res.json({status: "0",message: "Team with the given Team ID not found."});
    } else if (prev == -1) {
      return res.json({status: "0",message:"Already Logged In in another device.\nLogout from there first."});
    } else if (prev.password != data.password) {
      return res.json({status: "0",message: "Incorrect Password"});
    } else {
      let teamData = await fetchTeamDataRT(tid);
      if (teamData.state === "Banned") {
        return res.json({status: "0",message:"You have been disqualified from the race because of cheating.\nThis is a final decision and cannot revoked"});
      }

      if (teamData.logout_loc_lat != "-999") {
        // this implies that the person has not logged in for the first time
        let dist = haversine_distance(
          data.curr_lat,
          data.curr_lng,
          teamData.logout_loc_lat,
          teamData.logout_loc_lng
        );
        if (dist > 250 || dist < -250) {
          res.json({
            status: "2",
            message:
              "Cheating detected.\nYou are more than 250 meters away from your last logout location.\nKindly login with your device only.\nFurther cheating attempts will immediately lead to ban and disqualification from the race.",
          });
          return;
        }
      }
      setIsLoggedInFirestore(tid, true); 
      const token2 = jwt.sign({ tid: tid }, process.env.password, {
        expiresIn: "1111h",
      });
      let startDateTime = await getStartTimeRT();

      res.json({
        status: "1",
        message: "Logged In Successfully",
        token: token2,
        p1: prev.name1,
        p2: prev.name2,
        start_datetime: startDateTime,
        current_clue_no: teamData.current_clue_no,
      });
    }
  } catch (error) {
    res.json({
      status: "0",
      message: "Error occurred.",
      error: `${error}`,
    });
  }
};

