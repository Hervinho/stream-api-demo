import mongoose from "mongoose"; // fix for `mongoose.model is not a function`
import { Schema } from "mongoose";

class Profile {
    public ProfileSchema:any;

    constructor () {
        this.setup();
    }

    setup () {
        this.ProfileSchema = new Schema({
            name: {
                type: String,
                unique: true,
                required: true,
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        });

        this.ProfileSchema = mongoose.model("Profile", this.ProfileSchema);
    }
}

export default new Profile();