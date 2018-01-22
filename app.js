var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

/*setup mongoose connection using MLAB start*/
var mongoDB = 'mongodb://SUPRIYAKOKATE:sk5014541@ds111648.mlab.com:11648/mymongo_supriya';//'mongodb://supriya92:sk5014541@ds135186.mlab.com:35186/mymongo_supriya';

mongoose.connect(mongoDB,{
	useMongoClient: true
});
mongoose.Promise =global.Promise;
var db = mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB connection error:'));
/*setup mongoose connection using MLAB end*/

//mongoose.connect('mongodb://localhost/loginapp');


//var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

//Init App
var app = express();

//View Engine
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');

/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');*/

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(__dirname + '../public'));

//Express Session
app.use(session({
	secret:'secret',
	saveUninitialized:true,
	resave:true
}));

//passport initoialization
app.use(passport.initialize());
app.use(passport.session());
//Express Validator
app.use(expressValidator({
	errorFormatter: function(param,msg,value){
		var namespace = param.split('.')
		,root  = namespace.shift()
		,formParam = root;

		while(namespace.length){
			formParam +='['+namespace.shift()+']';
		}
		return{
			param: formParam,
			msg:msg,
			value:value
		};
	}
}));

//connect flash
app.use(flash());

//Global Vars
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
})

app.use('/',routes);
app.use('/users',users);

//set port
app.set('port',(process.env.PORT || 3000));

app.listen(app.get('port'),function(){
	console.log('server started on port '+app.get('port'));
});