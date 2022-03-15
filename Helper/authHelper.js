var db = require("../Config/Connection");
var collection = require("../Config/Collection");
var commonService = require("../Services/common");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");



module.exports = {
  verifyEmail: (email) => {
    return new Promise(async (resove, reject) => {
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: email });
      if (user) {
        resove({ email: true });
      } else {
        resove({ email: false });
      }
    });
  },
  create: (user) => {
    return new Promise(async (resolve, reject) => {
      let password = await commonService.generatePassword();
      user.password = await bcrypt.hash(password, 10);
      user.status="active"

      await db.get().collection(collection.USER_COLLECTION).insertOne(user);
      let mail = {
        reciver: user.email,
        subject: `${
          user.role === "master"
            ? `Your master accound login creditionals`
            : `your login creditionals to sbill `
        }`,
        html: `${
          user.role === "master"
            ? `
        <div>
    <p>hi ${user.company}</p><br>
    
    <p>your userid is ${user.email} and password is: ${password}</p>
    <p>pleas login and change your password, configer your account  </p>
      </div>`
            : `<div>
        <p>hi ${user.name}</p><br>
        <p>Congadulations for the role of ${user.role} on ${user.company}</p>
        <p>your userid is ${user.email} and password is ${password}.</p>
        <p>pleas login and change your password </p>
    </div>`
        }`,
      };
      await commonService.sentingMail(mail);
      resolve();
    });
  },
  doLogin:(data)=>{
    return new Promise(async(resolve,reject)=>{
      let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:data.email})
      if(user){
        if(user.status==="active"){
          await bcrypt.compare(data.password,user.password).then(async(status)=>{
            if(status){
              resolve({
                user:true,
                data:{name:user.name,
                  company:user.company,
                  companyId:user.companyId,
                  role:user.role,
                  userId:user._id}
              })
            }else{
              resolve({user:false, message:'pleas check your Email and Password'})
            }
          })
        }else{
          resolve({user:false,message:"this user  is not working contact your manager"})
        }
        

      }else{
        resolve({user:false, message:'pleas check your Email and Password'})
      }
    })
  },
  findUser:(userId)=>{
 
    return new Promise (async(resolve,reject)=>{

      let user=await db.get().collection(collection.USER_COLLECTION).findOne({_id:ObjectId(userId)})
      if(user){
        if(user.status==='active'){
          resolve({user:true,
            data:{name:user.name,
            company:user.company,
            companyId:user.companyId,
            role:user.role,
            userId:user._id}})
        }else{
          resolve({user:false,message:"this user  is not working contact your manager"})
        }
        

      }else{
        resolve({user:false, message:'pleas check your Email and Password'})
      }
      
     
    })

  }
};
