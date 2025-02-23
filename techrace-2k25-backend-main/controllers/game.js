
import {
  updateStateRT,
  updateTeamDataRT,
  addClueFirestore,
  getClueFirestore,
  updateTimeRT,
  fetchTeamDataRT,
} from "../models/game_model.js";
import {
  constructCid,
} from "../models/user_model.js";


export const freezeDuration = 10 * 60;
export const freezeCooldownDuration = 15 * 60;
export const meterOffDuration = 15 * 60;
export const meterOffCooldownDuration = 0 * 60;
export const invisibilityDuration = 10 * 60;
export const hint1LockDuration = 5 * 60;
export const hint2LockDuration = 10 * 60;

import moment from "moment-timezone";
moment.tz.setDefault("Asia/Kolkata");

export const updateTimeToStart = async (req, res) => {
  updateTimeRT(req.body);
  res.json({
    status: "1",
  });
};
export const addClue = async (req, res) => {
  try {
    addClueFirestore(req.body);
    res.json({
      status: "1",
    });
  } catch (error) {
    res.json({
      status: "0",
      message: "Failed: Error Occurred",
      error: `${error}`,
    });
  }
};

export const updateBalance = async (req, res) => {
  try {
    updateTeamDataRT(req.user.tid, { balance: req.body.updated_balance });
    res.json({
      status: "1",
      message: "Points updated",
    });
  } catch (error) {
    res.json({
      status: "0",
      message: "Failed: Error Occurred",
      erros: `${error}`,
    });
  }
};

export const getHintCommon = async (req, res) => {
  try {
    const cost1 = 100;
    const cost2 = 100;

    const teamData = await fetchTeamDataRT(req.user.tid);

    if (teamData.hint_1 == "-999") {
      if (teamData.balance < cost1) {
        res.json({
          status: "0",
          message: "Insufficient points.",
        });
        return;
      }
      const hint = await getClueFirestore(req.body.cid, false);
      updateTeamDataRT(req.user.tid, {
        balance: teamData.balance - cost1,
        hint_1: hint.hint_1,
      });
      return;
    } else {
      if (teamData.balance < cost2) {
        res.json({
          status: "0",
          message: "Insufficient points.",
        });
        return;
      }
      const hint = await getClueFirestore(req.body.cid, false);
      updateTeamDataRT(req.user.tid, {
        balance: teamData.balance - cost2,
        hint_2: hint.hint_2,
      });

      res.json({
        status: "1",
        message: "Successfull",
      });
      return;
    }

  } catch (error) {
    console.log(error);
    res.json({
      status: "0",
      message: "Failed: Error Occurred",
      erros: `${error}`,
    });
  }
};

export const getHintCommonv2 = async (req, res) => {
  //types bhi update karo

  // next clue ke time pe getHint1 and 2 change karne padege
  try {
    // const cost1 = 100;
    // const cost2 = 100;

    let data = req.body;
    data.updated_balance = Number.parseInt(data.updated_balance);

    console.log(data.updated_balance);
    console.log(typeof data.updated_balance);
    if (data.updated_balance < 0) {
      res.json({
        status: "0",
        message: "Insufficient points.",
      });
      return;
    }

    const teamData = await fetchTeamDataRT(req.user.tid);

    if (teamData.hint_1 == "-999") {
      const hint = await getClueFirestore(req.body.cid, false);

      await updateTeamDataRT(req.user.tid, {
        // balance: teamData.balance - cost1,
        balance: data.updated_balance,
        hint_1: hint.hint_1,
        hint_1_type: hint.hint_1_type,
      });

      res.json({
        status: "1",
        message: "Successfull",
      });
      return;

      // res.json({
      //   status: "0",
      //   message: "1st Hint Already Used",
      // });
      // return;
    } else {
      if (data.updated_balance < 0) {
        res.json({
          status: "0",
          message: "Insufficient points.",
        });
        return;
      }
      const hint = await getClueFirestore(req.body.cid, false);
      await updateTeamDataRT(req.user.tid, {
        // balance: teamData.balance - cost2,
        balance: data.updated_balance,
        hint_2: hint.hint_2,
        hint_2_type: hint.hint_2_type,
      });

      res.json({
        status: "1",
        message: "Successfull",
      });
      return;
    }

 ;
  } catch (error) {
    console.log(error);
    res.json({
      status: "0",
      message: "Failed: Error Occurred",
      erros: `${error}`,
    });
  }
};

