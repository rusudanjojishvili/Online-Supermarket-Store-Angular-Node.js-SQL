const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mysql = require('mysql')
const cors = require('cors')


router.use(cors())

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'ONLINEMARKET'
});

db.connect((err)=>{
  if(err){
      throw err
  
  }
  console.log("connected to my sql")
})


router.get('/ids/:id',async(req,res)=>{
  try{
    let id = req.params.id
    let ids = await Query(`SELECT idnumber from USERS where idnumber=?`,id)
    let numbersArr = ids.map(id=>{
      return id.idnumber
   });
   console.log(numbersArr)
    res.json(numbersArr)
  }catch(err){
   res.send(500)
   throw err
  }
}) 
router.get('/emails/:email',async(req,res)=>{
  try{
    let email = req.params.email
    let emails = await Query(`SELECT email from USERS where email=?`,email)
    res.json(emails)
  }catch(err){
   res.send(500)
   throw err
  }
}) 

router.post('/register', async (req,res)=>{
    const {fname,lname,email,idnumber,password,city,street} = req.body
    if(fname,lname,email,idnumber,password,city,street){
      const q1=`SELECT * FROM users where idnumber='${idnumber}'`
      const q2=`SELECT * FROM users where  email='${email}'`
      const usersbyid=await Query(q1)
console.log('usersbyid',usersbyid)
      const usersbyemail= await Query(q2);
        console.log('usersbyemail',usersbyemail)
      if(usersbyid.length){
        res.status(400).send("user with this id already exists")
    }else if(usersbyemail.length){
        res.status(400).send("email already exists")
      }else{
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
            console.log(hash)
            const q = `INSERT INTO users
            (fname,lname,email,idnumber,password,city,street)
            VALUES ("${req.body.fname}","${req.body.lname}","${req.body.email}",
            ${req.body.idnumber},"${hash}","${req.body.city}","${req.body.street}")
            ` 
           const results = await Query(q)
           
           let results2 = `INSERT INTO carts(user_id)values(?)`
           let newcart =  await Query(results2,idnumber)
           console.log('newcart',newcart)
           
           const q2= `SELECT * FROM users` 
           const users = await Query(q2)
           const user = users.find(u=>u.email===email)
           if(user){
            if(bcrypt.compareSync(password,user.password )){
            jwt.sign({email, isAdmin: user.isAdmin}, "BlAh",async(err, token)=>{
              if (err){
          
                res.sendStatus(500)
                throw err1
              }
              let id = user.idnumber
              let isAdmin = user.isAdmin
              let userFname = user.fname
              //alternative option - needs to be checked
                let cartsFromDB = `SELECT id FROM carts where user_id = ?`
                let q1 = await Query(cartsFromDB,id)
                let q2 = q1.map(cart=>{
                    return cart.id
                })
                let cart_id = q2.toString()
                console.log(cart_id)
                 let q4 = `SELECT COUNT(id) AS ordersQPerCart FROM orders
           where cart_id = ?`
           result2 = await Query(q4,cart_id)
           let findNInOrders = result2.map(n=>{
             return n.ordersQPerCart
           })
           let ordersQPerCart = findNInOrders[0]
                
                res.json({token,isAdmin,cart_id,userFname,ordersQPerCart})
              console.log(token)
              
            
        })
        }else{
            res.status(400).send("wrong password")
        }
                }else{
                    res.status(400).send("user not found")
                  
                }
      }
       
        }else {
            res.status(400).send("missing some info")
        }
    
      })
  
      router.post('/login', async(req,res)=>{
        const {email,password} = req.body
        if(email && password){
          const q= `SELECT * FROM users` 
          const users = await Query(q)
            const user = users.find(u=>u.email===email)
            if(user){
        if(bcrypt.compareSync(password,user.password )){
        jwt.sign({email, isAdmin: user.isAdmin}, "BlAh",async(err, token)=>{
          if (err){
      
            res.sendStatus(500)
            throw err1
          }
          let id = user.idnumber
          let isAdmin = user.isAdmin
          let userFname = user.fname
        //alternative option - needs to be checked
          let cartsFromDB = `SELECT id FROM carts where user_id = ?`
          let q1 = await Query(cartsFromDB,id)
          let q2 = q1.map(cart=>{
              return cart.id
          })
          let cart_id = q2.toString()
          console.log('cart_id',cart_id)
    
           let q4 = `SELECT COUNT(id) AS ordersQPerCart FROM orders
           where cart_id = ?`
           result2 = await Query(q4,cart_id)
           let findNInOrders = result2.map(n=>{
             return n.ordersQPerCart
           })
           let ordersQPerCart = findNInOrders[0]
          res.json({token,isAdmin,cart_id,userFname,ordersQPerCart})     
    })
    }else{
        res.status(400).send("wrong password")
    }
            }else{
                res.status(400).send("user not found")
            }
        }else {
            res.status(400).send("missing some info")
        }
      })
    
    
  
  module.exports = router
  
  function Query(q,...par){
    return new Promise((resolve,reject)=>{
     db.query(q,par,(err,results)=>{
         if(err){
             reject(err)
         }else{
             resolve(results)
         }
     })
    })
  }
  
