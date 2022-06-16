import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';

const URL = 'https://pixabay.com/api/';
let key = '27854076-b3a96c006ceb1c322db1c0d19';
let page = 1;
let perPage = 40;
let totalPages = 0;
let query = null;
let param = null;
const simpleLightbox = new SimpleLightbox('.gallery a');

const refs = {
  searchInput: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
// refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
refs.searchInput.addEventListener('submit', onSubmitClick);

// async function onSubmitClick(event) {
//   event.preventDefault();
//   page = 1;
//   refs.gallery.innerHTML = '';
//   if (event.target.elements.searchQuery.value === '') {
//     return;
//   }
//   query = event.target.elements.searchQuery.value.trim();
//   try {
//     const data = await fetchData(query);
//     submitDataCheckerAndRender(data);
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function onLoadMoreClick(event) {
//   page += 1;
//   try {
//     const data = await fetchData(query);
//     onLoadMoreDataCheckerAndRender(data);
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function fetchData(query) {
//   param = `?key=${key}&q=${query}&image_type=photo&orientation=horizontal&safesearch=truekk&page=${page}&per_page=${perPage}`;
//   const resp = await axios.get(URL + param);
//   return resp.data;
// }

function renderGallery(data) {
  const markupContent = data.hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `
      <div class="photo-card">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            <br>${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            <br>${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            <br>${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            <br>${downloads}
          </p>
        </div>
      </a>
      </div>
  `;
    }
  );
  refs.gallery.insertAdjacentHTML('beforeend', markupContent.join(' '));
  simpleLightbox.refresh();
}

// function submitDataCheckerAndRender(data) {
//   totalPages = Math.ceil(data.totalHits / perPage);
//   if (data.hits.length === 0) {
//     refs.loadMoreBtn.style.display = 'none';
//     Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//     return;
//   }
//   if (page === totalPages) {
//     refs.loadMoreBtn.style.display = 'none';
//     renderGallery(data);
//     return;
//   }
//   refs.loadMoreBtn.style.display = 'none';
//   Notify.info(`Hooray! We found ${data.totalHits} images.`);
//   renderGallery(data);

//   refs.loadMoreBtn.style.display = 'block';
// }

// function onLoadMoreDataCheckerAndRender(data) {
//   totalPages = Math.ceil(data.totalHits / perPage);
//   if (page === totalPages) {
//     refs.loadMoreBtn.style.display = 'none';
//     Notify.info("We're sorry, but you've reached the end of search results.");
//     return;
//   }
//   renderGallery(data);
//   scrollingPage();
//   refs.loadMoreBtn.style.display = 'block';
// }

// function scrollingPage() {
//   const { height: cardHeight } =
//     refs.gallery.firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
// ---------------Infinite scroll-----------

const infScroll = new InfiniteScroll(refs.gallery, {
  path: function () {
    param = `?key=${key}&q=${query}&image_type=photo&orientation=horizontal&safesearch=truekk&page=${this.pageIndex}&per_page=${perPage}`;
    return URL + param;
  },
  scrollThreshold: 0,
  responseBody: 'json',
  status: '.page-load-status',
  history: false,
});

infScroll.on('load', function (body) {
  dataCheckerAndRender(body);
});

function onSubmitClick(event) {
  event.preventDefault();
  infScroll.pageIndex = 1;
  refs.gallery.innerHTML = '';
  if (event.target.elements.searchQuery.value === '') {
    return;
  }
  query = event.target.elements.searchQuery.value.trim();

  // load initial page
  infScroll.loadNextPage();
}

function dataCheckerAndRender(data) {
  page = infScroll.pageIndex - 1;
  console.log(page);
  totalPages = Math.ceil(data.totalHits / perPage);
  if (data.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (page === 1) {
    Notify.info(`Hooray! We found ${data.totalHits} images.`);
    renderGallery(data);
    return;
  }
  if (page === totalPages) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    renderGallery(data);
    return;
  }
  renderGallery(data);
}
