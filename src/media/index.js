import express from "express"
import { getMedias,writeMedia } from "../lib/utilities.js"


const mediaRouter = express.Router() //authors router

mediaRouter.get("/", async(request,response)=>{
    const medias= await getMedias()
    response.status(200).send(medias)
})
mediaRouter.get("/:id", (request,response)=>{})
mediaRouter.post("/", (request,response)=>{})
mediaRouter.put("/:id", (request,response)=>{})
mediaRouter.delete("/:id", (request,response)=>{})

export default mediaRouter