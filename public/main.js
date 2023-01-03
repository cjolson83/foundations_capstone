const form = document.querySelector('form')
const imageURL = document.querySelector('#cover-image')
const artistInput = document.querySelector('#artist')
const titleInput = document.querySelector('#title')
const formatSelect = document.querySelector('select')
const descriptionInput = document.querySelector('#description')
let ratingSelect = document.querySelector('#rating')
let albumsList = document.querySelector('#albums-container')
var coll = document.getElementsByClassName("collapsible");

var i;
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}


function createAlbum(evt) {
    evt.preventDefault()

    if (artistInput.value < 1) {
        alert ('You must enter an artist')
        return
    }

      if (titleInput.value < 1) {
        alert ('You must enter a title')
        return
    }

    if (descriptionInput.value > 255) {
        alert ('Description must be 255 characters or less')
        return
    }

    let body = {
        imageURL: imageURL.value,
        artist: artistInput.value, 
        title: titleInput.value,
        format: formatSelect.value,
        description: descriptionInput.value,
        date: new Date().toJSON().slice(0, 10),
        rating: ratingSelect.value
    }

    axios.post('/albums', body)
        .then(() => {
            form.reset();
            getAllAlbums()
        })
}

function getAllAlbums() {
    axios.get('/albums')
        .then(res => {
            console.log(res.data)
            displayAlbums(res.data)
        })
}

function updateRating(album_id, type) {
    axios.put(`/albums/${album_id}`, {type})
    .then(({data}) => displayAlbums(data))
    .catch(err => console.log(err))
}

function displayAlbums(arr) {
    albumsList.innerHTML = ''
    arr.forEach(elem => {
        let albumCard = `<div class="album-card">
            <img src="${elem.imageurl}" alt=" Album Cover">
            <h2>${elem.artist}</h2>
            <h3>${elem.title} (${elem.format})</h3>
            <p>Added to collection on ${elem.date}</p>
            <p>${elem.description}</p>
            <div class="btns-container">
             <button onclick="updateRating(${elem.album_id},'minus')">-</button>
             <h3 class="album-rating" id="album-rating-${elem.album_id}">${elem.rating} / 10</h3>
             <button onclick="updateRating(${elem.album_id},'plus')">+</button>
             </div>
            <button onclick="deleteAlbum(${elem['album_id']})">Delete</button>
            </div>
        `

        albumsList.innerHTML += albumCard
    })
}

function deleteAlbum(album_id) {
    axios.delete(`/albums/${album_id}`)
        .then(() => getAllAlbums())
        .catch(err => console.log(err))
}

getAllAlbums()

form.addEventListener('submit', createAlbum)