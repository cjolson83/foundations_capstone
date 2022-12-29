const form = document.querySelector('form')
const imageURL = document.querySelector('#cover-image')
const artistInput = document.querySelector('#artist')
const titleInput = document.querySelector('#title')
const formatSelect = document.querySelector('select')
const descriptionInput = document.querySelector('#description')
let ratingSelect = document.querySelector('#rating')
let albumsList = document.querySelector('#albums-container')

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

    let body = {
        imageURL: imageURL.value,
        artist: artistInput.value, 
        title: titleInput.value,
        format: formatSelect.value,
        description: descriptionInput.value,
        date: new Date().toJSON().slice(0, 10),
        rating: ratingSelect.value
    }

    axios.post('http://localhost:4005/albums', body)
        .then(() => {
            form.reset();
            getAllAlbums()
        })
}

function getAllAlbums() {
    albumsList.innerHTML = ''

    axios.get('http://localhost:4005/albums')
        .then(res => {
            console.log(res.data)
            res.data.forEach(elem => {
                let albumCard = `<div class="album-card">
                    <img src="${elem.imageurl}" alt=" Album Cover">
                    <h2>${elem.artist}</h2>
                    <h3>${elem.title} (${elem.format})</h3>
                    <p>Description: ${elem.description}</p>
                    <p>Added to collection on ${elem.date}</p>
                    <div class="btns-container">
                     <button onclick="updateRating(${elem.album_id},'minus')">-</button>
                     <p class="album-rating" id="album-rating-${elem.album_id}">${elem.rating}</p>
                     <button onclick="updateRating(${elem.album_id},'plus')">+</button>
                     </div>
                    <button onclick="deleteAlbum(${elem['album_id']})">Delete</button>
                    </div>
                `

                albumsList.innerHTML += albumCard
            })
        })
}

function updateRating(album_id, type) {
    axios.put(`http://localhost:4005/albums/${album_id}`, {type})
    .then(() => getAllAlbums())
    .catch(err => console.log(err))
}

// function getRating()

// let newRating = (id,type)=>{
//     let albumRating = document.getElementById('album-rating-${elem.album_id}')
//     if(type === plus){
//     +albumRating.textContent++}
//     else{
//         +albumRating.textContent--
//     }
// }

// function getRating(album_id)


function deleteAlbum(album_id) {
    axios.delete(`http://localhost:4005/albums/${album_id}`)
        .then(() => getAllAlbums())
        .catch(err => console.log(err))
}

getAllAlbums()

form.addEventListener('submit', createAlbum)