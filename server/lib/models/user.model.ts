//import * as mongoose from "mongoose";
import mongoose from "mongoose";
import { Schema } from "mongoose";

class User {
    public UserSchema:any;

    constructor () {
        this.setup();
    }

    private setup(): void {
        this.UserSchema = new Schema({
            email: {
                type: String,
                unique: true,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            fullname: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            createdAt : {
                type: Date,
                default: Date.now
            },
            updatedAt : {
                type: Date,
                default: Date.now
            }
        });

        this.UserSchema = mongoose.model("User", this.UserSchema);
    }
    
}


export default new User();