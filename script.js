const API_KEY = "499d03534f224e8890dcd1f95376001c";
const url = "https://newsapi.org/v2/everything?q=";

async function fetchData(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    return data;
}

//menu btn
let mobilemenu = document.querySelector(".mobile")
let menuBtn = document.querySelector(".menuBtn")
let menuBtnDisplay = true;

menuBtn.addEventListener("click",()=>{
    mobilemenu.classList.toggle("hidden")
})


function renderMain(arr) {
    let mainHTML = '';
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].urlToImage) {
            const isSaved = isArticleSaved(arr[i].title); // Check if the article is saved
            const bookmarkIconClass = isSaved ? "fa-solid" : "fa-regular"; // Determine the bookmark icon class based on saved status
            const articleId = generateArticleId(arr[i]); // Generate a unique identifier for the article
            mainHTML += `
                <div class="card" data-id="${articleId}">
                    <a href=${arr[i].url}>
                        <img src=${arr[i].urlToImage} lazy="loading" />
                        <h4>${arr[i].title}</h4>
                        <div class="publishbyDate">
                            <p>${arr[i].source.name}</p>
                            <span>•</span>
                            <p>${new Date(arr[i].publishedAt).toLocaleDateString()}</p>
                        </div>
                        <div class="desc">
                            ${arr[i].description}
                        </div>
                    </a>
                    <div class="icons">
                        <i class="fa ${bookmarkIconClass} fa-bookmark" onclick="toggleBookmark(this)"></i>
                        <i class="fa-solid fa-share-nodes"></i>
                    </div>
                </div>`;
        }
    }
    document.querySelector("main").innerHTML = mainHTML;
}

// Function to check if an article with a given title is saved
function isArticleSaved(title) {
    const savedArticles = JSON.parse(localStorage.getItem("savedArticles")) || {};
    return savedArticles.hasOwnProperty(title);
}

// Modify the toggleBookmark function to save the article
function toggleBookmark(bookmarkIcon) {
  bookmarkIcon.classList.toggle("fa-regular");
  bookmarkIcon.classList.toggle("fa-solid");

  const articleId = bookmarkIcon.closest(".card").dataset.id; // Assuming each article has a unique identifier
  let savedArticles = JSON.parse(localStorage.getItem("savedArticles")) || {};

  if (bookmarkIcon.classList.contains("fa-solid")) {
    savedArticles[articleId] = true;
  } else {
    delete savedArticles[articleId];
  }

  localStorage.setItem("savedArticles", JSON.stringify(savedArticles));
}

// Call renderMain when the page loads
window.addEventListener("load", () => {
    fetchData("all").then(data => renderMain(data.articles));
});


const searchBtn = document.getElementById("searchForm")
const searchBtnMobile = document.getElementById("searchFormMobile")
const searchInputMobile = document.getElementById("searchInputMobile") 
const searchInput = document.getElementById("searchInput")

searchBtn.addEventListener("submit",async(e)=>{
    e.preventDefault()
    console.log(searchInput.value)

    const data = await fetchData(searchInput.value)
    renderMain(data.articles)

})
searchBtnMobile.addEventListener("submit",async(e)=>{
    e.preventDefault()
    const data = await fetchData(searchInputMobile.value)
    renderMain(data.articles)
})


async function Search(query) {
  // Display "Searching..." message while fetching data
  document.querySelector("main").innerHTML = "<p>Searching...</p>";

  // Fetch data based on the query
  const data = await fetchData(query);

  // Render the fetched articles
  renderMain(data.articles);
}

function generateArticleId(article) {
    return article.title.replace(/\s+/g, '-').toLowerCase();
}
