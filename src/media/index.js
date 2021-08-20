import express from "express"
import { getMedias,writeMedia } from "../lib/utilities.js"


const mediaRouter = express.Router() //authors router

mediaRouter.get("/", async(request,response,next)=>{
    try{
        const medias= await getMedias()
        response.status(200).send(medias)
      }catch(error){
        next(error)
      }

   
})
mediaRouter.get("/:id",async (request,response,next)=>{
    const medias= await getMedias()

})
mediaRouter.post("/", (request,response,next)=>{})
mediaRouter.put("/:id", (request,response,next)=>{})
mediaRouter.delete("/:id", (request,response,next)=>{})

export default mediaRouter