export const getClueFromCid = async (req, res) => {
  try {
    console.log(req.body)
    const teamData = await fetchTeamDataRT(req.user.tid);
    // const hint = await getClueFirestore(req.body.cid, true);
    const clue = await getClueFirestore(teamData.cid, true); //fixing cid thing

    console.log(clue);

    // pass all the hints and data at the ask of next clue

    res.json({
      status: "1",
      // hint: ,
      ...clue,
    });
  } catch (error) {
    res.json({
      status: "0",
      message: "Failed: Error Occurred",
      erros: `${error}`,
    });
  }
};


export const futureUndo = async (tid, payload, freeTimeInMilli) => {
  setTimeout(() => {
    updateTeamDataRT(tid, payload);
  }, freeTimeInMilli);
};

const reverseFreezeTeam = async (tid, payload, res) => {
  // const mDate = Date.parse()
  // const cost = 100;
  const cost = 175;
  let teamData = await fetchTeamDataRT(tid);
  if (cost > payload.current_balance) {
    res.json({
      status: "0",
      message: "Failed: Insufficient points.",
    });
  }

  else if (
    moment(payload.ask_timestamp).diff(teamData.freezed_on, "seconds") > 60

    // payload.ask_timestamp >
    // teamData.freezed_on - 7.5 * 60 * 1000 + 60 * 1000
  ) {
    res.json({
      status: "0",
      message: "Failed: Can't reverse freeze a team after 60 seconds.",
    });
  } else {
    payload.opp_tid = teamData.freezed_by;
    updateTeamDataRT(tid, {
      is_freezed: false,
      // freezed_on: moment().subtract(freezeDuration, "seconds").format(), //set to arbitarity piche
      freezed_on: moment()
        .subtract(freezeDuration + freezeCooldownDuration + 60 * 60, "seconds")
        .format(), //set to arbitarity piche
    }); //this should work
    freezeTeam(tid, payload, res, true); //yehi res.json bhej dega //yaha force
  }
};

export const calculatePointsToAdd = (
  ask_timestamp,
  prev_clue_solved_timestamp
) => {
  const basePoints = 20;
  const minusFrom = 60;


  console.log(
    moment(ask_timestamp).diff(moment(prev_clue_solved_timestamp), "minutes")
  ); 

  const bonusPoints =
    minusFrom -
    moment(ask_timestamp).diff(prev_clue_solved_timestamp, "minutes");

  console.log("bonusPoints");
  console.log(bonusPoints); // 60

  let onClueUpPoints = basePoints + (bonusPoints < 0 ? 0 : bonusPoints);
  console.log("onClueUpPoints");
  console.log(onClueUpPoints); //80

  return onClueUpPoints;
};

export const checkIfDiscount = (teamData, costBeforeCoupon, powerUpName) => {
  console.log(powerUpName in teamData);
  if (powerUpName in teamData) {
    if (teamData[powerUpName] > 0) {
      return 0;
    }
  }
  return costBeforeCoupon;
};

