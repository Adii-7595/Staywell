const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const path = require('path'); // Add this line


const users = require('./routes/user')
const posts = require('./routes/post')

const session = require('express-session')
const flash = require('connect-flash')


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));


// app.use(cookieParser("secretCode"))

// app.use("/users", users)
// app.use("/posts", posts)



// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","Hello!")
//     res.cookie("made-in","India!")
//     res.send("send some cookies")
// })

// app.get("/getsignedcookies",(req,res)=>{
//     res.cookie('made-in',"India!", {signed:true})
//     res.send('signed cokkie sent')
// })

// app.get('/verify',(req,res)=>{
//     console.log(req.signedCookies
//         )
//     res.send("verified")
// })
// // Root route
// app.get('/', (req, res) => {
//     res.send('Hi, I am root');
//     console.dir(req.cookies)
// });

// app.get("/greet",(req,res)=>{
//     let {name="anonymous"} = req.cookies
//     res.send(`hii, ${name}`)
// })
// app.get("/test",(req,res)=>{
//     res.send("test successful")

// })

// count session cookies

// app.get("/reqcount", (req, res) => {


//     if (req.session.count) {
//         req.session.count++

//     }else{
//         req.session.count = 1
//     }
//     res.send(`you sent a request ${req.session.count} time`)

// })



const sessionOptions = {
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true
}


//flash message 

app.use(session(sessionOptions))
app.use(flash())

app.use((req, res, next) => {
    res.locals.errorMsg = req.flash('error'),
    res.locals.successMsg = req.flash('success'),
    
    next();
});
app.get("/register",(req,res)=>{
    let {name='Anonymous'} = req.query
    req.session.name = name

    if(name=="Anonymous"){
        req.flash('error', 'user not registered')

    }
    else{
        req.flash('success', 'user registered successfully')

    }
    res.redirect('/hello')

})

app.get('/hello', (req,res)=>{

   
    res.render('page.ejs', {name: req.session.name})    

})







const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});