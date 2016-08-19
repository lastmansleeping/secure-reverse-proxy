var http = require('http');


var express = require('express');
var app = express();
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3mfeq';
 
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



app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'jade');

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


app.get('/',function(req,res){
//GET METHOD
//INVOKED WHEN USER HAS ALREADY ENTERED VALID 
//CREDENTIALS AND IS SENDING THE COOKIE

	

		//if its a valid session
		if(req.headers.cookie){
		var cookies = parseCookies(req);
		console.log(cookies);
		//console.log(req.headers.Cookies);

		var x = cookies['ServerCookie'];
		var ICD = x.substring(0,6);
		var username = x.substring(6);
		console.log(ICD);
		console.log(username);
		console.log(calculateICD(String(username)));
		if(calculateICD(String(username)) == ICD){
		username = decrypt(username);
		username = username.substring(7);
		console.log(username);
			if(loginData.hasOwnProperty(username)){
				res.render("home",{ name : username });
			}
		//console.log(username);
		//res.writeHead(200, {'Content-Type': 'text/plain'});
		
	 	//res.write('request successfully proxied!' + 'n' + JSON.stringify(req.headers, true, 2));
	 	//res.end();

			else{
				
				res.setHeader("Set-Cookie", ["ServerCookie="+encrypt(username)+";expires="+new Date(new Date().getTime()-3600).toUTCString()]);
				res.render('login2.html');
			}
		}
		else{
			res.setHeader("Set-Cookie", ["ServerCookie="+encrypt(username)+";expires="+new Date(new Date().getTime()-3600).toUTCString()]);
			res.render('login2.html');
			
		}
	}
	else{

			res.render('login2.html');
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
			  		if( loginData[username] == password ){
			  			username = "abcdegf" + username;
			  			username = encrypt(username);
			  			console.log(username);
			  			var ICD = calculateICD(username);
			  			console.log(ICD);
			  			console.log("------");
			  			var x = ICD + username ;
						res.setHeader("Set-Cookie", ["ServerCookie="+x]);
						username = decrypt(username);
						username = username.substring(7);
				 		res.render("home",{ name : username });
						//res.writeHead(200, {'Content-Type': 'text/plain'});
						//res.end();
				 	}
					else{
				 		//res.writeHead(404, {'Content-Type': 'text/plain'});
						//res.write('Invalid');
						//res.end();
						res.render('login2.html');
				 	}


			  			
				});
			


			
	//res.render('login.html');
});



app.listen(4000,function(){
console.log("Application Server Running on localhost:4000");
console.log("No Reverse Proxy");
});