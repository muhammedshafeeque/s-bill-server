var express = require("express");
var router = express.Router();
var authHelper = require("../Helper/authHelper");
var companyHelper = require("../Helper/companyHelper");

router.post('/getcompanydetails',async(req,res)=>{
    let company =await companyHelper.companyDetails(req.body.companyId)
    res.json(company)
})

module.exports = router;