export const guessLocationV1 = async (tid, payload, res) => {

  const costM = 200; //check if discournt

  let teamData = await fetchTeamDataRT(tid);
  const cost = checkIfDiscount(teamData, costM, "guess_loc_coupon");
  // console.log("here");

  if (cost > payload.current_balance) {
    // do quick baar mara toh issue ho jaega
    res.json({
      status: "0",
      message: "Insufficient points.",
    });
    return;
  }

  if (teamData.current_clue_no > 11) {
    res.json({
      status: "0",
      message: "This Power Card cannot be used after clue number 11",
    });
    return;
  }
  // if (teamData.no_guessed_used >= 2) {
  if (teamData.no_guessed_used >= 1) {
    //only one guess ka system. guessed cannot be used after 9
    res.json({
      status: "0",
      message:
        // "You can have used Guess A Location 2 times already.\nYou cannot use more than 2 times",
        "You can have used Skip A Location 1 time already.\nYou cannot use more than 1 time",
    });
    return;
  } else {
      const onClueUpPoints = calculatePointsToAdd(
              payload.ask_timestamp,
              teamData.prev_clue_solved_timestamp
            );
      
            let toUpdate = {
              balance: payload.current_balance - cost + onClueUpPoints, // because clue up hone ke baad points toh milenge hi na
              current_clue_no: teamData.current_clue_no + 1,
              // multiple clicks should be avoided
              // route_no: getRandomRouteId(), //check this // you don't need this
              cid: constructCid(teamData.current_clue_no + 1), // check if this works correctly or not
              no_guessed_used: teamData.no_guessed_used + 1,
              prev_clue_solved_timestamp: payload.ask_timestamp,
              hint_1: "-999",
              hint_2: "-999",
              // guess_loc_coupon: teamData.guess_loc_coupon, //don't add this
            };
            if (checkIfDiscount(teamData, costM, "guess_loc_coupon") == 0) {
              //issue here
              toUpdate.guess_loc_coupon = teamData.guess_loc_coupon - 1;
            }
      
            updateTeamDataRT(tid, toUpdate); // solved the thing. randomize wala remaining
      
            res.json({
              status: "1",
              message: "Skipped Location Successfully.",
            });
            return;
          }
};

export const freezeTeam = async (tid, payload, res, isForReverseFreeze) => {
  const teamData = await fetchTeamDataRT(tid);
  // const costBeforeDis = 100;
  const costBeforeDis = 125;
  // const costOfReverseFreeze = 100;
  const costOfReverseFreeze = 175;

  const cost = isForReverseFreeze
    ? costOfReverseFreeze
    : checkIfDiscount(teamData, costBeforeDis, "freeze_team_coupon");

  console.log("cost");
  console.log(cost);

  let opponentData = await fetchTeamDataRT(payload.opp_tid);

  console.log("dfsfdfd"); // idhar somehow nan aa raha //check why Nan
  console.log(moment(payload.ask_timestamp));

  console.log("opponentData.freezed_on");
  console.log(opponentData.freezed_on); //opponent freezed on ka issue hai

  // idhar issue aa raha
  console.log(moment(opponentData.freezed_on)); // opponentfreezed on is invalid// matlab 065 ka
  console.log(
    moment(payload.ask_timestamp).diff(
      moment(opponentData.freezed_on),
      "seconds"
    )
  );

  if (cost > payload.current_balance) {
    res.json({
      status: "0",
      message: "Failed: Insufficient points.",
    });
  } else if (opponentData.is_freezed) {
    res.json({
      status: "0",
      message:
        "Failed: Opponent Team is already frozen. Please try again later.",
    });
    // } else if (opponentData.freezed_on > payload.ask_timestamp) {
  } else if (
    !isForReverseFreeze &&
    moment(payload.ask_timestamp).diff(
      moment(opponentData.freezed_on),
      "seconds"
    ) <
      // 7.5 * 60 + 20 * 60
      freezeDuration + freezeCooldownDuration //check this
  ) {
    // console.log(
    //   moment(opponentData.freezed_on).diff(moment(payload.ask_timestamp))
    // );

    // console.log(
    //   moment(payload.ask_timestamp).diff(
    //     moment(opponentData.freezed_on),
    //     "seconds"
    //   )
    // );
    res.json({
      status: "0",
      message:
        "Failed: Cooldown period is on of Opponent Team. Please try again later.",
    });
  } else {
    // let testTime = moment(opponentData.freezed_on).add(
    //   7.5 * 60 * 1000 + 20 * 60 * 1000,
    //   "milliseconds"
    // );
    // .format();

    // console.log("testTime");
    // console.log(testTime);

    updateTeamDataRT(payload.opp_tid, {
      freezed_by: isForReverseFreeze ? "-999" : tid,
      is_freezed: true,
      freezed_on: payload.ask_timestamp,

      // moment(payload.ask_timestamp)
      //   .add(7.5 * 60 * 1000 + 20 * 60 * 1000, "milliseconds")
      //   .format(), // 20 minutes cooldown period
      // payload.ask_timestamp + 7.5 * 60 * 1000 + 20 * 60 * 1000, // 20 minutes cooldown period
    });

    const updated_balance = payload.current_balance - cost;

    let toUpdateSameTeam = {
      balance: updated_balance,
    };
    if (cost == 0) {
      toUpdateSameTeam.freeze_team_coupon = teamData.freeze_team_coupon - 1;
      // 3;
    }
    updateTeamDataRT(tid, toUpdateSameTeam);

    // Delayed execution

    // futureUndo(payload.opp_tid, { is_freezed: false }, 7.5 * 60 * 1000); //temp
    // futureUndo(payload.opp_tid, { is_freezed: false }, 2 * 60 * 1000);
    futureUndo(payload.opp_tid, { is_freezed: false }, freezeDuration * 1000);
    // futureUnfreeze(payload.opp_tid, 1 * 5 * 1000); //for testing only. Working correctly

    res.json({
      status: "1",
      message: "Opponent Team Freezed Successfully.",
      updated_balance: updated_balance,
    });
  }
};

