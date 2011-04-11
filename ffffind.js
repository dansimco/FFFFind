
	// Requirements
	
	var jsdom = require('jsdom');

	var sys = require('sys');

	var mootools = require('mootools');
	
	var fs = require('fs');
	
	
	// Options
	
	var n = 0; // number of images per page
	
	var t = 0; // total found images

	var o = 0; // offset
	
	var found_images = [];
	
	var user = process.argv[2]; // called by "$node ffffind.js username"
	
	
	// Load HTML

	var ffffind = function(user,offset) {

		var url = "http://www.ffffound.com/home/"+user+"/found?offset="+offset;

		jsdom.env(url, ['./lib/sizzle.js'], function(errors, window) {

			scrapeImages(window);

		});		
		
	}


	// Scrape Images

	function scrapeImages(window){
		
		var divs = window.Sizzle("div.description");
	
	
		// Define amount of images per page
	
		n = divs.length;


		// If we still have images, otherwise all have been ffffound!

		if(n > 0) {

			Object.each(divs,function(div){

				// The image url is the first text node before the break in .description

				var imageURL = div.innerHTML.split('<br>')[0];

			
				// Add image to found images array
			
				found_images.include(imageURL);


				// Increment total found images
				
				t++;

			});

			console.log('Found '+divs.length+ ' images at offset '+o);

			
			// Increment page offset
			
			o = o + n;
			
			
			// Scrape the next page
			
			ffffind(user,o);
			
			
		} else {
			
			// Log and output the urls to a JSON file
			
			console.log('\n\n'+user+' found '+found_images.length+' images');
			
			var json_urls = JSON.encode(found_images);

			fs.writeFile("./found/"+user+".json", json_urls, function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("URLs output to /found/"+user+'.json');
			    }
			});
			
			console.log(new Date());		
			
		}
		
	}


// ggggo!

console.log(new Date());
ffffind(user,o);


