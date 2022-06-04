({searchInput:document.querySelector(".search-form")}).searchInput.addEventListener("submit",(async function(e){e.preventDefault();const t=`?key=27854076-b3a96c006ceb1c322db1c0d19&q=${e.target.elements.searchQuery.value}&image_type=photo&orientation=horizontal&safesearch=true`,a=await fetch("https://pixabay.com/api/"+t);console.log(a)}));
//# sourceMappingURL=index.ac615689.js.map
