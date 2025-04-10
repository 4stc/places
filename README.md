## Places

### Try
1. Run `node places.js`
2. View [http://127.0.0.1:8080](http://127.0.0.1:8080)

### Data
- Store data in TSV format
- __Client -> Server__: Send data to the server via POST
  requests which contain data allowing the server to
  determine which type of CRUD operation to perform
- __Server -> Client__: Get data from the server via HTTP
  requests for a TSV file which is then parsed into an array

### File Structure
- / (homepage)
- /test (template)
- /css (stylesheets)
  - main.css (core styling)
  - places.css (project related styling)
- places.js (NodeJS server)
- places.tsv (the "database")
- /js (client JavaScript)
  - main.js (project JavaScript)

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
- client
  - places array
    - parse database
  - add function
  - edit function
  - delete function
  - moving functions
    - up
    - down
  - import function
  - export function
  - function to list places
- server
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
