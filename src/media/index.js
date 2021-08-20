import express from "express"
import { getMedias,writeMedia } from "../lib/utilities.js"
import createHttpError from 'http-errors'


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
mediaRouter.post("/",async (request,response,next)=>{
    try{
        const errorList=validationResult(request)
        console.log(errorList)
        if(!errorList.isEmpty()){
            next(createHttpError(400,{errorList}))
            
        }else{
            const authors= await getAuthors()
            const newAuthor = {... request.body, id:uniqid(), createdAt: new Date()}
            authors.push(newAuthor)
            await writeAuthor(authors)
            response.status(201).send({id:newAuthor.id})
        }
    
      }catch(error){
          next(error)
          console.log(error)
      }
})
mediaRouter.put("/:id", (request,response,next)=>{})
mediaRouter.delete("/:id", (request,response,next)=>{})

export default mediaRouter