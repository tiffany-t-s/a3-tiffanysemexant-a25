// FRONT-END (CLIENT) JAVASCRIPT HERE

//const { use } = require("react");

const appdata = []
//reference page elements
const credform = document.getElementById('credentials');
const username = document.getElementById('username');
const password = document.getElementById('password');
const movieForm = document.getElementById('myForm');
const movieName = document.getElementById('movieName');
const releaseYear = document.getElementById('releaseYear');
const starRating = document.getElementById('starRating');
const review = document.getElementById('review');

const login = function( event ){
  event.preventDefault()
  //form validation
  if((username.value.trim() === "")|| (password.value.trim() === "")){
    alert("Must fill in both username and password. Spaces are not a valid entry")
    return false;
  }
  jsons = {"username": username.value, "password": password.value}
  body = JSON.stringify(jsons)
  const response = fetch ("/getUserData", {
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body
  }).then(function(response) {return response.json();})
  .then(function( newResponse){
    userName = username.value;
    console.log(userName)
    passWord = password.value;
    console.log(passWord)
    credform.reset()
    window.location.replace("/mainPage.html");
    return newResponse
  })
}

const showMe = function(){
  const response = fetch( "/showMe", {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  })
  .then(function(response) {return response.json();})
  .then(data => createTable(data))
  .then(item => console.log(item))
}

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  jsons = {"movieName": movieName.value, "releaseYear": releaseYear.value, "numStars": starRating.value, "review": review.value, "ranking": 1}
  body = JSON.stringify(jsons)
  const response = await fetch( "/submit", {
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body
  })
  .then(function(response) {return response.json();})
  .then(data => createTable(data))
};

const remove = async function( event ) {
  // stop form submission from trying to load
  event.preventDefault()
  json = {"movieName":  movieName.value, "releaseYear": releaseYear.value},
      body = JSON.stringify( json )
  const response = await fetch( "/delete", {
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body
  }).then(function(response) {return response.json();})
  .then(data => createTable(data))
}

const loadItUp = function(){
  if(this.window.location.pathname == "/"){
    const credButton = this.document.querySelector('#loginSubmit');
    credButton.onclick = login;
  }
  else if(this.window.location.pathname == "/mainPage.html"){
    showMe();
    const submitButton = this.document.querySelector('#submitEntry');
    const deleteButton = this.document.querySelector('#deleteButton');
    const homeButton = this.document.querySelector('#homeButton')
    submitButton.onclick = submit;
    deleteButton.onclick = remove;
    homeButton.onclick = function(){window.location.pathname = "/"}
  }
  else{
    console.log("problem")
    console.log(window.location.pathname)
  }
}

window.onload = function() {
  loadItUp();
}

const createTable = function (json){
  const star = "&#9733;";
  const noStar = "&#9734";
  const oldTable = document.getElementById("displayData");
  if(oldTable != null){
    oldTable.remove();
  }
  //create new table. yes this is probably the least efficient way, but nothing else worked so...
  let table = document.createElement("table");
  table.setAttribute("id", "displayData")
  table.setAttribute("class", "table bordered striped u-border-4")
  let headRow = table.insertRow();
  const head1 = headRow.insertCell();
  head1.innerText = "Movie Name";
  const head2 = headRow.insertCell();
  head2.innerText = "Release Date";
  const head3 = headRow.insertCell();
  head3.innerText = "Rating";
  const head4 = headRow.insertCell();
  head4.innerText = "Review";
  const head5 = headRow.insertCell();
  head5.innerText = "Ranking";

  //for each json item, put all the objects in their own cell
  json.forEach( item => {
    const row = table.insertRow();
    const name = row.insertCell();
    name.innerText = item.movieName;
    const year = row.insertCell();
    year.innerText = item.releaseYear;
    const stars = row.insertCell();
    let starPics = "";
    for (let i = 0; i < item.numStars; i++){
        starPics = starPics + star;
    }
    for (let j = 0; j < (10 - item.numStars); j++){
        starPics = starPics + noStar;
    }
    stars.innerHTML = starPics;
    const review = row.insertCell();
    review.innerText = item.review;
    const ranking = row.insertCell();
    ranking.innerText = item.ranking;
  })
  document.getElementById("middle").appendChild(table);
  document.getElementById("myForm").reset()
}