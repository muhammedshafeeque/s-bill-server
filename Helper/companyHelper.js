var db = require("../Config/Connection");
var collection = require("../Config/Collection");
var commonService = require("../Services/common");
var objectId = require('mongodb').ObjectId;
const async = require("hbs/lib/async");
module.exports = {
  create: (data) => {
    data.configoration = false;
    data.users = 1;
    return new Promise(async (resolve, reject) => {
      try {
        await db
          .get()
          .collection(collection.COMPANY_COLLECTION)
          .insertOne(data);
        let mail = {
          reciver: data.email,
          subject: "Welcome to Sbill Community",
          html: `<div><p>Welcome ${data.name} to S-bill community</p><br><p>we will send password and user id to this email address within one hour</p></div>`,
        };
        await commonService.sentingMail(mail);
        resolve();
      } catch (err) {
        console.log(err);
        resolve(err);
      }
    });
  },
  getCompany: (data) => {
    return new Promise(async (resolve, reject) => {
      let company = await db
        .get()
        .collection(collection.COMPANY_COLLECTION)
        .findOne({ email: data.email });
      resolve(company);
    });
  },
  companyDetails:(companyId)=>{
    return new Promise (async(resolve,reject)=>{
      let company=await  db.get().collection(collection.COMPANY_COLLECTION).findOne({_id:objectId(companyId)})
      resolve(company)
    })
  }
};
