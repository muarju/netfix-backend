export const notFoundErrorHandler=(err,req,res,next)=>{
    if(err.status===404){
        res.status(404).send({
            success: false,
            mesg: err.message
        })
    }else{
        next(err)
    }
}//404

export const badRequestErrorHandler=(err,req,res,next)=>{
    if(err.status===400){
        res.status(400).send({
            success: false,
            mesg: err.errorList
        })
    }else{
        next(err)
    }
}//400

export const forbiddenErrorHandler=(err,req,res,next)=>{
    if(err.status===403){
        res.status(403).send({
            success: false,
            mesg: err.errorList
        })
    }else{
        next(err)
    }
}//403

export const serverErrorHandler=(err,req,res,next)=>{
    res.status(500).send("Opps, This server error")
}//500

