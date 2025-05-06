## Places

### Try
1. Run  `node places.cjs` to start the database
2. In another commandline run:
  - `npm install` to install dependencies
  - `npm run dev` to start the website
3. View [http://localhost:5173](http://localhost:5173)

### Implementation Choices
- Vite and its and dependencies are the only NPM packages used

### Data
- Store data in TSV format
- __Client -> Server__: Send data to the server via POST
  requests which contain data allowing the server to
  determine which type of CRUD operation to perform
- __Server -> Client__: Get data from the server via an HTTP
  request for a TSV file

### File Structure
- / (homepage)
- /test (template)
- /css (stylesheets)
  - main.css (core styling)
  - places.css (project related styling)
- places.cjs (NodeJS "database" server)
- places.tsv (the "database")
- /js (client JavaScript)
  - main.jsx (base ReactJS)
  - places.jsx (project ReactJS)

### HTML
- template
  - header
  - navigation
  - area for places list
  - footer

### CSS
- IDs
  - main (container)
    - nav (navigation)
    - body (content)
      - places (place list)
    - foot (footer)

### JS
- ReactJS Vite client
  - POST request function
  - import function
  - export function
  - custom button component
  - component to list places
    - GET request
- NodeJS server
  - modules
    - http
    - url
    - fs
    - path
  - HTTP server function
  - places array
  - CRUD operations function
    - switch statement
      - add
      - edit
      - delete
      - up
      - down
