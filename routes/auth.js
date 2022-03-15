var express = require("express");
var router = express.Router();
var authHelper = require("../Helper/authHelper");
const companyHelper = require("../Helper/companyHelper");
const common = require("../Services/common");
var session=require('express-session')

router.post("/register", async (req, res) => {
  let email = await authHelper.verifyEmail(req.body.email);
  if (email.email) {
    res.json({ err: "Email already Exist" });
    console.log("errer"); 
  } else {
    try {
      let user = {
        name: req.body.name,
        role: "master",
        company: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
      };
      await companyHelper.create(req.body);
      let company = await companyHelper.getCompany(req.body);
      (user.companyId = company._id), await authHelper.create(user);

      res.json("AN Email sent to your mobile number");
    } catch (err) {
      res.json(err);
    }
  }
});
router.post("/login", async (req, res) => {
  let User = await authHelper.doLogin(req.body);
  if (User.user) {
    let token =await common.genertToken(User.data)
    res.json({ user:true,User:User.data,token });
  } else {
    res.json(User); 
  }
});


module.exports = router;
