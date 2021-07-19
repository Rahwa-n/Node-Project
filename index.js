if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
// adding an express server
const express = require('express');
const session = require('express-session');
//const csrf = require('csurf');
//const flash = require('express-flash');
const flash = require('connect-flash');
//const mongoDBSession = require('connect-mongodb-session')(session);
// MongoClient has a connect method that allows us to connect to MongoDB using Node.j
const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const port = process.env.PORT;
const app = express();
const bcrypt = require('bcrypt');
//path to display images from the public folder
const path = require("path");
const multer = require('multer');
require('dotenv').config();
//const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//const csrfMiddleware = csrf({ cookie: true });
//const csrfProtection = csrf();

const User = require('./models/user');
const passport = require('passport');
const initializePassport = require('./passport-config');
initializePassport(
  passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

//const serviceAccount = require("./serviceAccountKey.json");
var expressPug = require('express-handlebars');
var logger = require('morgan');
var { randomBytes } = require('crypto');
var Cart = require('./models/cart');
var Menu = require('./models/menu');
var assert = require('assert')
//const MongoStore = require('connect-mongo');
const users = [];
const methodOverride = require('method-override');
//const serviceAccount = require("./serviceAccountKey.json");
//const validator = require('express-validator');

//import the module
const mongoose = require("mongoose");
require('./config/passport');
const user = require('./models/user');
const nodemailer = require('nodemailer');
//const { assert } = require('joi');
//const { ResultWithContext } = require('express-validator/src/chain');

console.log(process.env.MONGODB_URI);
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
/**
 * set up MongoDB url to connect with
 * This method accepts the MongoDB server address (url) and a callback function
 */
//const mongoDB = "mongodb://localhost:27017"
var mongoDB = process.env.MONGODB_URI;

//console.log(mongoDB);
const urlEncodedParser = bodyParser.urlencoded({extended: false});
mongoClient.connect(mongoDB,function(err,client){
  console.log('connected with DB');
});

//connecting mongoose
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  });

  //console.log(mongoose);


// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

/**
 * setting the pug engine to load the page
 * to use the css, js, and img file from the public folder to make it dynamic
 * to get the home page and display itby calling the function requeste and response
 */
//app.engine('.pug', expressPug({defaultLayout: 'layout', extname: '.pug'}));
app.set('view engine', '.pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'mysecrete',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 180 * 60 * 1000 }
}));
//Express session Middleware
// app.use(session({
//   secret: 'My Secret',
//   saveUninitialized: false,
//   resave: false,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGODB_URI,
//     touchAfter: 24 * 3600,
//     cookie: { secure: true }
//   })
// }));
    // mongooseConnection: mongoose.connection}),

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(validator());
//app.use(csrfProtection);
//app.use(cookieParser());
//app.use(csrfMiddleware);
//app.use(csrfProtection);



app.use(function(req,res,next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

//app.engine("html",require('pug').renderFile);


/**
 * this is a local server listen in port number 3000
 * and it can be added other port number too for now heroku listens 5000
 */
app.listen(port,()=>{
  console.log(`Example app listening on port ${port}`)
});

//set the static public folder and configure express to use it such as css, js, img
app.use(express.static(path.join(__dirname,'public')));

//setting global errors
app.locals.errors = null;

//express flash messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
})

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

/**
 *this is the root page route the index page 
 */
app.get('/', (req,res) => {
    //connection to the database
  mongoClient.connect(mongoDB,function(err,client){
    //console.log(req.seesion);
    //console.log(client);
    const myDb = client.db('foods');
    const collection = myDb.collection('menus');
    collection.find({}).toArray((error, documents)=>{
      //console.log(documents);
      //this is to run the data after to close the database
      client.close();
      res.render('index', {documents:documents});
    });
  });
});

/**
 * adding a route for about and render it
 * to display the page
 */
app.get('/about/', function(req,res){
    res.render('about', {});
});

/**route for menu page
 *  and render the page and connect with the database
 */
app.get('/menu', function(req,res){
  mongoClient.connect(mongoDB, function(err,client){
    // var menus = Menu.find()
    const myDb = client.db('foods');
    const collection = myDb.collection('menus');
    collection.find().toArray(function(error,documents){
      client.close();
      res.render('menu', {menus:documents});
    });
  });
});


/** a route for menu page and and filter menus
 * and open in detail view the selected menu and render it
 * and alos connecting with the database
 */
