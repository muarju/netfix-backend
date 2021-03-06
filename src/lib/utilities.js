import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname,join } from 'path'
import { cwd } from "process";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary} from 'cloudinary'


export const publicImgFolderPath = join(cwd(), "public/img/")
export const publicFolderPath = join(cwd(), "public/")
const {readJSON, writeJSON, writeFile}=fs
export const mediaJSONPath=join(dirname(fileURLToPath(import.meta.url)),"../data/media.json")
export const reviewsJSONPath=join(dirname(fileURLToPath(import.meta.url)),"../data/reviews.json")

export const getMedias=()=>readJSON(mediaJSONPath)
export const writeMedia=(content)=>writeJSON(mediaJSONPath,content)
export const getReviews=()=>readJSON(reviewsJSONPath)
export const writeReview=(content)=>writeJSON(reviewsJSONPath,content)
export const savePicture=(filename, content)=>writeFile(join(publicImgFolderPath, filename), content)

export const cloudinaryStorageMedia = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "Netflix-images",
    },
})
