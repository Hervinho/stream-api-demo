import { Router } from "express";
import * as Video from "../models/video.model";
import { winstonLogger } from "../config/winston.config";

class VideoRoute {

    constructor(){
        this.router = Router();
        this.routes();
        this.VideoModel = Video.default.VideoSchema;
    };

    public router:any;
    public VideoModel:any;

    public routes() {
        //get all videos.
        this.router.get("/", (req:any, res:any) => {
            let self = this;

            self.VideoModel.find()
                .then(function(videos:any){
                    res.json({success: true, data: videos});
                }).catch(function (exc:any) {
                    winstonLogger.error(exc);
                    res.json({success: false, data: null, error: exc});
                });

        });

        //get one video.
        this.router.get("/:id", (req:any, res:any) => {
            let self = this;
            
            self.VideoModel.findOne({ _id:req.params.id })
                .then(function(video:any){
                    res.json({success: true, data: video});
                }).catch(function (exc:any) {
                    winstonLogger.error(exc);
                    res.json({success: false, data: null, error: exc});
                });
        });

        //create a video.
        this.router.post("/", (req:any, res:any) => {
            if (!req.body.title ) {
                res.json({success: false, msg: "Please pass title."});
            } else {
                let newVideo = new this.VideoModel({
                    ...req.body
                });

                newVideo.save(function(err: any, video: any) {
                    if (err) {
                        winstonLogger.error(err);
                        return res.json({success: false, msg: "Error creating video", error: err});
                    } else {
                        return res.json({success: true, msg: "Successful created new video.", _id: video._id});
                    }
                    
                });
            }
        });
    }
}

//make sure to export the router, so all routes will be accessible from app.ts
export default new VideoRoute().router;