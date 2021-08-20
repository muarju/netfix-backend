import express from "express"
import { getMedias,writeMedia,getReviews,writeReview,savePicture,mediaJSONPath } from "../lib/utilities.js"
import createHttpError from 'http-errors'
import { validationResult } from "express-validator";
import {mediaValidations} from './validation.js'
import uniqid from 'uniqid'
import {extname} from 'path'
import multer from 'multer'
import fs from 'fs'


const mediaRouter = express.Router() //authors router

mediaRouter.get("/", async(request,response,next)=>{
    try{
        const medias= await getMedias()
        response.status(200).send(medias)
      }catch(error){
        next(error)
      }

   
})
mediaRouter.get("/:imdbID",async (request,response,next)=>{
    try{
        const medias= await getMedias()
        const media=medias.find(m=>m.imdbID===request.params.imdbID)
        if(!media){
            next(createHttpError(404), { message: `Media requested with ${request.params.imdbID} is not found` })
        }else{
            response.status(200).send(media)
        }
        
      }catch(error){
        next(error)
      }

})
mediaRouter.post("/",mediaValidations, async (request,response,next)=>{
    try{
        const errorList= validationResult(request)
        console.log(errorList)
        if(!errorList.isEmpty()){
            next(createHttpError(400,{errorList}))
            
        }else{
            const medias= await getMedias()
            const newMedia = {... request.body, imdbID:uniqid(), createdAt: new Date()}
            medias.push(newMedia)
            await writeMedia(medias)
            response.status(201).send({imdbID:newMedia.imdbID})
        }
    
      }catch(error){
          next(error)
          console.log(error)
      }
})
mediaRouter.put("/:id",mediaValidations, async(request,response,next)=>{
    try{
        const errorList=validationResult(request)
            
        if(!errorList.isEmpty()){
            next(createHttpError(400,{errorList}))
            
        }else{
            const medias=await getMedias()
            const media=medias.find(m=>m.imdbID===request.params.id)
            if(!media){
                next(createHttpError(404), { message: `Media requested with ${request.params.imdbID} is not found` })
            }else{
                const remainingMedias=medias.filter(m =>m.imdbID !== request.params.id)
                const currentMedia={... request.body, imdbID:request.params.id}
                remainingMedias.push(currentMedia)
                await writeMedia(remainingMedias)
                response.status(202).send(currentMedia)
            }
           
        }
        
      }catch(error){
          next(error)
      }
})

mediaRouter.put("/:id/poster",multer().single("Poster"), async(request,response,next)=>{
    try{
        const { originalname, buffer } = request.file;
        const extension = extname(originalname);
        const fileName = `${request.params.id}${extension}`;
        await savePicture(fileName,buffer)
        const link = `http://localhost:3001/img/${fileName}`;
        request.file = link;

        const fileAsBuffer = fs.readFileSync(mediaJSONPath);
        const fileAsString = fileAsBuffer.toString();
        let fileAsJSONArray = JSON.parse(fileAsString);
        const mediaIndex = fileAsJSONArray.findIndex(
          (m) => m.imdbID === request.params.id
        );
        if (!mediaIndex == -1) {
          response.status(404).send({ message: `Media with ${request.params.id} is not found!` });
        }
        const previousMediaData = fileAsJSONArray[mediaIndex];
        const changedMedia = {... previousMediaData,Poster: request.file,updatedAt: new Date(),imdbID: request.params.id};
        fileAsJSONArray[mediaIndex] = changedMedia;
        fs.writeFileSync(mediaJSONPath, JSON.stringify(fileAsJSONArray));
        response.send(changedMedia);

  }catch(error){
      next(error)
  }
})
mediaRouter.delete("/:id",async (request,response,next)=>{
    try{
        const medias=await getMedias()
        const media=medias.find(m=>m.imdbID===request.params.id)
        if(!media){
            next(createHttpError(404), { message: `Media requested with ${request.params.imdbID} is not found` })
        }else{
        const remainingMedias=medias.filter(m => m.imdbID !== request.params.id)
        await writeMedia(remainingMedias)
        response.status(204).send("Deleted Successfully!")
        }
       
      }catch(error){
          next(error)
      }
})

//reviews related methods
// GET ALL Reviews for specific Media
mediaRouter.get("/:elementId/reviews", async(request,response,next)=>{
    try {
        const reviews = await getReviews()
        const filteredReviews = reviews.filter(r => r.elementId === request.params.elementId)
        response.status(200).send(filteredReviews)

    } catch (error) {
        next(error)
    }
})

mediaRouter.post("/:elementId/reviews", async(request,response,next)=>{
    try {
        const reviews = await getReviews()
        const newReview = {...request.body,createdAt: new Date(),id: uniqid(),elementId: request.params.elementId}
        reviews.push(newReview)
        await writeReview(reviews)
        response.status(200).send(newReview)
    } catch (error) {
        next(error)
    }
})

export default mediaRouter