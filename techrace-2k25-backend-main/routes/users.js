import express from "express";

import { logout, newUser } from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// so basically here connect your google sheet and run a python script , it will add 
// things i want is team name , p1 , p2, email , phone , tid, password will be generated using pythn script and data will be saved 
router.post("/new_user", auth, newUser); // works 

// see here logic when the player won't be able to logout
router.post("/logout", auth, logout);

export default router;
