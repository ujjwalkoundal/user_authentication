const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose')
const flash = require('connect-flash');
const session = require('express-session');
const passport1 = require('passport')
const path = require('path')

const app = express();

// passport config
require('./config/passport')(passport1);

// db config
const db = require('./config/keys');

// connect to mongo
mongoose.connect(db.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("mongodb connected"))
.catch(err => console.log(err))

app.use(express.static(path.join(__dirname, 'public')))

// EJS
app.use(expressLayouts);
app.set('views', './views');
app.set('view engine', 'ejs');

// bodyparser
app.use(express.urlencoded({extended: false}))

// express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// passport middleware
app.use(passport1.initialize());
app.use(passport1.session());

// conect flash
app.use(flash());

// global vars
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})  

// routes
const index = require('./routes/index');
const passport = require('passport');
app.use('/', index)
app.use('/users', require('./routes/users'))

const port = process.env.PORT || 8000;

app.listen(port, console.log("server started at port", port));