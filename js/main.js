// parse TSV file
function tsv() {
	// put TSV file contents into an array
	let txt = [];
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			let res = xhttp.responseText.trim("\t").split("\t");
			for (let i=0; i<res.length; i++)
				txt[i] = [i+1,res[i]];
		}
	};
	// parse local places.tsv file
	xhttp.open("GET", "places.tsv", true);
	xhttp.send();
	return txt;
}

// send post data to server
function post(type) {
	// get input text
	let txt = document.getElementById("txt").value;
	// if there is no input data
	if (txt == "")
		return;
	// create a form to send input data to server
	document.body.innerHTML +=
		'<form class="post" action="/" method="post">'
		+ '<input id="txt_' + type + '" type="text" name="'
		+ type + '">' + '<input id="btn_' + type
		+ '" class="btn" type="submit">' + '</form>';
	document.getElementById("txt_"+type).value = txt;
	// send input data
	document.getElementById("btn_"+type).click();
}

// place list array
let places = tsv();

// show places on page
function show() {
	let txt = "";
	// online map queries
	let osm = "https://www.openstreetmap.org/search?query=";
	let gsm = "https://www.google.com/maps?q=";
	// show a list of places
	for (let i=0; i<places.length; i++) {
		txt = '<input id="' + places[i][0] + '" type="radio" name="txt"'
			+ '><label for="' + places[i][1] + '">'
			+ places[i][1] + '</label>'
			+ '<a target="_blank" href="' + osm
			+ places[i][1].replaceAll(" ","+") + '">OSM</a>'
			+ '<a target="_blank" href="' + gsm
			+ places[i][1].replaceAll(" ","+") + '">GSM</a><br />'
			+ txt;
	}
	document.getElementById("body").innerHTML =
		'<form id="places">' + txt + '</form>';
}

// get selected place ID
function place() {
	let txt = document.getElementsByName("txt");
	for (let i=0; i<txt.length; i++)
		if (txt[i].checked)
			return txt[i].id;
	return "";
}

document.getElementById("add").addEventListener("click",() => {
	post("add")
});
document.getElementById("edit").addEventListener("click",() => {
	let txt = place();
	if (txt != "") {
		document.getElementById("txt").value += "\t" + txt;
		post("edit");
	}
});
document.getElementById("del").addEventListener("click",() => {
	let txt = place();
	if (txt != "") {
		document.getElementById("txt").value = txt;
		post("del");
	}
});
document.getElementById("up").addEventListener("click",() => {
	let txt = place();
	if (txt != "") {
		document.getElementById("txt").value = txt;
		post("up");
	}
});
document.getElementById("down").addEventListener("click",() => {
	let txt = place();
	if (txt != "") {
		document.getElementById("txt").value = txt;
		post("down");
	}
});

document.getElementById("import").addEventListener("change",(e) => {
	e.target.files[0].text().then((file) => {
		document.getElementById("txt").value = file;
		post("import");
	});
});
document.getElementById("export").addEventListener("click",() => {
	// put place list into a string
	let txt = "";
	for (i in places)
		txt += places[i][1].toString() + "\t";
	// prompt to download CSV file
	let dl = document.createElement("a");
	dl.href = "data:text/plain;charset=utf-8," + encodeURIComponent(txt.trim("\t"));
	dl.download = "places.tsv";
	dl.click();
});

document.getElementById("txt").focus();
setTimeout(() => {
	show();
},99);
