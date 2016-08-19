		//var hmacObj = require("jssha");
		var crypto = require('crypto')
  		, shasum = crypto.createHash('sha1');
			
		function calcHMAC(string,strtype,key,keytype)
		{
			try
			{
				//var hmacObj = new jsSHA(string, strtype);
				shasum.update(string);
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

		console.log(calculateICD("jsdkfg"));
		console.log(calculateICD("YOMr White"));