const reducePoints = async (tid, payload, res) => {
  const cost = 100;
  const reduceBy = 100;
  if (cost > payload.current_balance) {
    res.json({
      status: "0",
      message: "Failed: Insufficient points.",
    });
    return;
  }

  let opponentData = await fetchTeamDataRT(payload.opp_tid);
  updateTeamDataRT(payload.opp_tid, {
    balance: opponentData.balance - reduceBy,
  });
  const updated_balance =
    payload.current_balance - cost < 0 ? 0 : payload.current_balance - cost;
  updateTeamDataRT(tid, {
    balance: updated_balance,
  });
};

// ask timestamp dalna padega
// yeh checks sab jagah daal de
export const meterOff = async (tid, payload, res) => {
  const costBeforeDis = 100;

  const oppTeamData = await fetchTeamDataRT(payload.opp_tid);
  const teamData = await fetchTeamDataRT(tid);

  const cost = checkIfDiscount(teamData, costBeforeDis, "meter_off_coupon");

  if (cost > payload.current_balance) {
    res.json({
      status: "0",
      message: "Failed: Insufficient points.",
    });
    return;
  }
  if (oppTeamData.is_meter_off) {
    res.json({
      status: "0",
      message: "Failed: Opponent Team's meter is already off.",
    });
    return;
  }


  const updated_balance = payload.current_balance - cost;

  futureUndo(payload.opp_tid, { is_meter_off: false }, meterOffDuration * 1000);
  res.json({
    status: "1",
    message: "Opponent Team's Meter Turned Off Successfully.",
    updated_balance: updated_balance,
  });

  // let opponentData = await fetchTeamDataRT(payload.opp_tid);

  updateTeamDataRT(payload.opp_tid, {
    is_meter_off: true,
    meter_off_on: payload.ask_timestamp,
  });

  let toUpdateSameTeam = {
    balance: updated_balance,
  };

  if (checkIfDiscount(teamData, costBeforeDis, "meter_off_coupon") == 0) {
    toUpdateSameTeam.meter_off_coupon = teamData.meter_off_coupon - 1;
  }

  console.log("toUpdateSameTeam");
  console.log(toUpdateSameTeam);

  updateTeamDataRT(tid, toUpdateSameTeam);
};

