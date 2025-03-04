const API_KEY = "a7bc1571a322421d9bb9a2c36c4f6396";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("Bangladesh"));

function reload() {
	window.location.reload();
}

async function fetchNews(query) {
	try {
		const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
		if (!res.ok) throw new Error("Failed to fetch news");
		const data = await res.json();
		if (!data.articles || data.articles.length === 0) {
			document.getElementById("card_container").innerHTML = "<p>No news found.</p>";
			return;
		}
		bindData(data.articles);
	} catch (error) {
		console.error("Error:", error);
		document.getElementById("card_container").innerHTML = "<p>Error fetching news.</p>";
	}
}

function bindData(articles) {
	const cardContainer = document.getElementById('card_container');
	const newsCardTemplate = document.getElementById('template_news_card');

	cardContainer.innerHTML = '';

	articles.forEach(article => {
		if (!article.urlToImage) return;
		const cardClone = newsCardTemplate.content.cloneNode(true);
		fillDataInCard(cardClone, article);
		cardContainer.appendChild(cardClone);
	});
}

function fillDataInCard(cardClone, article) {
	cardClone.querySelector('#news-img').src = article.urlToImage || "https://placehold.co/400x200";
	cardClone.querySelector('#news-title').textContent = article.title;
	cardClone.querySelector('#news-desc').textContent = article.description || "No description available.";
	
	const date = new Date(article.publishedAt).toLocaleString('en-US', { timeZone: "Asia/Dhaka" });
	cardClone.querySelector('#news-source').textContent = `${article.source.name} • ${date}`;
	
	cardClone.querySelector(".card").addEventListener("click", () => {
		window.open(article.url, "_blank");
	});
}

let curSelectedNav = null;
function onNavItemClick(id) {
	fetchNews(id);
	curSelectedNav?.classList.remove('active');
	curSelectedNav = document.getElementById(id);
	curSelectedNav.classList.add('active');
}

document.getElementById("search-button").addEventListener('click', () => {
	const query = document.getElementById("search-text").value;
	if (query) fetchNews(query);
});

document.getElementById("search-text").addEventListener("keypress", (event) => {
	if (event.key === "Enter") {
		document.getElementById("search-button").click();
	}
});
