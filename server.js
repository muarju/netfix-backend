import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import mediaRouter from './src/media/index.js'
import {notFoundErrorHandler,forbiddenErrorHandler, badRequestErrorHandler,serverErrorHandler} from './errorHandler.js'
import {publicFolderPath} from './src/lib/utilities.js'

const server = express()
const port = process.env.PORT

// Set trustable origin
const listTrustableOrigins = [process.env.FE_DEV_TRUST_URL, process.env.FE_PROD_TRUST_URL]

const setCorsConfig = {
    origin: function(origin, callback){
        if(!origin || listTrustableOrigins.includes(origin)){
            callback(null, true)
        } else{
            callback(new Error('Origin not allowed'))
        }
    }
}

//Global Middleware
server.use(cors(setCorsConfig))
server.use(express.static(publicFolderPath))
server.use(express.json())

// *************** ROUTES *****************
server.use("/media", mediaRouter)

//error Middleware
server.use(notFoundErrorHandler)
server.use(badRequestErrorHandler)
server.use(forbiddenErrorHandler)
server.use(serverErrorHandler)

console.table(listEndpoints(server))
server.listen(port, ()=>{
    console.log("server is running on port:", port)
})