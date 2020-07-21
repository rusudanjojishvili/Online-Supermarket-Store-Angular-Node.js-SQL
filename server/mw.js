const jwt = require('jsonwebtoken')
const cors = require('cors')
const router = require('express').Router()

router.use(cors())


const onlyUsers = (req, res, next)=>{
    const token = req.header("token")
    // console.log(req.headers.token)
    if(token){
    jwt.verify(token, "BlAh", (err, decoded)=>{
        if(err){
            res.sendStatus(401)
        }else{
            if(!decoded.isAdmin){
                //admin can only make admin operations
                req.user = decoded
                next()
                }else{
                    res.sendStatus(401)
                }
        }
    })
    }else{
        res.sendStatus(401)
    }
    }
    
    const onlyAdmins = (req, res, next)=>{
        const token = req.header("token")
        if(token){
        jwt.verify(token, "BlAh", (err, decoded)=>{
            if(err){
                res.sendStatus(401)
            }else{
                
                if(decoded.isAdmin){
                req.user = decoded
                next()
                }else{
                    res.sendStatus(401)
                }
            }
        })
        }else{
            res.sendStatus(401)
        }
        }
        
        module.exports= {onlyUsers,onlyAdmins}
