import mongoose from "mongoose";
import { Schema } from "mongoose";

class WatchLog {
    public WatchLogSchema:any;

    constructor () {
        this.setup();
    }

    setup () {
        this.WatchLogSchema = new Schema({
            profile: {
                type: Schema.Types.ObjectId,
                ref: 'Profile',
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            timestamp : {
                type: Date,
                default: Date.now
            },
        });

        this.WatchLogSchema = mongoose.model("WatchLog", this.WatchLogSchema);
    }
}

export default new WatchLog();