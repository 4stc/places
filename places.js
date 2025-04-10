// modules
let http = require("http");
let url = require("url");
let fs = require("fs");
let path = require("path");

// supported MIME types
let mimes = {
	 "html": "text/html",
	 "css": "text/css",
	 "js": "text/javascript",
	 "tsv": "text/plain",
	 "png": "image/png"};

// create an HTTP server on port 8080
http.createServer((req,res) => {
	// get URL slug
	let slug = url.parse(req.url).pathname;
	let filename = "";
	if (slug === "/")
		filename = "index.html";
	else if (slug === "/test")
		filename = "test/index.html";
	else if (slug === "/places.js")
		// hide server code
		filename = "";
	else
		filename = path.join(process.cwd(),slug);
	// get page
	try {
		fs.accessSync(filename,fs.F_OK);
		let file = fs.createReadStream(filename);
		let mime = mimes[path.extname(filename).split(".")[1]];
		res.writeHead(200,{"Content-Type":mime});
		if (req.method == "GET") {
			// show page
			file.pipe(res);
		}else if (req.method == "POST") {
			// get input data
			req.on("data",(data) => {
				// see crud()
				crud(data.toString());
				// show updated page
				file.pipe(res);
			});
		}
	}
	catch(e) {
		// show error page
		console.log("Nonexistent file: " + filename);
		res.writeHead(404,{"Content-Type":"text/plain"});
		res.end("404 Nonexistent Page");
	}
	return;
}).listen(8080);

// place list array
let places = [];

// load or create TSV file
try {
	file = fs.readFileSync("places.tsv","utf8").trim("\t").split("\t");
	for (let i=0; i<file.length; i++)
		places[i] = [i+1,file[i]];
} catch (err) {
	if (places[0])
		fs.writeFileSync("places.tsv","",{flag:"wx"});
}

// perform CRUD operations
function crud(post) {
	// for knowing what operation to perform
	let type = post.split("=")[0];
	// formatted text input
	let txt = post.substr(type.length+1).replaceAll("%09","\t").trim("\t");
	// log operation
	console.log(type + ": " + txt);
	// do operation
	switch (type) {
		case "add":
			places.push([places.length+1,txt]);
			break;
		case "edit":
			txt = txt.split("\t");
			console.log(txt[1]);
			if (txt[1])
				places[txt[1]-1][1] = txt[0];
			break;
		case "del":
			places.splice(txt-1,1);
			break;
		case "up":
			if(txt<places.length) {
				let up = places[txt][1];
				places[txt][1] = places[txt-1][1];
				places[txt-1][1] = up;
			}
			break;
		case "down":
			if(txt>1) {
				let down = places[txt-1][1];
				places[txt-1][1] = places[txt-2][1];
				places[txt-2][1] = down;
			}
			break;
		case "import":
			places = [];
			txt = txt.split("\t");
			for (let i=0; i<txt.length; i++)
				places[i] = [i+1,txt[i]];
			break;
	}
	// convert array to string
	txt = "";
	for (let i=0; i<places.length; i++)
		txt += places[i][1] + "\t";
	// save TSV file
	fs.writeFileSync("places.tsv",txt.replaceAll("+"," "),
		{encoding:"utf8",flag:"w"});
}
