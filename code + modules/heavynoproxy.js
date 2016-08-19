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

function loadTester(n){
	var count =n;
	while(count >= 0){
		//console.log(count);
		calculateICD("Die For Heavy Metal");
		count--;
	}
}


var app = express();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'jade');



var proxy = httpProxy.createProxyServer({});

//Load



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//APPLICATION SERVER

app.get('/',function(req,res){
//GET METHOD
	global.requestload=1000000;

	//console.log("Load handled by Application Server : "+(global.requestload));
	loadTester(global.requestload);
	res.render('login.html');
});



app.listen(3020,function(){
console.log("Application Server Running on localhost:3020");
console.log("No Reverse Proxy !");
});