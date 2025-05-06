import React from "react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "../css/places.css"
import Places from './places.jsx'

createRoot(document.getElementById("body")).render(
	<StrictMode>
		<Places />
	</StrictMode>,
)
