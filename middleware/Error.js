const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next)=>{
        err.statusCode = err.statusCode || 500;
        err.message = err.message || "Internal Server Error";

    // handling mongodb cast error
        if(err.name==="CastError"){
            const message = `Resource not found. Invalid ${err.path}`
            err = new ErrorHandler(message, 400)
        }

    // handling mongodb duplicate key error
        if(err.code===11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered, please try again with another ${Object.keys(err.keyValue)}`
            err = new ErrorHandler(message, 400)
        }

    // JWT error
        if(err.name==="JsonWebTOkenError"){
            const message = `Json web token is invalid, Please try again later`
            err = new ErrorHandler(message, 400)
        }

    // JWT expires
        if(err.name==="TokenExpireError"){
            const message = `Json web token is expired, Please try again`
            err = new ErrorHandler(message, 400)
        }

        res.status(err.statusCode).json({
            success:false,
            message:err.message,
        })
}