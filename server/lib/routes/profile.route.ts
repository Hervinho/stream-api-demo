import { Router } from "express";
import * as Profile from "../models/profile.model";
import { winstonLogger } from "../config/winston.config";

class ProfileRoute {

    constructor(){
        this.router = Router();
        this.routes();
        this.ProfileModel = Profile.default.ProfileSchema;
    };

    public router:any;
    public ProfileModel:any;

    public routes() {
        //get all profiles.
        this.router.get("/", (req:any, res:any) => {
            let self = this;

            self.ProfileModel.find()
                .populate('user')
                .then(function(profiles:any){
                    res.json({success: true, data: profiles});
                }).catch(function (exc:any) {
                    winstonLogger.error(exc);
                    res.json({success: false, data: null, error: exc});
                });

        });

        //get all user profiles.
        this.router.get("/users/:id", (req:any, res:any) => {
            let self = this;

            self.ProfileModel.findOne({ user:req.params.id })
                .populate('user')
                .then(function(profile:any){
                    res.json({success: true, data: profile});
                }).catch(function (exc:any) {
                    winstonLogger.error(exc);
                    res.json({success: false, data: null, error: exc});
                });

        });

        //get one profile.
        this.router.get("/:id", (req:any, res:any) => {
            let self = this;
            
            self.ProfileModel.findOne({ _id:req.params.id })
                .populate('user')
                .then(function(profile:any){
                    res.json({success: true, data: profile});
                }).catch(function (exc:any) {
                    winstonLogger.error(exc);
                    res.json({success: false, data: null, error: exc});
                });
        });

        //create a profile.
        this.router.post("/", (req:any, res:any) => {
            if (!req.body.name || !req.body.user) {
                res.json({success: false, msg: "Please pass name and user Id."});
            } else {
                // let newProfile = new this.ProfileModel({
                //     password: req.body.password,
                //     email: req.body.email,
	            //     fullname: req.body.fullname
                // });
                let newProfile = new this.ProfileModel({
                    ...req.body
                });

                newProfile.save(function(err: any, profile: any) {
                    if (err) {
                        winstonLogger.error(err);
                        return res.json({success: false, msg: "Error creating profile", error: err});
                    } else {
                        return res.json({success: true, msg: "Successful created new profile.", _id: profile._id});
                    }
                    
                });
            }
        });
    }
}

export default new ProfileRoute().router;