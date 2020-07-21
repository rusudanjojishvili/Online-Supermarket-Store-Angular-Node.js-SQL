const router = require('express').Router()
const mysql = require('mysql')
const {onlyUsers, onlyAdmins} = require('./mw')
const cors = require('cors')
const moment = require('moment');

router.use(cors())

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

router.get('/OrdersQTotal',async(req,res)=>{
    try{
       let q = await Query(`SELECT COUNT(id) AS numberOfOrders FROM orders`)
       res.json(q[0])
    }catch(err){
        res.send(500)
        throw err
    }
})
router.get('/lastOrderDate/:id',onlyUsers,async(req,res)=>{
    try{
        let cart_id=req.params.id
        let q =await Query(`SELECT DATE_FORMAT(MAX(order_date), "%d-%m-%Y %H:%i") as lastOrder from orders where cart_id=?`,cart_id)
        res.json(q[0])
     }catch(err){
         res.send(500)
         throw err
     }
})
router.get('/ordersQperCart/:id',onlyUsers,async(req,res)=>{
    try{
        let cart_id = req.params.id
       let q4 = `SELECT COUNT(id) AS ordersQPerCart FROM orders
           where cart_id = ?`
           result2 = await Query(q4,cart_id)
           let findNInOrders = result2.map(n=>{
             return n.ordersQPerCart
           })
           let ordersQPerCart = findNInOrders[0]
           res.json(ordersQPerCart)
      }catch(err){
       res.send(500)
       throw err
      }
})

router.get('/showUserAddress/:id',onlyUsers,async(req,res)=>{
    try{
        let cart_id = req.params.id
        let result = await Query(`SELECT * FROM onlinemarket.carts where id =?`,cart_id)
        let result2 = result.map(u =>{
            return u.user_id
        })
        let user_id = result2.toString()
        let q = await Query(`SELECT city,street from users where idnumber = ?`,user_id)
        res.json(q[0])
    }catch(err){
        res.send(500)
        throw err
    }
})
router.get('/showBusyDates',onlyUsers,async(req,res)=>{
    try{ // DATE_FORMAT(delivery_date, "%d/%m/%Y") as delivery_date
       let q = await Query(`SELECT
        delivery_date
       FROM orders
       GROUP BY delivery_date
       HAVING COUNT(id) > 3`)
       let busyDates = q.map(d=>{
           return d.delivery_date
       })
       res.json(busyDates)
    }catch(err){
        res.send(500)
        throw err
    }
})
router.get('/checkDate/:date',onlyUsers,async(req,res)=>{
    try{
        let delivery_date=moment(req.params.date).format('YYYY-MM-DD')
        let q = await Query(`select count(delivery_date) as ordersNByDay from orders where delivery_date=?`,delivery_date)
        res.json(q[0])
    }catch(err){
        res.send(500)
        throw err
    }
})


router.post('/makeOrder',async(req,res)=>{
    try{
        let {cart_id,total_price,delivery_city,delivery_street,delivery_date,credit_card} =req.body
        let result = await Query(`SELECT * FROM onlinemarket.carts where id =?`,cart_id)
        let result2 = result.map(u =>{
            return u.user_id
        })
        let user_id = result2.toString()
        // let newdate = delivery_date.split('T')[0]
        const shipping_date = moment(delivery_date).format('YYYY-MM-DD');
        const last4Digits=credit_card.slice(-4)
       let q = `INSERT into orders(user_id,cart_id,total_price,delivery_city,delivery_street,delivery_date,credit_card)
       value(?,?,?,?,?,?,?)`
       let newOrder = await Query(q,user_id,cart_id,total_price,delivery_city,delivery_street,shipping_date,last4Digits)
       let q2 = await Query(`delete from cartdetails where cart_id=?`,cart_id)
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
