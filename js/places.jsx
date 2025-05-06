import React from "react"
import {useState,useEffect,changeEvent} from "react"

// get selected place ID
function place() {
	let txt = document.getElementsByName("txt")
	for (let i=0; i<txt.length; i++)
		if (txt[i].checked)
			return txt[i].id
	return ""
}

// send POST request to database
function post(type) {
	let tmp = document.getElementById("txt").value
	let txt = place()
	if (type == "import")
		tmp = ""
	else if (type == "edit")
		document.getElementById("txt").value += "\t" + txt
	else if (type == "delete" || type == "up" || type == "down")
		document.getElementById("txt").value = txt
	txt = document.getElementById("txt").value
	fetch("http://localhost:8080",{
		method:"POST",
		mode:"cors",
		headers:{"Content-type": "text/plain; charset=utf-8"},
		body:type +"="+ txt
	})
	// reload page
	document.getElementById("reload").click()
	document.getElementById("txt").value = tmp
}

// prompt to import a TSV file
function import_tsv(e) {
	if (e.target.files && e.target.files[0]) {
		e.target.files[0].text().then((file) => {
			document.getElementById("txt").value = file
			post("import")
		})
	}
}

// prompt to export/download a TSV file
function export_tsv() {
	fetch("http://localhost:8080"
	).then(response => {
		response.blob().then(blob => {
			let dl = document.createElement("a")
			dl.href = window.URL.createObjectURL(blob)
			dl.download = "places.tsv"
			dl.click()
		})
	})
}

// custom button component
function Btn({type}) {
	let txt = String(type[0]).toUpperCase()+String(type).slice(1)
	return (<button className="btn" onClick={() => post(type)}>{txt}</button>)
}

// show list of places
function List() {
	let places = []
	let [res,set_res] = useState([])
	// setting a variable state directly within a function causes an infinite loop
	useEffect(() => {
		// get text from database
		fetch("http://localhost:8080"
		).then(response => response.text()
		// set result variable to an array of TSV values
		).then(text => set_res(text.trim("\t").split("\t")))
	},[])
	for (let i=0; i<res.length; i++)
		places[i] = [i+1,res[i]]
	let txt = ""
	// online map queries
	let osm = "https://www.openstreetmap.org/search?query="
	let gsm = "https://www.google.com/maps?q="
	// show a list of places
	for (let i=0; i<places.length; i++) {
		txt = '<input id="' + places[i][0] + '" type="radio" name="txt"'
			+ '><label for="' + places[i][1] + '">'
			+ places[i][1] + '</label>'
			+ '<a target="_blank" href="' + osm
			+ places[i][1].replaceAll(" ","+") + '">OSM</a>'
			+ '<a target="_blank" href="' + gsm
			+ places[i][1].replaceAll(" ","+") + '">GSM</a><br />'
			+ txt
	}
	// the "dangerously" is because there is not protection from cross-site scripting
	return (<form id="places"><div dangerouslySetInnerHTML={{__html:txt}}></div></form>)
}

// the main component
class Places extends React.Component {
	// change the state to  the content
	state = {reload:false}
	reload = () => {
		this.setState(
			{reload: true},
			() => this.setState({reload: false})
		)
	}
	// the random key on the List component causes it to redisplay on reload
	render() {
		return (
			<>
				<a id="reload" onClick={this.reload}></a>
				<label class="btn" for="import">Import</label>
				<input id="import" class="btn" type="file" onChange={import_tsv} />
				<a className="btn" onClick={() => export_tsv()}>Export</a><br />
				<input id="txt" type="text" onkeydown="if(event.keyCode === 13)return false;"></input><br />
				<Btn type="add"></Btn>
				<Btn type="edit"></Btn>
				<Btn type="delete"></Btn>
				<Btn type="up"></Btn>
				<Btn type="down"></Btn>
				<br /><br />
				<List key={Math.random()} />
		</>
	)
	}
}

export default Places
