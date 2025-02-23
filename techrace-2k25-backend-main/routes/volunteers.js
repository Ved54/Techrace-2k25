import express from "express";
import {
  changeState,
  loginVolunteer,
  registerTeam,
  resetFutureUndos,
  setEveryOneLogout,
  setEveryOnePlaying,
  updateTimeToStart,
} from "../controllers/volunteers.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// "/volunteers"
router.post("/login", loginVolunteer); // done 
router.post("/register_team", auth , registerTeam); // done
router.post("/change_state", auth, changeState); // done
router.post("/set_everyone_playing", auth, setEveryOnePlaying); // done
router.post("/set_everyone_logged_out", auth, setEveryOneLogout); // done 
router.post("/update_start_datetime", auth, updateTimeToStart); // done
router.post("/reset_future_undos", auth, resetFutureUndos); // done

export default router;
