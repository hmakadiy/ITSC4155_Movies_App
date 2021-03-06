const express = require('express');
const morgan = require('morgan');
const mainRoutes = require('./routes/mainRoutes');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const userRoutes = require('./routes/userRoutes');

const app = express();

let port = 5050;
let host = 'localhost';
const url = 'mongodb+srv://admin1:password42@capstone.yjh0z.mongodb.net/demos?retryWrites=true&w=majority'
app.set('view engine', 'ejs');

//connect to database
mongoose.connect(url, 
                {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    app.listen(process.env.PORT || port, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err=>console.log(err.message));

//mount middleware
app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: url}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.name = req.session.name || 'Guest';
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use('/', mainRoutes);
app.use('/users', userRoutes);

app.use((req, res, next)=>{
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err});
});

/*app.listen(port, host, () => {
    console.log('Server is running on port ', port);
});*/
