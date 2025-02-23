import { fetchTeamDataRT, updateStateRT } from "../models/game_model.js";
import {
  fetchTeamDataRegistrationRT,
  getVolDataFirestore,
  resetFutureUndosRT,
  setEveryOneLogoutFirestore,
  setEveryOnePlayingRT,
  updateTimeRT,
} from "../models/volunteers_model.js";

import moment from "moment-timezone";

import {
  Banned,
  Playing,
  WaitingForGameStart,
  WaitingForReg,
} from "../utils/GameStates.js";

import ref from "../database/database.js";
moment.tz.setDefault("Asia/Kolkata");

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();



// checked by hitesh 
export const changeState = async (req, res) => {
  // server through state change to playing
  try {

    

    const data = req.body;
    if (
      data.new_state != WaitingForReg &&
      data.new_state != WaitingForGameStart &&
      data.new_state != Playing &&
      data.new_state != Banned
    ) {
      res.json({status: "0",message: "Invalid game state."});
      return;
    }

    
    let test = await fetchTeamDataRT(data.tid);
    if (test == null) {
      res.json({status: "0",message: "Team with the given Team ID not found."});
      return;
    }

    updateStateRT(data.tid, data.new_state); 
    res.json({status: "1",message: "State updated successfully"});
  } catch (error) {
    res.json({status: "0",message: "Failed: Error Occurred",error: `${error}`});
  }
};

const futureSetToPlaying = async (timeAfterSetToPlaying) => {
  setTimeout(async () => {
    await setEveryOnePlayingRT();
  }, timeAfterSetToPlaying);
};

export const loginVolunteer = async (req, res) => {
  try {
    const data = req.body;
    const volData = await getVolDataFirestore(data.vid);
    if (!volData.exists()) {
      res.json({ status: "0", message: "Volunteer ID incorrect"});
      return;
    }

    const actualVolData = volData.data();
    // console.log(actualVolData);
    if (!(actualVolData.password == data.password)) {
      res.json({status: "0", message: "Incorrect password"});
      return;
    }
    
    // create a jwt token for volunteer
    const token2 = jwt.sign({ vid: data.vid }, process.env.password, {
      expiresIn: "1111h",
    });
    res.json({status: "1",message: "Logged In Successfully", token: token2});
  } catch (error) {
    res.json({status: "0",message: `${error}`});
  }
};

export const registerTeam = async (req, res) => {
  try {
    const data = req.body;
    // console.log(data.tid);
    const teamData = await fetchTeamDataRegistrationRT(data.tid);
    // console.log(teamData);

    if (teamData == null) {
      res.json({status: "0",message: "Team ID incorrect"});
      return;
    }

    if (teamData.state != WaitingForReg) {
      res.json({status: "0",message: "Incorrect State of the Team"});
      return;
    }

    await updateStateRT(data.tid, WaitingForGameStart);
    res.json({status: "1",message: "Registered"});
  } catch (error) {
    res.json({status: "0",message: `${error}`});
  }
};

export const updateTimeToStart = async (req, res) => {
  // console.log(moment())
  try {

    const timeAfterSetToPlaying = moment(req.body.new_start_datetime).diff(
      moment(),
      "milliseconds"
    );

    await futureSetToPlaying(timeAfterSetToPlaying); // Wait for the scheduled start
    await updateTimeRT(req.body); // Store new start time

    res.json({ status: "1", message: "Start time updated successfully" });
  } catch (error) {
    res.json({ status: "0", message: "Error occurred", error: `${error}` });
  }
};


export const setEveryOnePlaying = async (req, res) => {
  try {

    await setEveryOnePlayingRT(); // Ensure it completes before sending response
    res.json({
      status: "1",
      message: "State updated successfully",
    });
  } catch (error) {
    console.error("Error in setEveryOnePlaying:", error);
    res.json({
      status: "0",
      message: "Failed: Error Occurred",
      error: `${error.message || error}`,
    });
  }
};


export const setEveryOneLogout = async (req, res) => {
  try {

    await setEveryOneLogoutFirestore(); 
    res.json({status: "1",message: "All teams logged out successfully"});
  } catch (error) {
    console.error("Error in setEveryOneLogout:", error);
    res.json({status: "0",message: "Failed: Error Occurred",error: `${error.message || error}`});
  }
};


// freeze and all using volunteer api , should be automated in game logic
export const resetFutureUndos = async (req, res) => {
  try {

    

    await resetFutureUndosRT();
    res.json({status: "1",message: `Future Undos Executed Successfully`});
  } catch (error) {
    res.json({status: "0",message: `${error}`});
  }
};
