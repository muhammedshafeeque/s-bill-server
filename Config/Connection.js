var config=require('../env.json')
const mongoClient=require('mongodb').MongoClient
const state={
    db:null
}

module.exports.connect=function(done){
    const url=config.db_url
    const dbname=config.db 

    mongoClient.connect(url,{ useUnifiedTopology: true},(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done()
    })

    
}

module.exports.get=function(){
    return state.db
}