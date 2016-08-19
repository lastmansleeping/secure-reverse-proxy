var http = require('http'),
    httpProxy = require('http-proxy');

var express = require('express');
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

		//var crypto = require('crypto')
  		
			
		function calcHMAC(string,strtype,key,keytype)
		{
			try
			{
				//var hmacObj = new jsSHA(string, strtype);
				var shasum = crypto.createHash('sha1');
				shasum.update(string);
				//console.log("updated");
				var a = shasum.digest('hex');
				//console.log(a);
				
				//alert(a);
				return truncation(String(a));
			}
			catch(e)
			{
				return e
			}
		}
		function truncation(a)
		{
			//alert(a.length);
			//console.log("hi");
			var b=a.substring(a.length-1);
			//alert(b);
			var c=parseInt(b,16);
			//alert(c);
			var d=a.substring(c*2,c*2+8);
			//alert(d);
			return modulo(d);
		}
		function modulo(d)
		{
			var e=parseInt(d,16);
			//alert(e);
			var f=e%1000000;
			//alert(f);
			var g=f.toString();
			//alert(g);
			return g;
		}
		function calculateICD(string)
		{
			return calcHMAC(string,"TEXT","26725525","TEXT");
		}



 

//var session = require('express-session');
//var bodyParser = require('body-parser');
var app = express();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'jade');


//ORIGINAL CODE
var proxy = httpProxy.createProxyServer({});

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}


global.valid = true;

//USER DATABASE
//HARD CODED
var loginData = {};
loginData['Ashish'] = 'Bharadwaj';
loginData['Aneesh'] = 'Subramanya';
loginData['Keerthi'] = 'Prasad';
loginData['Suhas'] = 'Suresh';

var sessId = {};
sessId['Ashish'] = '1';
sessId['Aneesh'] = '2';
sessId['Keerthi'] = '3';
sessId['Suhas'] = '4';

function validate(username,password){
	if(loginData[username] == password)
		return true;
	else
		return false;
}


function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = unescape(parts.join('='));
    });

    return list;
}

function parseData (request) {
    var list = {},
        //rc = request.headers.cookie;
        rc = request;
    rc && rc.split('&').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = unescape(parts.join('='));
    });

    return list;
}


//FORWARD PROXY

proxy.on('proxyReq', function(proxyReq, req, res, options) {
	
	if(req.headers.cookie){//IF COOKIE IS SENT
		var cookies = parseCookies(req);
		global.valid = true;
		/*var a = "mycookie="
		var b = "yourcookie="
		var c = "; "
		a = a + cookies['yourcookie'];
		b = b + cookies['mycookie'];
		a = a + c + b;*/
	  	//console.log(cookies['yourcookie']);

	  	//var a = "mycookie=" + cookies['yourcookie'] + "; yourcookie=" + cookies['mycookie'];
	  	//console.log(a);
	  	var RPCookie = cookies['RPCookie'];
	  	//console.log("rpcookie : "+ RPCookie);
	  	var length = RPCookie.substring(0,2);
	  	//console.log("length : "+ length);
	  	var encryptedSessionId = RPCookie.substring(2,4);
	  	////console.log("encrypt sid : "+encryptedSessionId);
	  	var encryptedASCookie = RPCookie.substring(4,4+Number(length));
	  	//console.log("encrypt ASCookie : " + encryptedASCookie);
	  	//console.log(Number(length));
	  	var ICD = RPCookie.substring(4+Number(length));
	  	//console.log("icd from cookie : "+ICD);
	  	var temp = length + encryptedSessionId + encryptedASCookie;
	  	//var cookieICD = calcluteICD(temp);
	  	//var cookieICD = encrypt(temp);
	  	var cookieICD = calculateICD(String(temp));
	  	//console.log("calculated ICD : "+cookieICD);
	  	//Change this Later^^^

	  	
	  	if(cookieICD == ICD){
	  		//Valid Session
	  		//console.log("icd correct");
	  		var sessionId = decrypt(encryptedSessionId);
	  		var ASCookie = decrypt(encryptedASCookie);
	  		proxyReq.setHeader('Cookie', "ASCookie="+ASCookie);
	  	}
	  	else{
	  		global.valid = false;
	  	}



		
		//proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
	}

	else{//IF COOKIE IS NOT SENT
		//Generate Session ID
		//Send the request to AS
		var postData = '';
		//console.log(proxyReq.data);
		//console.log(req.data);
		
		req.on('data', function(datum) {
 			postData += datum;
 			

  		});

		req.on('end', function() {
  			//console.log(postData);
  			//req.end();
			var form = parseData(postData);
			 			//proxyReq.setHeader('karma','pays');
			  			//console.log(form['username']);
			  			//console.log(form['password']);
			  			//console.log("hi");
			  			//console.log(form);
			  			var username = form['username'];
			  			var password = form['password'];
			  			global.valid = validate(username,password);
			  			//console.log(valid);

			  			
					});
					//var valid = validate();

				}
			  

  //proxyReq.setHeader('Cookie', 'cookie1=10');
});

