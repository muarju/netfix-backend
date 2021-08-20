import express from "express"
import { getMedias,writeMedia } from "../lib/utilities.js"
import createHttpError from 'http-errors'
import { validationResult } from "express-validator";
import {mediaValidations} from './validation.js'
import uniqid from 'uniqid'


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

export default mediaRouter