app.get('/menu/:id', function(req,res){
  const selectedId = req.params.id;
  mongoClient.connect(mongoDB, function(err,client){
    const myDb = client.db('foods');
    const collection = myDb.collection('menus');
    const filter = {_id: ObjectID(selectedId)};
    collection.find(filter).toArray(function(error,documents){
      var selectedMenu = documents[0];
      client.close();
      var menus = Menu.find();
      res.render('menu', {menus:selectedMenu});
    })
  });
});

/**
 * edit menu calling the server and connect to the database 
 * and edit the menus then display in menu page
 */
app.get('/edit/:id', function(req,res){
  const selectedId = req.params.id;
  mongoClient.connect(mongoDB,function(err,client){
    const myDb = client.db('foods');
    const collection = myDb.collection('menus');
    const filter = {_id: ObjectID(selectedId)}; 
    collection.find(filter).toArray(function(error,documents){
      var selectedMenu = documents[0];
      client.close();
      res.render('edit',{menus:selectedMenu});
    });
  });
});

/**
 * Create route for adding new menu 
 * and then can go back to the admin page and menu page 
 * to see the effect of the create
 */
 app.get('/create', function(req,res){
  mongoClient.connect(mongoDB, function(err,client){
    const myDb = client.db('foods');
    const collection = myDb.collection('menus');
    collection.find().toArray(function(error,documents){
      client.close();
      res.render('create', {menus:documents});
    });
  });
});

/**
 * This is the route for update menu and 
 * redirect it to edit page also can see
 * the effect in admin dashbord 
 */
app.post('/edit', urlEncodedParser, function(req, res){
  const selectedId = req.body._id;
  const filter = {_id: ObjectID(selectedId)};
  const set = {$set: {image: req.body.menuImage, name: req.body.menuName, description: req.body.menuDescription, price: req.body.price}};
  mongoClient.connect(mongoDB,function(err,client){
    const myDb = client.db('foods');
    const collection = myDb.collection('menus');
    collection.updateOne(filter,set,(err,result)=>{
      client.close();
      res.redirect('/edit/' + selectedId);
    });
  });
});
/**
 * this is to create a new menu and after updating
 * adding it to the backend which is the database
 * also displaying in menu page
 */
app.post('/menu', urlEncodedParser, function(req,res){
  const newMenu = {
    image: req.body.menuImage,
    name: req.body.menuName,
    description: req.body.menuDescription,
    price: req.body.price
  }
  mongoClient.connect(mongoDB, function(err, client){
    const myDb = client.db('foods');
    const collection = myDb.collection('menus');
    collection.insertOne(newMenu, function(err,result){
      client.close();
      res.redirect('/admin');
    })
  })
}); 

/**
 * This is to update the existing menu in to the page
 * and redirect to the menu page and add to database
 */
app.post('/menu', urlEncodedParser, function(req, res){
  const selectedId = req.body._id;
  const filter = {_id: ObjectID(selectedId)};
  const set = {$set: {name: req.body.menuName, description: req.body.menuDescription}};
  mongoClient.connect(mongoDB,function(err,client){
    const myDb = client.db('foods');
    const collection = myDb.collection('menus');
    collection.updateOne(filter,set, function(err,result){
      client.close();
      res.redirect('/edit/' + selectedId);
    });
  });
}); 

/**
 * route for detail page menu to display details 
 * and insert and edit then update 
 */
 app.get('/detail/:id', function(req, res){
  const selectedId = req.params.id;
  mongoClient.connect(mongoDB,function(err,client){
    const myDb = client.db('foods');
    const collection = myDb.collection('menus');
    const filter = {_id: ObjectID(selectedId)};
    collection.find(filter).toArray(function(err,documents){
      var selectedMenu = documents[0];
      client.close();
      res.render('detail', {menus:selectedMenu});
    });
  });
});


/**
 * this is the route for deleting the menu
 * from the menu page and at the same time 
 * from database and page redirect to menu page
 */
app.get('/delete/:id',function(req,res){
  const selectedId = req.params.id; 
  mongoClient.connect(mongoDB,function(err,client){       
    const myDb = client.db('foods');
    const collection = myDb.collection('menus');    
    const filter = {_id: ObjectID(selectedId)};
    collection.deleteOne(filter, function(err,result){
      client.close();
      res.redirect('/menu');
    });    
  });
});
/**
 * add a route for services page and 
 * render it to diplay the content
 */
app.get('/services/', function(req,res){
    res.render('services', {});
});
app.get('/contact/', (req,res) =>{
  res.render('contact', {});
});

