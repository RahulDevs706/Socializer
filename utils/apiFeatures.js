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