import { Router } from "express";
import * as jwt from "jsonwebtoken";
//import * as passport from "passport";
import passport from "passport"; // fix for `passport.authenticate is not a function`
import * as User from "../models/user.model";
import { secret } from "../config/jwt.config";
import * as PassportConfig from "../config/passport.config";

class UserRoute {

    constructor(){
        this.router = Router();
        this.routes();
        this.UserModel = User.default.UserSchema;
        PassportConfig.default.config(passport);
    };

    public router:any;
    public UserModel:any;

    public getToken(headers:any) {
        let token;
        if (headers && headers.authorization) {
            let parted = headers.authorization.split(' ');
            if (parted.length === 2) {
                token = parted[1]; //remove JWT string from the token.
            } else {
                token = null;
            }
        } else {
            token = null;
        }

        return token;
    }

    private generateToken (usr:any) {
       return jwt.sign(usr.toObject(), secret, { expiresIn: '1h' });
       //return jwt.sign({ data: usr.toObject(), exp: Math.floor(Date.now() / 1000) + (2 * 60) }, secret);
    }

    public routes() {
        //get all users.
        this.router.get("/", passport.authenticate('jwt', { session: false}), (req:any, res:any) => {
            let self = this;
            let token = self.getToken(req.headers);
            
            /*if (token) {
                jwt.verify(token, secret, function(err:any, decoded:any) {
                    if (err) {
                        res.json({success: false, message: 'JWT verification failed.', error: err});
                    } else {
                        //console.log(`Decoded : ${JSON.stringify(decoded)}`);
                        self.UserModel.find()
                            .then(function(users:any){
                                res.json({success: true, data: users});
                            }).catch(function (exc:any) {
                                res.json({success: false, data: null, error: exc});
                            });
                    }
                });
            } else {
                res.json({success: false, data: null, message: 'Unauthorized: No token was received.'});
            }*/

            self.UserModel.find()
                .then(function(users:any){
                    res.json({success: true, data: users});
                }).catch(function (exc:any) {
                    res.json({success: false, data: null, error: exc});
                });

        });

        //get one user.
        this.router.get("/:id", passport.authenticate('jwt', { session: false}), (req:any, res:any) => {
            let self = this;
            
            self.UserModel.findOne({ _id:req.params.id })
                .then(function(user:any){
                    res.json({success: true, data: user});
                }).catch(function (exc:any) {
                    res.json({success: false, data: null, error: exc});
                });
        });

        //create a user.
        this.router.post("/", (req:any, res:any) => {
            if (!req.body.email || !req.body.password) {
                res.json({success: false, msg: "Please pass email and password."});
            } else if (req.body.email.includes(' ') || req.body.password.includes(' ')) {
                res.json({success: false, msg: "email or password cannot have empty spaces"});
            } else {
                let newUser = new this.UserModel({
                    password: req.body.password,
                    email: req.body.email,
	                fullname: req.body.fullname
                });

                /* 
                    checking if there are any users in DB. Logic is that the first user ever added will be
                    an admin and will be added with direct call to this API
                */
                this.UserModel.find()
                    .then(function(users:any){
                        // res.json({success: true, data: user});
                        if (users.length == 0) {
                            console.log("our FIRST user boutta be created");
                            newUser.role = "admin";
                        }

                        // save the user
                        newUser.save(function(err: any, user: any) {
                            if (err) {
                                return res.json({success: false, msg: "Error creating user", error: err});
                            } else {
                                return res.json({success: true, msg: "Successful created new user.", id: user._id});
                            }
                            
                        });
                    }).catch(function (exc:any) {
                        res.json({success: false, data: null, error: exc});
                    });
            }
        });

        //user login.
        this.router.post("/login", (req:any, res:any) => {
            let self = this;
            if (!req.body.email || !req.body.password) {
                res.json({success: false, msg: "Please pass email and password."});
            } else {
                this.UserModel.findOne({
                    email: req.body.email
                  }, function(err:any, user:any) {
                    if (err) res.json({success: false, message: "Error logging in", error: err});
                
                    if (!user) res.status(401).send({success: false, msg: "Authentication failed. User not found."});
                    else {
                      // check if password matches
                      user.comparePassword(req.body.password, function (err:any, isMatch:any) {
                        if (isMatch && !err) {
                          let token = self.generateToken(user);
                    
                          res.json({success: true, token: "JWT " + token, user: user});
                        } else res.status(401).send({success: false, msg: "Authentication failed. Wrong password."});
                      });
                    }
                  });
            }
        });
    }
}

//make sure to export the router, so all routes will be accessible from app.ts
export default new UserRoute().router;