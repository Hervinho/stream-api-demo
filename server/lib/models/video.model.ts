//import * as mongoose from "mongoose";
import mongoose from "mongoose";
import { Schema } from "mongoose";

class Video {
    public VideoSchema:any;

    constructor () {
        this.setup();
    }

    private setup(): void {
        this.VideoSchema = new Schema({
            title: {
                type: String,
                required: true
            },
            addedAt : {
                type: Date,
                default: Date.now
            },
        });

        this.VideoSchema = mongoose.model("Video", this.VideoSchema);
    }
    
}


export default new Video();