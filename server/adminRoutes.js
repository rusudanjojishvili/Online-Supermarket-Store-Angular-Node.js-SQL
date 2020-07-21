const router = require('express').Router()
const mysql = require('mysql')
const {onlyAdmins} = require('./mw')
const cors = require('cors')
// const formidable = require('formidable');
// const express = require("express")

router.use(cors())

// router.use('/public/uploads/', express.static('public/uploads'))

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'ONLINEMARKET',
    timezone:'utc'
});

db.connect((err)=>{
    if(err){
        throw err 
    }
    console.log("connected to my sql")
})

router.post('/addProduct', onlyAdmins,async(req,res)=>{
    try{
        console.log(req.body)
        let {name,c_id,price,img_url} =req.body
        console.log(name,c_id,price,img_url)
        let q = `INSERT INTO PRODUCTS (name,c_id,price,img_url)
        values(?,?,?,?)`
        let results = await Query(q,name,c_id,price,img_url)
        res.sendStatus(201)
    }catch(err){
        res.send(500)
        throw err
    }
})

router.put('/updateProduct/:id',async(req,res)=>{
    try{
        let {name,c_id,price,img_url} =req.body
        let id=req.params.id
        let q = `UPDATE PRODUCTS SET name=?,c_id=?,price=?,img_url=? where id=?`
        let result=await Query(q,name,c_id,price,img_url,id)
        res.sendStatus(201)
    }catch(err){
        res.send(500)
        throw err
    }
  
})








module.exports = router

let Query = (q,...p) =>{
    return new Promise((resolve,reject)=>{
     db.query(q,p,(err,result)=>{
         if(err){
             reject(err)
         }else{
             resolve(result)
         }
     })
    })
 
}
