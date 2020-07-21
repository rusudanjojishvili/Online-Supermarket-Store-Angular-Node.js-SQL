const express = require("express")
const authRoutes = require('./authRoutes')
const shopRoutes = require('./shopRoutes')
const orderRoutes = require('./orderRoutes')
var formidable = require('formidable');
const adminRoutes = require('./adminRoutes')
const app = express()
const cors = require('cors')
const {onlyUsers,onlyAdmins} = require('./mw')
const path = require('path');
var fs = require('fs');

app.use(express.json())

app.use(cors())


app.use('/public/uploads/', express.static('public/uploads'))
app.use("/users", authRoutes)
app.use("/shop",shopRoutes)
app.use("/order",orderRoutes)
app.use("/admin",adminRoutes)  



app.post('/upload',onlyAdmins, async(req, res)=>{
   
       var form = new formidable.IncomingForm();
     console.log('new req',req)
    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/public/uploads/' + file.name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
        res.send("file successfully uploaded")
    });
    form.on('error',function(error){
        res.send(500)
    })

    // res.sendFile(__dirname + '/index.html');
    
     
});

// app.post('/download',(req, res) => {
//     console.log('req.body',req.body)
// let q = req.body[0].name
// // let file = q.toString()
// console.log(q)

// // let file = 'newFile.txt'
// //we could add order number in case we have to save all the receipts here  - in public folder
// fs.writeFile(__dirname + '/public/downloads/'+'newFile.txt', q,function (err) {
//     if (err) throw err;
//     console.log('Saved!');
//   });
// var fileLocation = path.join(__dirname, "/public/downloads/",'newFile.txt');
// // var fileLocation = __dirname +'/public/downloads'+'/'+file
// console.log('fileLocation',fileLocation)
// res.contentType('text/plain');
// // res.send(fileLocation); 
// res.send(q);
// }); 
app.post('/download',onlyUsers,(req,res)=>{
    let q = req.body
var i = 0;
var len = q.length;
var text = "";
var totalPrice =0
for (; i < len; ) {
  text +='* ' + q[i].name +", " +q[i].quantity+ "pcs " + " - " + q[i].price + "₪"+ "\n";
  totalPrice+=q[i].price
  i++;
}

text+='Total' +': '+totalPrice+"₪"
    fs.writeFile(__dirname + '/public/downloads/'+'newFile.txt', text,function (err) {
            if (err) throw err;
            console.log('Saved!');
          
    let filepath= path.join(__dirname, "/public/downloads/",'newFile.txt');
    console.log(filepath)
    res.contentType('text/plain');
    res.setHeader('Content-disposition', 'attachment; filename=newFile.txt');
    res.sendFile(filepath)
})
});




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
app.listen(1000,()=>console.log("rockin'1000"))