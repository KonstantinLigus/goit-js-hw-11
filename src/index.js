const URL = 'https://pixabay.com/api/';
const refs = {
  searchInput: document.querySelector('.search-form'),
};

refs.searchInput.addEventListener('submit', onSubmitHandler);

async function onSubmitHandler(event) {
  event.preventDefault();
  const query = event.target.elements.searchQuery.value;
  const param = `?key=27854076-b3a96c006ceb1c322db1c0d19&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`;
  const resp = await fetch(URL + param);
  console.log(resp);
}
