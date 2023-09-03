// server.js

// ...
const User = require("../models/userModel");
const {Country, City, State} = require("country-state-city")

// Keep track of the index of the last recommended user
let lastRecommendedIndex = -1;

async function getMutuals(user){
    // ids of all the friends of user
    const uFList = user.friendList;
    
    // complete user objects of all the friends
    const uFlistObjects = await User.find({ _id: { $in: uFList } });
    
    // get all tthe friends of friends list including all the ids and can be repeatative and can contain the user too
    const fListOfFriends=[];

    uFlistObjects.forEach(friend=>{
        friend.friendList.forEach(f=> fListOfFriends.push(f));
    });
    
    // including teh unique ones using the set;
    const uniqueMutual = [...new Set(fListOfFriends)];
    // console.log(uniqueMutual);

    // removing the user id from the unique list;
    const filteredFriendList = uniqueMutual.filter((friendId) => friendId.toString() !== user._id.toString());

    // getting the mututal friends objects from db 
    const resObj =await User.find({ _id: { $in: filteredFriendList } });

    // returning the res or [] based on availibility
    return resObj? resObj: [];
}


function filterByLocation(location, currLocation=null, users, uID){


    const filteredUser=[];

    users.forEach(u=>{
        const { city, state}= u.address;


        if(((location.city===city || location.state===state) && u._id.toString()!==uID.toString()) || ( currLocation &&( (currLocation.city===city || currLocation.state===state) && u._id.toString()!==uID.toString())) ){
            filteredUser.push(u);
        }

    })

    // console.log(filteredUser);

    return filteredUser? filteredUser:[];
}

function getAge(dob){
    const today = new Date()
    const userDoY = new Date(dob)

    const monthDiff = today.getMonth() - userDoY.getMonth();

    var age = today.getFullYear()-userDoY.getFullYear();

    // If the birth month is later than the current month, subtract one year from the age
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < userDoY.getDate())) {
      age--;
    }

    return age;
}

function filterByAge(dob, users){
    let userAge = getAge(dob);

    const minAge = userAge-2;
    const maxAge = userAge+2;

    const res =[];

    users.forEach(f=>{
        const fAge = getAge(f.dob);
        // console.log(fAge);
        if(fAge>=minAge && fAge<=maxAge){
            res.push(f);
        }
    })

    return res;
}

function shuffle(arr){
    const shuffledArray = [...arr];
    for (let i = shuffledArray.length - 1; i >=0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
     
    return shuffledArray;
}


// Function to get recommended users based on location and age range
async function getRecommendedUsers(user, currAddress=null) {
    // console.log(user);
  const { address, dob } = user;

  const currAddressGenFormat={};

  if(Boolean(currAddress.length)){
    currAddressGenFormat.city = currAddress.city;
    currAddressGenFormat.state = State.getAllStates().find((s)=>s.name===currAddress.state).isoCode;
    currAddressGenFormat.country =Country.getAllCountries().find((c)=>c.name===currAddress.country).isoCode;
  }


    //   console.log(currAddressGenFormat);

    // get mutual Firends;
    //   const mututalFriends = await getMutuals(user);
    //   get All Users
    const combinedFriendList = [...user.friendList, ...user.friendReq.got, ...user.friendReq.sent];
    const allUser =  await User.find({ _id: { $nin: combinedFriendList } });

    //   console.log(allUser);


    // filter all (mututal + all user) by location;
    let locationFiltered = [];
    if(currAddressGenFormat){
        locationFiltered = filterByLocation(address,currAddressGenFormat, allUser, user._id);
    }else{
        locationFiltered = filterByLocation(address, allUser, user._id);
    }

    // console.log(locationFiltered);


    // filter by age
    const ageFiltered = filterByAge(dob, locationFiltered)

    const lastStage = ageFiltered.length<3? locationFiltered: ageFiltered;

    const final = shuffle(locationFiltered);

    // console.log(final);

    return final
}

module.exports = getRecommendedUsers

// ...
