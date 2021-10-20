//Node modules
import express from 'express';
import * as bodyParser from "body-parser";
import passport from "passport";
import * as path from 'path';
import mongoose from "mongoose";

//API URLs
import { appRoutes } from "./config/routes.config";

//Winston
import { winstonLogger } from "./config/winston.config";
import { dbConfig } from './config/db.config';

class Server {

    public app: express.Application;
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    private config(): void {
        mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));

        //set Angular client app.
        //this.app.use(express.static(path.join(__dirname, '../../client-ui/dist' )));

        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); 
            next();
        });
        this.app.use(passport.initialize());
    };

    private routes(): void {
        this.app.use((err:any, req:any, res:any, next:any) => {
            if (err) {
                winstonLogger.error(err);
            }
        }); 

        for (let key = 0; key < appRoutes.length; key++ ) {
            //console.log(appRoutes[key]);
            this.app.use(appRoutes[key].url, appRoutes[key].route);
        }
        
    }
}

export default new Server().app;