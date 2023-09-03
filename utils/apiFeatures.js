class ApiFeatures{
    constructor(user, query){
        this.user = user;
        this.query = query;
    }

    search(){
        const keyword = this.query.keyword?{
            name:{
                $regex: this.query.keyword,
                $options:"i"
            }
        }: {}

        this.user = this.user.find({...keyword}).sort({name:"1"});

        return this;
    }
}

module.exports = ApiFeatures

// class ApiFeatures {
//     constructor(query, queryObj) {
//         this.query = query;
//         this.queryObj = queryObj;
//     }

//     search() {
//         if (this.queryObj.keyword) {
//             const keyword = this.queryObj.keyword;
//             this.query = this.query.find({ name: { $regex: `^${keyword}`, $options: "i" } });
//         }

//         return this;
//     }

//     sort() {
//         this.query = this.query.sort({ name: 1 });
//         return this;
//     }
// }

// module.exports = ApiFeatures;