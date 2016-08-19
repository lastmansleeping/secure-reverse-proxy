var express = require('express');
//var session = require('express-session');
//var bodyParser = require('body-parser');
var app = express();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

//app.use(session({secret: 'ssshhhhh'}));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));



app.get('/',function(req,res){
//GET METHOD
//INVOKED WHEN USER HAS ALREADY ENTERED VALID 
//CREDENTIALS AND IS SENDING THE COOKIE

	//res.render('login.html');
	//res.setHeader("Set-Cookie", ["mycookie=ninja", "yourcookie=javascript"]);
		 		
	
	res.writeHead(200, {'Content-Type': 'text/plain'});
 	res.write('request successfully proxied!' + 'n' + JSON.stringify(req.headers, true, 2));
 	res.end();


});



app.post('/',function(req,res){
//POST METHOD
//CALLED WHEN USER LOGS IN THE FIRST TIME BY ENTERING('POSTING') CREDENTIALS

			//if(req.headers['valid'] == true){
				res.setHeader("Set-Cookie", ["mycookie=ninja", "yourcookie=javascript"]);
		 		
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.write('Valid');
		 		res.end();
		 	//}
		 	/*else{
		 		res.writeHead(404, {'Content-Type': 'text/plain'});
				res.write('Invalid');
				res.end();
		 	}*/
	//res.render('login.html');
});



app.listen(3000,function(){
console.log("Application Server Running on localhost:3000");
console.log("Have fun Reverse Proxying !");
});