import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname,join } from 'path'
import { cwd } from "process";

export const publicImgFolderPath = join(cwd(), "public/img/")
const {readJSON, writeJSON, writeFile}=fs
export const mediaJSONPath=join(dirname(fileURLToPath(import.meta.url)),"../data/media.json")

export const getMedias=()=>readJSON(mediaJSONPath)
export const writeMedia=(content)=>writeJSON(mediaJSONPath,content)
export const savePicture=(filename, content)=>writeFile(join(publicImgFolderPath, filename), content)