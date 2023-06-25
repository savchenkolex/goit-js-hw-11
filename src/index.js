import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let pageCounter = 1;
let total = 0;
let totalPages = 0;
let query = "";
const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

const axiosInstance =  axios.create({
  method: "GET",
  baseURL: "https://pixabay.com/api/",
  params: { 
      key : '37520617-5f1d4ae88891232aac6329fff',
      image_type : 'photo',
      orientation : 'horizontal',
      safesearch : 'true',
      page : 1,
      per_page : 40,
      q : "",
      },
});

const formEl = document.querySelector("#search-form");
formEl.addEventListener("submit", formHeandler);

const imageBox = document.querySelector(".gallery");


const loadBtn = document.querySelector('.load-more');
loadBtn.classList.add('visually-hidden');
loadBtn.addEventListener("click", loadMoreHandler);

const infoBlock = document.querySelector('.text-info');
infoBlock.classList.add('visually-hidden');

const numberField = document.querySelector('.span-numbers');
const queryField = document.querySelector('.span-query');
const pageCounterText = document.querySelector('.page-counter');

async function formHeandler(event) {
    event.preventDefault();
    pageCounter = 1;
    totalPages = 0;
    imageBox.innerHTML = '';

    query = event.currentTarget.elements[0].value;

    if (!query) {
      
      Notiflix.Notify.info('The search bar is empty ¯\\_(ツ)_/¯');

    } else {
      const images = await getImages(query);
      total = images.data.total;
console.log(images);

      if (total > 0) {
        if (total <= 40) {
          loadBtn.classList.add('visually-hidden');
          pageCounterText.textContent = "";
        } else {
          loadBtn.classList.remove('visually-hidden');
          totalPages = total % 40;
          pageCounterText.textContent = `${pageCounter} / ${totalPages}`;
        }
 console.log("total images: " + total);
        Notiflix.Notify.success(`Hooray! We found ${total} images.`);
        infoBlock.classList.remove('visually-hidden');
        numberField.textContent = total;
        queryField.textContent = query;
        drawPhotos(images);
      } else {
        loadBtn.classList.add('visually-hidden');
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      }

    }
   
    formEl.reset(); 
}

async function getImages(query, page = 1) {
    const urlParams = {
      params: {
        q: query,
        page: page,
      }
    };

    return await axiosInstance(urlParams);
}

function drawPhotos({data:{hits}}) {

  const markup = hits.map(({previewURL, webformatURL, largeImageURL, views, tags, comments, likes, downloads }) => {
    return `<a class="photo-link" href="${largeImageURL}">
    <div class="photo-card" >
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b title="Likes">&#10084; ${likes}</b>
      </p>
      <p class="info-item">
        <b title="Views">&#8858; ${views}</b>
      </p>
      <p class="info-item">
        <b title="Comments">&#9997; ${comments}</b>
      </p>
      <p class="info-item">
        <b title="Downloads">&#8615; ${downloads}</b>
      </p>
    </div>
    </div>
    </a>`;
  }).join(" ");

  imageBox.insertAdjacentHTML("beforeend", markup);
  
  lightbox.refresh();
}


async function loadMoreHandler() {
  pageCounter += 1;
  pageCounterText.textContent = `${pageCounter} / ${totalPages}`;
  if (totalPages === pageCounter) {
    loadBtn.classList.add('visually-hidden');
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  }
  const images = await getImages(query, pageCounter);
 
  drawPhotos(images);
  lightbox.refresh();

}

