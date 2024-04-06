// Function to render saved articles
async function renderSavedArticles() {
  const savedArticles = JSON.parse(localStorage.getItem("savedArticles")) || {};
  const savedNewsElement = document.getElementById("savedNews");
  savedNewsElement.innerHTML = "";

  // Loop through saved articles
  for (const articleId in savedArticles) {
    if (savedArticles.hasOwnProperty(articleId)) {
      try {
        // Fetch the full article details from the API using the articleId
        const articleDetails = await fetchArticleDetails(articleId);

        // Ensure articleDetails is not undefined
        if (articleDetails) {
          // Create HTML for the article card
          const articleCardHTML = `
            <div class="card" data-id="${articleId}">
              <a href="${articleDetails.url}">
                <img src="${articleDetails.urlToImage}" alt="Article Image">
                <h4>${articleDetails.title}</h4>
                <div class="publishbyDate">
                    <p>${articleDetails.source.name}</p>
                    <span>•</span>
                    <p>${new Date(articleDetails.publishedAt).toLocaleDateString()}</p>
                </div>
                <div class="desc">
                ${articleDetails.description}
                </div>
              </a>
              <div class="trash">
              <i class="fas fa-trash-alt" onclick="removeSavedArticle('${articleId}')"></i>
              </div>
            </div>
          `;

          // Append the article card HTML to the saved news element
          savedNewsElement.insertAdjacentHTML("beforeend", articleCardHTML);
        }
      } catch (error) {
        console.error("Error rendering saved articles:", error);
      }
    }
  }
}


//menu btn
let mobilemenu = document.querySelector(".mobile")
let menuBtn = document.querySelector(".menuBtn")
let menuBtnDisplay = true;

menuBtn.addEventListener("click",()=>{
    mobilemenu.classList.toggle("hidden")
})

// Function to fetch full article details from API
async function fetchArticleDetails(articleId) {
  try {
    // Replace 'YOUR_API_KEY' with your actual News API key
    const apiKey = '499d03534f224e8890dcd1f95376001c';
    const response = await fetch(`https://newsapi.org/v2/everything?q=${articleId}&apiKey=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch article details. Status: ${response.status}`);
    }
    const data = await response.json();
    // Return the first article in the response (assuming it contains the detailed information)
    return data.articles[0];
  } catch (error) {
    console.error("Error fetching article details:", error);
    throw error; // Rethrow the error to handle it in the caller
  }
}



// Function to remove a saved article
function removeSavedArticle(articleId) {
  let savedArticles = JSON.parse(localStorage.getItem("savedArticles")) || {};
  delete savedArticles[articleId];
  localStorage.setItem("savedArticles", JSON.stringify(savedArticles));
  renderSavedArticles();
}

// Call renderSavedArticles when the page loads
window.addEventListener("load", renderSavedArticles);
