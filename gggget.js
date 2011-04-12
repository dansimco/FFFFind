
	// Requirements
	
	var jsdom = require('jsdom');

	var sys = require('sys');

	var mootools = require('mootools');
	
	var fs = require('fs');
	
	var http = require('http');
	
	var path = require('path');


	// Definitions
	
	var user = process.argv[2]; // called by "$node gggget.js username"
	
	var missing_images = [];


// Read JSON

fs.readFile('./found/'+user+'.json','utf-8', function (err, data) {

  if (err) throw err;

	found_images = JSON.decode(data);

	downloadNext();

});


	
// Download Files

function downloadNext(){		

		if(found_images.length > 0){

			var next_image = found_images.pop();
			requestFile(next_image);

		} else {

			console.log('Done!');

		}

}

function lookForLocalFile(filename,user){
	
	
}


function requestFile(url){
	
		console.log('attempting to download '+url);
			
		var filename = url.split('/').getLast().split('?')[0];

		var extension = url.split('.').getLast();

		var request_host = url.split('/')[0];

		var request_path = url.replace(request_host,'');


		// Look for local file first
		
		path.exists('./images/'+filename, function(exists){

			if(!exists){
				
				// Download options

				var options = {
				  host: request_host,
				  port: 80,
				  path: request_path,
					method: 'GET'
				}


				// Retrieve the file


				var request = http.request(options, function(res){		

				  res.setEncoding('binary');			

					var cl = res.headers['content-length'];
					console.log(cl);

					var checkContentType = function(){
						if(res.headers['content-type'] == null) return false;
						if(!res.headers['content-type'].contains('image')) return false;
						return true;
					};

					//Step the queue on request end

				//	res.on('end', function(err){downloadNext()});


					//If the request looks good, create and write the image file

					if(checkContentType() && res.statusCode != 404){

						// When new chunks come in, write them to the imagedata var

						var imagedata = ''

						res.on('data', function (chunk) {
							imagedata += chunk; 
					  });				


						// On request end, write the file, 

					  res.on('end', function(err){

							if(!err) {

								fs.writeFile('images/'+filename, imagedata, 'binary', function (err) {

									if (err) {console.log('could not write '+filename);}
									downloadNext();
							  });

							}

					  });								

					} else {

						console.log(url+ ' cant be retrieved'); // could be a 404, or a html file etc.

						downloadNext();

						missing_images.include(url);				

					}		  


				}); //get

				request.on('error', function(err){

					console.log('cannot reach host at '+url);

					missing_images.include(url);

					downloadNext();

				});

				request.end();
				
			} else {
				
				console.log('file has been downloaded, get the next one');
				
				downloadNext();
				
				
			}





		});
		

	


}

