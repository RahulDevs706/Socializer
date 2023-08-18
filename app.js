const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const errorMiddleWare = require('./middleware/Error')
const path = require("path");
const cors = require("cors")

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "./config/config.env" });
}

const bodyParser = require('body-parser');
const fileUploader = require('express-fileupload')

const corsOptions ={
    AccessControlAllowMethod:'*',
 
    optionSuccessStatus:200
}

app.use(express.json({limit:'50mb'}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));
app.use(fileUploader());
app.use(cors(corsOptions));

// route imports

const user = require('./routes/userRoutes')
const util = require('./routes/utilsRoutes');
const post = require('./routes/postRoutes');

app.use('/api/v1/user', user);
app.use('/api/v1/util', util);
app.use('/api/v1/post', post);

// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

// middleware for error handling
app.use(errorMiddleWare);


module.exports = app