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
    public STREAM_LIMIT = 3;

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
                .then(function(watchLogs:[]){
                    watchLogs?.length < self.STREAM_LIMIT && res.json({success: true, message: "User can stream", data: watchLogs});
                    watchLogs?.length >= self.STREAM_LIMIT && res.json({success: false, message: "User already has 3 concurrent streams", data: watchLogs});
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
        this.router.post("/", (req:any, res:any) => {
            if (!req.body.profile || !req.body.user) {
                res.json({success: false, msg: "Please pass profile and user Ids."});
            } else {
                let newWatchLog = new this.WatchLogModel({
                    ...req.body,
                    timestamp: moment()
                });

                newWatchLog.save(function(err: any, watchLog: any) {
                    if (err) {
                        return res.json({success: false, msg: "Error creating watchLog", error: err});
                    } else {
                        return res.json({success: true, msg: "Successful created new watchLog.", _id: watchLog._id});
                    }
                    
                });
            }
        });
    }
}

export default new WatchLogRoute().router;