// creating token and saving in cookie
const moment = require("moment");

const sendToken=(user, statusCode, res, msg)=>{
    const token = user.getJWTToken();

    // options for cookies

     const expire =  moment().add(1, "days").toDate()

    const options = {
        expires:expire,
        httpOnly:true
    };

    res.status(statusCode).cookie("token", token, options).json({
        success:true,
        user,
        token,
        message:msg
    });
};

module.exports = sendToken;