
import * as path from 'path';
import * as fs from 'fs';
import {NextFunction, Request, Response} from "express";
import {Error, ErrorCodes} from "../../common/entities/Error";
import {GalleryManager} from "../model/memory/GalleryManager";
import {Directory} from "../../common/entities/Directory";
import {Config} from "../config/Config";
import {ObjectManagerRepository} from "../model/ObjectManagerRepository";

export class GalleryMWs {


    private static getImageFolder(){
        return path.join(__dirname,"/../../",Config.imagesFolder);
    }

    public static listDirectory(req:Request, res:Response, next:NextFunction){
        let directoryName = req.params.directory || "/";
        let absoluteDirectoryName = path.join(GalleryMWs.getImageFolder(), directoryName);
        
        if(!fs.statSync(absoluteDirectoryName).isDirectory()){
            return next();
        }

        ObjectManagerRepository.getInstance().getGalleryManager().listDirectory(directoryName,(err,directory:Directory) => {
           if(err || !directory){
               return next(new Error(ErrorCodes.GENERAL_ERROR,err));
           }
            req.resultPipe = directory;
            return next();
        });
    }


    public static loadImage(req:Request, res:Response, next:NextFunction){
        if(!(req.params.imagePath)){
            return next();
        }

        let fullImagePath =  path.join(GalleryMWs.getImageFolder(), req.params.imagePath);
        if(fs.statSync(fullImagePath).isDirectory()){
            return next();
        }
        
        req.resultPipe = fullImagePath;
        return next();
    }

    
  

    public static search(req:Request, res:Response, next:NextFunction){
        //TODO: implement
        return next(new Error(ErrorCodes.GENERAL_ERROR));
    }

    public static autocomplete(req:Request, res:Response, next:NextFunction){
        //TODO: implement
        return next(new Error(ErrorCodes.GENERAL_ERROR));
    }



}