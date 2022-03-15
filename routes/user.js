var express = require("express");
var router = express.Router();
var authHelper = require("../Helper/authHelper");
var companyHelper = require("../Helper/companyHelper");
router.post("/getuser", async (req, res) => {
  let User = await authHelper.findUser(req.body.user);
  if (User.user) {
    let company = await companyHelper.companyDetails(User.data.companyId);

    res.json({ user:true,User:User.data });
  } else {
    res.json(User);
  }
});

module.exports = router;
