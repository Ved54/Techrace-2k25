import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = async (req, res, next) => {
  try {

    const token = req.headers.authorization.split(" ")[1];

    const isCustomAuth = token.length < 500;
    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.password); // just like as encryption
      req.user = decodedData;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    next();
    
  } catch (error) {
    res.json({status: "0",message: "Error: Unauthentiated Request"});
  }
};

export default auth;

