import { Router } from "express";
import * as User from "../models/user.model";
import { winstonLogger } from "../config/winston.config";

class UserRoute {

    constructor(){
        this.router = Router();
        this.routes();
        this.UserModel = User.default.UserSchema;
    };

    public router:any;
    public UserModel:any;

    public routes() {
        //get all users.
        this.router.get("/", (req:any, res:any) => {
            let self = this;

            self.UserModel.find()
                .then(function(users:any){
                    res.json({success: true, data: users});
                }).catch(function (exc:any) {
                    winstonLogger.error(exc);
                    res.json({success: false, data: null, error: exc});
                });

        });

        //get one user.
        this.router.get("/:id", (req:any, res:any) => {
            let self = this;
            
            self.UserModel.findOne({ _id:req.params.id })
                .then(function(user:any){
                    res.json({success: true, data: user});
                }).catch(function (exc:any) {
                    winstonLogger.error(exc);
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
                    ...req.body
                });

                newUser.save(function(err: any, user: any) {
                    if (err) {
                        winstonLogger.error(err);
                        return res.json({success: false, msg: "Error creating user", error: err});
                    } else {
                        return res.json({success: true, msg: "Successful created new user.", _id: user._id});
                    }
                    
                });
            }
        });
    }
}

//make sure to export the router, so all routes will be accessible from app.ts
export default new UserRoute().router;