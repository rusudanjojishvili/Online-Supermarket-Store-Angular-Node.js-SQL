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

router.get('/categories',async(req,res)=>{
    try{
        let categories = await Query(`SELECT * from categories`)
        res.json(categories)
      }catch(err){
       res.send(500)
       throw err
      }
})
router.get('/productsQ',async(req,res)=>{
    try{
        let numberOfProducts = await Query(`SELECT COUNT(id) AS NumberOfProducts FROM Products`)
        res.json(numberOfProducts[0])
    }catch(err){
        res.send(500)
        throw err
    }
})
router.get('/products/:id',async(req,res)=>{
    try{
      let id = req.params.id
      //c_id - category id
      let products = await Query(`SELECT * from PRODUCTS where c_id=?`,id)
      res.json(products)
    }catch(err){
     res.send(500)
     throw err
    }
  }) 

router.get('/cartOpeningDate/:id',onlyUsers,async(req,res)=>{
    try{
        let cart_id = req.params.id
        // let openingDate= await Query(`select DATE_FORMAT(min(addition_date), "%d-%m-%Y %H:%i") as cartOpening_date from cartdetails where cart_id=?`,cart_id)
        let openingDate = await Query(`SELECT  DATE_FORMAT(carts.creation_date, "%d/%m/%Y %H:%i") as cartOpening_date from carts inner join
        users ON carts.user_id = users.idnumber
       where carts.id=?`,cart_id)
        res.json(openingDate[0])
      }catch(err){
       res.send(500)
       throw err
      }
})

router.get('/totalPrice/:id',onlyUsers,async(req,res)=>{
    try{
        let cart_id = req.params.id
        let q3 = `SELECT 
        sum(products.price * quantity ) as totalPrice
        from cartdetails inner join
        products ON cartdetails.product_id = products.id
        group by cart_id
        having cart_id = ?`
        let totalPrice = await Query(q3,cart_id)
        res.json(totalPrice[0])
          }catch(err){
           res.send(500)
           throw err
          }
})

router.post('/products/search',async(req,res)=>{
    try{
      let name = req.body.name
      let searchResults = await Query(`SELECT * FROM products where name like '%${name}%'`)
      res.json(searchResults)
    }catch(err){
     res.send(500) 
     throw err
    }
  }) 

router.get('/prodQperCart/:id',onlyUsers,async(req,res)=>{
    try{
    let cart_id = req.params.id
    //quantity of different sort of products
    let q3 = `SELECT COUNT(Product_id) AS productQPerCart FROM cartdetails
    where cart_id = ?`
    //alternative version - sum of all profucts(quantity) in the cart
    //`SELECT sum(quantity) AS productQPerCart FROM cartdetails where cart_id = ?`
    let result = await Query(q3,cart_id)
    let prodNpercart = result.map(n=>{
    return n.productQPerCart
        })
    res.json(prodNpercart[0])
      }catch(err){
       res.send(500)
       throw err
      }
    })
   
router.get('/productsByCart/:id',onlyUsers,async(req,res)=>{
    try{
    let cart_id = req.params.id
    let resultToShow = `SELECT products.id as p_id,
    products.name,
    products.price as price,
    products.price * quantity as priceByQuantity,
    products.img_url,
    cartdetails.id,
    cartdetails.quantity from cartdetails inner join
    products ON cartdetails.product_id = products.id
    where cart_id = ?`
    let showInCart = await Query(resultToShow,cart_id) 
    res.json(showInCart)
    }catch(err){
        res.send(500)
        throw err
    }
})
router.post('/addToCart/:id',async(req,res)=>{
    try{
    let {product_id,quantity}=req.body
    let cart_id = req.params.id 
    let p = `SELECT * FROM cartdetails WHERE product_id=? and cart_id=?`
    let productsFromDb = await Query(p,product_id,cart_id)
    let checkIfcartIsEmpty = await Query(`select * from cartdetails where cart_id=?`,cart_id)
    if(!productsFromDb.length){
        if(!checkIfcartIsEmpty.length){
        let q = `INSERT INTO cartdetails(product_id,cart_id)values(?,?)`
        let newcartdetails = await Query(q,product_id,cart_id) 
        let openCart = await Query(`update carts set creation_date=now() where id=?`,cart_id)
        }else{
        let q = `INSERT INTO cartdetails(product_id,cart_id)values(?,?)`
        let newcartdetails = await Query(q,product_id,cart_id)   
        }
    }
    let result = `UPDATE cartdetails SET quantity = quantity + ? WHERE product_id = ? and cart_id=?`
    let addQ = await Query(result,quantity,product_id,cart_id,)
    res.sendStatus(201)
    }catch(err){
        res.send(500)
        throw err
    } 
})
router.put('/increaseQ/:id/:proId',onlyUsers,async(req,res)=>{
    try{
        let cart_id=req.params.id
        let product_id=req.params.proId
        let result = `UPDATE cartdetails SET quantity = quantity + 1 WHERE product_id = ? and cart_id=?`
        let addQ = await Query(result,product_id,cart_id)
    res.sendStatus(201)
    }catch(err){
        res.send(500)
        throw err
    }
})
router.put('/decreaseQ/:id/:proId',onlyUsers,async(req,res)=>{
    try{
        let cart_id=req.params.id
        let product_id=req.params.proId
        let result = `UPDATE cartdetails SET quantity = quantity - 1 WHERE product_id = ? and cart_id=?`
        let addQ = await Query(result,product_id,cart_id)
        let checkQ = await Query(`SELECT quantity FROM onlinemarket.cartdetails where product_id=? and cart_id=?`,product_id,cart_id)
        if(checkQ[0].quantity==0){
            let deleteRow = await Query(`DELETE from cartdetails where product_id=? and cart_id=?`,product_id,cart_id)
        }
        res.sendStatus(201)
    }catch(err){
        res.send(500)
        throw err
    }
})
router.delete('/deleteFromCart/:id',onlyUsers,async(req,res)=>{
    try{
        let id = req.params.id
        let result = await Query(`delete from cartdetails where id=?`,id)
        res.send("deleted")
    }catch(err){
        res.send(500) 
        throw err
    }
})

router.delete('/deleteCart/:id',onlyUsers,async(req,res)=>{
    try{
        let cart_id = req.params.id
        let result = await Query(`delete from cartdetails where cart_id=?`,cart_id)
        res.send("deleted")
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