/**
 * a route for contact page and render it
 * to display the page
 */
app.get('/contact/', (req,res) =>{
  // Instantiate the SMTP server
  const smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS
    }
  })
  // Specify what the email will look like
  const mailOpts = {
    from: 'Your sender info here', // This is ignored by Gmail
    to: GMAIL_USER,
    subject: 'New message from contact form at tylerkrys.ca',
    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
  }
  // Attempt to send the email
  smtpTrans.sendMail(mailOpts, (error, response) => {
    if (error) {
      res.render('contact-failure') // Show a page indicating failure
    }
    else {
      res.render('contact-success') // Show a page indicating success
    }
  })
});

/**
 * adding a route for register page and 
 * render it to diplay the content of the page
 */
app.get('/register/', (req, res, next) => {
  var messages = req.flash('error');
   res.render('register', {messages: messages, hasErrors: messages.lenght > 0});
 });

app.post('/register', async(req, res, next) =>{
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      id: Date.now().toString()
    })
    res.redirect('/login');
  } catch {
    res.redirect('/register')
  }
  console.log(users);
});

// app.post('/register/', async(req, res, next) => {
//   const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     var item = {
//       id: Date.now().toString(),
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedPassword
//     } 
//     mongoClient.connect(mongoDB, { useUnifiedTopology: true, useUnifiedTopology: true }, function(err, client){
//       const myDb = client.db('foods');
//       const collection = myDb.collection('users');
//       collection.insertOne(item, function(err, result){
//         assert.strictEqual(null, err);
//         client.close();
//       });
//         res.redirect('/login');
//     });
//   });


app.post('/register', passport.authenticate('local.register', {
  successRedirect: '/profile',
  failureRedirect: '/register',
  failureFlash: true
}));


/**
 * a login page route  and render it 
 * to display the content of the page
 */
app.get('/login/', (req,res) => {
    res.render('login', {});
});

app.post('/login/', passport.authenticate('local', {
  failureFlash: true,
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureMessage: true
}));

// app.post('/login', function(req, res) {
//   User.findOne({name: req.body.name}, function(err, user) {

//     if (!user.validPassword(req.body.password)) {
//       //password did not match
//     } else {
//       // password matched. proceed forward
//     }
//   });
// });

// app.post('/logout', function (req, res) {
//   req.session.destroy(function (err) {
//       if (err) throw (err);
//       res.redirect('/');
//   })
// });

app.delete('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});


/**
 * profile route for user and admin
 */
 app.get('/profile/', (req, res, next) => {
//  const sessionCookie = req.cookies.session || ""
//   admin.auth().verifySessionCookie(sessionCookie, true)
//      .then(() => {
//       res.render('profile')
//     .catch(() => {
       //res.redirect('/login');
  //   });
  // });
  res.render('profile', {name: req.user.name });
});
/**
 * route for session cookie logout
 */
app.get('/sessionLogOut', (req,res) => {
  res.clearCookie('session');
  res.redirect('/login');
});

/**
 * add or store product to the cart and check if the property exists
 * with a ternary expression and if it exisits pass the old cart
 *  or pass empty javascript object
 */
app.get('/order-here/:id', function(req, res, next){
  var menuId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  console.log(menuId, req.params.id);
  Menu.findById(menuId, function(err, menu){
    if (err) {
      console.log(err)
      return res.redirect('/');
    }
    cart.add(menu, menu.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/menu');
  });
});

app.get('/cart', (req, res, next) => {
  if (!req.session.cart){
    return res.render('cart', {items: null});
  }
  var cart = new Cart(req.session.cart);
  console.log(cart.generateArray());
  res.render('cart', {items: cart.generateArray(), totalPrice: cart.totalPrice});
});

app.get('/checkout', (req, res, next) => {
  if (!req.session.cart){
    return res.redirect('cart');
  }
  var cart = new Cart(req.session.cart);
  res.render('checkout', {total: cart.totalPrice});
});

/**
 * this is a route for admin to display m
 * menus and do the CRUD
 */
app.get('/admin', (req,res) => {
  mongoClient.connect(mongoDB, function(err,client){
    const myDb = client.db('foods');
    const collection = myDb.collection('menus');
    collection.find().toArray(function(error,documents){
      client.close();
      res.render('admin', {menus:documents});
    });
  });
});

//flash message set for admin page
app.get('/admin', (req, res) => {
  req.flash("success", "flash message for a render method");
  res.render("/admin", { successes: req.flash("success") });
});

//cheking authenticated user
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}