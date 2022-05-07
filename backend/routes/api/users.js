const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/UserSchema");

const keys = "thisisloginsecretkeyisheretosecurewhenuserislogin";

router.post("/register", (req, res) => {
    User.findOne({email:req.body.email}).then(user=>{

        if(user){
            return res.status(400).json({email:"Email already exists"});
        } else{
            const newUser = new User({
                name:req.body.name,
                password:req.body.password,
                email:req.body.email
            });

            const rounds  = 10;
            bcrypt.genSalt(rounds, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
            });
        }

    });

});

router.post("/login",(req,res) => {

    const email = req.body.email;
    const password = req.body.password;
   
    User.findOne({email}).then(user=>{
        if(!user){
            return res.status(200).json({ emailnotfound: "Email not found" });
        }
console.log("=================user");
    bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
            const payload = {
                id: user.id,
                name: user.name
            };

            jwt.sign(
                payload,
                keys,
                {
                 expiresIn: 31556926 
                },
                (err, token) => {
                res.json({
                    success: true,
                    token: "Bearer " + token
                });
                }
            );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
});

module.exports = router;
