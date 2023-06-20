import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

// axios({
//     method: 'GET',
//     url: 'https://pixabay.com/api/',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     params: {
//         q: '',
//         key: '37520617-5f1d4ae88891232aac6329fff',
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: 'true',
//         page: 1,
//         per_page: 40,
//     }
// });

const markup = `<div class="photo-card">
<img src="" alt="" loading="lazy" />
<div class="info">
  <p class="info-item">
    <b>Likes</b>
  </p>
  <p class="info-item">
    <b>Views</b>
  </p>
  <p class="info-item">
    <b>Comments</b>
  </p>
  <p class="info-item">
    <b>Downloads</b>
  </p>
</div>
</div>`;



const formEl = document.querySelector("#search-form");

formEl.addEventListener("submit", formHeandler);


async function formHeandler(event) {
    event.preventDefault();
    const query = event.currentTarget.elements[0].value;

    const API_KEY = '37520617-5f1d4ae88891232aac6329fff';
    const image_type = 'photo';
    const orientation = 'horizontal';
    const safesearch = 'true';
    const page = 1;
    const per_page = 40;
    const response = fetch(`https://pixabay.com/api/?key=${API_KEY}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&page=${page}&per_page=${per_page}&q=${query}`).then(data => data.json()).then(json => console.log(json));
    
    formEl.reset();
}

