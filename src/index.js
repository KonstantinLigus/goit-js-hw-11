import { Notify } from 'notiflix/build/notiflix-notify-aio';

const URL = 'https://pixabay.com/api/';

const refs = {
  searchInput: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
refs.loadMoreBtn.hidden = true;
refs.searchInput.addEventListener('submit', onSubmitHandler);

async function onSubmitHandler(event) {
  event.preventDefault();
  const query = event.target.elements.searchQuery.value;
  try {
    const contentArr = await fetchContent(query);
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

async function fetchContent(query) {
  const param = `?key=27854076-b3a96c006ceb1c322db1c0d19&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`;
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
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </div>`;
  });
  refs.gallery.innerHTML = markupContent.join(' ');
}