function parseCookies2 (request) {
    var list = {},
        c = request.headers['set-cookie'];
    //console.log(c);
    var rc = String(c);
    var x = /\[/;
    var y = /\]/;
    rc = rc.replace(x,'');
    rc = rc.replace(y,'');
    //console.log(rc);
    rc && rc.split(',').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = unescape(parts.join('='));
    });
    //console.log(list);
    return list;
}


//BACKWARD PROXY

proxy.on('proxyRes', function(proxyRes, req, res, options) {
	//console.log(proxyRes.headers);
	
	//console.log(cookies[yourcookie]);
	if(global.valid){
		if(proxyRes.headers['set-cookie']){
			var cookies = parseCookies2(proxyRes);
			//console.log(cookies);
			//console.log(cookies['yourcookie']);
			//var a = "\"mycookie=" + cookies['yourcookie'] + "\", \"yourcookie=" + cookies['mycookie'] + "\"";
			//a = "[" + a + "]";
			//console.log(a);
			//res.removeHeader('set-cookie');
			delete proxyRes.headers['set-cookie'];
			//proxyRes.setHeader('set-cookie','mycookie=boom');
			//res.setHeader('set-cookie','mycookie=boom');
			//res.setHeader('Set-Cookie',a);
			
				
				//Encapsulating and Encrypting AS Cookie
				var ASCookie = cookies['ASCookie'];
				var encryptedASCookie = encrypt(ASCookie);
				var length = String(encryptedASCookie).length;
				
				//Encrypting Session ID
				var sessionId = sessId[String(ASCookie)];
				var encryptedSessionId = encrypt(sessionId);
				
				//Encapsulating all RP cookie attributes
				var RPCookie = length + encryptedSessionId + encryptedASCookie;
				
				//Calculate ICD
				var ICD = calculateICD(RPCookie);
				console.log(ICD);
				//console.log("from app server icd "+ICD);
				//Change Later 

				//var ICD = encrypt(RPCookie);


				//Append ICD to RP Cookie
				RPCookie = RPCookie + String(ICD);



			res.setHeader("Set-Cookie", ["RPCookie="+RPCookie+";expires="+new Date(new Date().getTime()+86409000).toUTCString()]);
			//res.setHeader('call','yolo');
			

	}
}
else{
	res.setHeader("Set-Cookie", ["RPCookie="+RPCookie+";expires="+new Date(new Date().getTime()-3600).toUTCString()]);
			
}
	

});


//REVERSE PROXY SERVER
var server = http.createServer(function(req, res) {

  //console.log(res.headers);
  
  		//console.log(valid);
		proxy.web(req, res, { target: 'http://127.0.0.1:3000' });
		
		


});

//console.log("listening on port 5050")
server.listen(5050);



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//APPLICATION SERVER



app.get('/',function(req,res){
//GET METHOD
//INVOKED WHEN USER HAS ALREADY ENTERED VALID 
//CREDENTIALS AND IS SENDING THE COOKIE

	//console.log(req.headers.cookies);
	//console.log(global.valid);
	if(global.valid && req.headers.cookie){
		//if its a valid session
		//console.log("hi");
		var cookies = parseCookies(req);
		//console.log(cookies);
		//console.log(req.headers.Cookies);

		var username = cookies['ASCookie'];
		//console.log(username);
		//res.writeHead(200, {'Content-Type': 'text/plain'});
		res.render("home",{ name : username });
	 	//res.write('request successfully proxied!' + 'n' + JSON.stringify(req.headers, true, 2));
	 	//res.end();
	}
	else{
		//console.log("bye");
		res.render('login.html');
	}

});



app.post('/',function(req,res){
//POST METHOD
//CALLED WHEN USER LOGS IN THE FIRST TIME BY ENTERING('POSTING') CREDENTIALS
			var postData ='';
			req.on('data', function(datum) {
 					postData += datum;
 			

  				});

			req.on('end', function() {
  			//console.log(postData);
  			//req.end();
					var form = parseData(postData);
			 		var username = form['username'];
			  		var password = form['password']
			  		
			  			//console.log(valid);
			  		if(global.valid){
						res.setHeader("Set-Cookie", ["ASCookie="+username]);
				 		res.render("home",{ name : username });
						//res.writeHead(200, {'Content-Type': 'text/plain'});
						//res.end();
				 	}
					else{
				 		//res.writeHead(404, {'Content-Type': 'text/plain'});
						//res.write('Invalid');
						//res.end();
						res.render('login.html');
				 	}


			  			
				});
			


			
	//res.render('login.html');
});



app.listen(3000,function(){
console.log("Application Server Running on localhost:3000");
console.log("Have fun Reverse Proxying !");
});