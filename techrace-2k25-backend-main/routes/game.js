import express from "express";
import {
  addClue,
  changeState,
  getClueFromCid,
  getHintCommon,
  getHintCommonv2,
  // getHint2,
  getNextClue,
  powerUps,
  updateBalance,
  updateTimeToStart,
} from "../controllers/game.js";
import auth from "../middleware/auth.js";
// import { addClue } from "../models/game_model.js";

const router = express.Router();
// "/game"

router.post("/get_next_clue", auth, getNextClue); // for team to get next clue
router.post("/change_state", auth, changeState);// change state for normal people it seems 
//check this

router.post("/powerups/:pid", auth, powerUps);
router.post("/get_hint", auth, getHintCommonv2);
router.post("/get_clue_from_cid", auth, getClueFromCid);
router.post("/update_balance", auth, updateBalance);
router.post("/add_clue", addClue);
router.post("/update_time", auth, updateTimeToStart);

//clue id will be combinatio of bucket name and id

// do powerups here

export default router;
