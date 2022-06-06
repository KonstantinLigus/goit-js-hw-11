import { Notify } from 'notiflix/build/notiflix-notify-aio';

const URL = 'https://pixabay.com/api/';
let page = 1;

const refs = {
  searchInput: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
refs.searchInput.addEventListener('submit', onSubmitClick);

async function onSubmitClick(event) {
  event.preventDefault();
  page = 1;
  refs.loadMoreBtn.style.display = 'none';
  refs.gallery.innerHTML = '';
  if (event.target.elements.searchQuery.value === '') {
    return;
  }
  const query = event.target.elements.searchQuery.value.trim();
  try {
    const contentArr = await fetchContent(query);
    refs.loadMoreBtn.style.display = 'block';
    page = 1;
    if (contentArr.hits.length === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    renderGallery(contentArr);
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreClick(event) {
  try {
    page += 1;
    const contentArr = await fetchContent(
      refs.searchInput.elements.searchQuery.value.trim()
    );
    renderGallery(contentArr);
  } catch (error) {
    console.log(error);
  }
}

async function fetchContent(query) {
  const param = `?key=27854076-b3a96c006ceb1c322db1c0d19&q=${query}&image_type=photo&orientation=horizontal&safesearch=truekk&page=${page}&per_page=40`;
  const resp = await fetch(URL + param);
  return resp.json();
}

function renderGallery(contentArr) {
  const markupContent = contentArr.hits.map(obj => {
    const {
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = obj;
    return `<div class="photo-card">
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
  </div>`;
  });
  refs.gallery.insertAdjacentHTML('beforeend', markupContent.join(' '));
}