const invisible = async (tid, payload, res) => {
  // check for block
  // check fo already frozen
  // const cost = 100;
  const cost = 130;
  if (cost > payload.current_balance) {
    res.json({
      status: "0",
      message: "Insufficient points.",
    });
    return;
  }

  let teamData = await fetchTeamDataRT(tid);
  if (teamData.is_invisible) {
    res.json({
      status: "0",
      message: "You are already invisible",
    });
    return;
  }

  const updated_balance = payload.current_balance - cost;
  updateTeamDataRT(tid, {
    is_invisible: true,
    balance: updated_balance,
  });

  // futureUndo(tid, { is_invisible: false }, 7.5 * 60 * 1000);
  futureUndo(tid, { is_invisible: false }, invisibilityDuration * 1000);
  res.json({
    status: "1",
    message: "You have become invisible for the next 7.5 minutes",
  });
};

// before applying powercards check toh karo // not needed

// //powerups : reducer, freeze, skip a location, MeterOff, Invisibility
//on opponent : reducer , freeze, MeterOff

//self : Freeze, Skip a Location, Invisibility

// for opponent team cooldown bhi lagana hai
let lockMap = new Map();
export const powerUps = async (req, res) => {
  const data = req.body;
  try {

    if (data.opp_tid != "-999") {
      // console.log(lockMap);
      if (lockMap.has(data.opp_tid) || lockMap.has(req.user.tid)) {
        res.json({
          status: "0",
          message:
            "Cannot apply the powercard at the moment\nPlease try again later",
        });
        return;
      }
      lockMap.set(data.opp_tid, true);
      lockMap.set(req.user.tid, true);

      // in this case, it is a two team power card
      // apply map here

      // console.log(data["opp_tid"]);
      let oppTeamData = await fetchTeamDataRT(data["opp_tid"]);
      console.log("oppTeamData.is_invisible");
      console.log(oppTeamData.is_invisible);

      if (req.params.pid != 5 && oppTeamData.is_invisible) {
        res.json({
          status: "0",
          message: "Opponent Team is Invisible.\nTry again later.",
        });
        return;
      }
    }

    console.log(req.params);
    switch (req.params.pid) {
      case "1":
        guessLocationV1(req.user.tid, data, res);
        break;
      case "2":
        freezeTeam(req.user.tid, data, res, false);
        break;
      // case "3":
      //   reducePoints(req.user.tid, data, res);
      //   break;
      case "3":
        meterOff(req.user.tid, data, res);
        break;
      case "4":
        invisible(req.user.tid, data, res);
        break;
      case "5":
        reverseFreezeTeam(req.user.tid, data, res);
        break;
      default:
        break;
    }
    // if (req.params.pid == 2) {
    //   freezeTeam(req.user.tid, data, res);
  } catch (error) {
    res.json({
      status: "0",
      message: "Failed: Error Occurred",
      erros: `${error}`,
    });
  } finally {
    lockMap.delete(data.opp_tid);
    lockMap.delete(req.user.tid);
  }
  // }
};

// dual security or only on his side?
// mere end se sab kar le

const getClue = (tid, clue_no) => {
  return `${tid}_${clue_no}`;
};

export const getNextClue = async (req, res) => {
  try {
      const data = req.body;
      updateTeamDataRT(req.user.tid, {
      balance: data.balance,
      current_clue_no: data.clue_no,
      prev_clue_solved_timestamp: data.prev_clue_solved_timestamp,
      hint_1: "-999",
      hint_2: "-999",
    });
    return res.json({
      status: "1",message: "Request completed successfully.",current_clue_no: data.clue_no,clue: getClue(req.user.tid, data.clue_no),
    });

  } catch (error) {
    res.json({status: "0",message: "Failed: Error Occurred",error: `${error}`,});
  }
};

export const changeState = async (req, res) => {
  try {
    const data = req.body;
    updateStateRT(data.user.tid, data.new_state); //temp
    res.json({status: "1",message: "State updated successfully",});
  } catch (error) {
    res.json({
      status: "0",
      message: "Failed: Error Occurred",
      erros: `${error}`,
    });
  }
};
