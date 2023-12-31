const mongoose = require('mongoose');

const connectToDatabse = ()=>{

    mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology:true}).then((data)=>{
        console.log(`mongoDB connected with server ${data.connection.host}`);
    })

}

module.exports = connectToDatabse;

