import { Router } from "express";
import moment from "moment";
import * as WatchLog from "../models/watchLog.model";

class WatchLogRoute {

    constructor(){
        this.router = Router();
        this.routes();
        this.WatchLogModel = WatchLog.default.WatchLogSchema;
    };

    public router:any;
    public WatchLogModel:any;
    public DATE_FORMAT = 'DD-MM-YYYY HH:mm:ss';
    public USER_STREAM_LIMIT = 3;

    public routes() {
        //get all watch logs.
        this.router.get("/", (req:any, res:any) => {
            let self = this;

            self.WatchLogModel.find()
                .populate('user')
                .populate('profile')
                .populate('video')
                .then(function(watchLogs:any){
                    res.json({success: true, data: watchLogs});
                }).catch(function (exc:any) {
                    res.json({success: false, data: null, error: exc});
                });

        });

        //get all user watchLogs.
        this.router.get("/users/:id", (req:any, res:any) => {
            let self = this;

            self.WatchLogModel.findOne({ user:req.params.id })
                .populate('user')
                .populate('profile')
                .populate('video')
                .then(function(watchLog:any){
                    res.json({success: true, data: watchLog});
                }).catch(function (exc:any) {
                    res.json({success: false, data: null, error: exc});
                });

        });

        //get the latest user watchLog and decide whether user can stream new video or not.
        // is this user (account) watching anything now (in the last 10 seconds) ?
        this.router.get("/latest/users/:id", (req:any, res:any) => {
            let self = this;
            console.log(moment(), moment().subtract(10, 'seconds'));

            self.WatchLogModel
                .find({ 
                    user:req.params.id,
                    timestamp: {
                        $lte: moment(),
                        $gte: moment().subtract(10, 'seconds')
                    }
                })
                .populate('video')
                .populate('profile')
                .then(function(watchLogs:[]){
                    watchLogs?.length < self.USER_STREAM_LIMIT && res.json({success: true, message: "User can stream", data: watchLogs});
                    watchLogs?.length >= self.USER_STREAM_LIMIT && res.json({success: false, message: "User already has 3 concurrent streams", data: watchLogs});
                }).catch(function (exc:any) {
                    res.json({success: false, data: null, error: exc});
                });

        });

        //get one watchLog.
        this.router.get("/:id", (req:any, res:any) => {
            let self = this;
            
            self.WatchLogModel.findOne({ _id:req.params.id })
                .populate('user')
                .populate('profile')
                .populate('video')
                .then(function(watchLog:any){
                    res.json({success: true, data: watchLog});
                }).catch(function (exc:any) {
                    res.json({success: false, data: null, error: exc});
                });
        });

        //create a watchLog.
        //this would get called when user starts watching, and at specific intervals during the video, e.g every 10s
        this.router.post("/", (req:any, res:any) => {
            if (!req.body.profile || !req.body.user || !req.body.video) {
                res.json({success: false, msg: "Please pass video, profile and user Ids."});
            } else {
                let self = this;
                const { profile, user, video } = req.body;

                self.WatchLogModel
                    .findOneAndUpdate(
                        { profile, user, video }, 
                        { timestamp: moment() }, 
                        { new: true, upsert: true }
                    )
                    .then(function(watchLog:any){
                        res.json({success: true, msg: "Successful created new watchLog.", data: watchLog});
                    }).catch(function (exc:any) {
                        res.json({success: false, data: null, error: exc});
                    });
            }
        });
    }
}

export default new WatchLogRoute().router;