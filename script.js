const API_KEY = '42ba263cafdf8e88b49b1367b5a06ea7';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const hindiDubbedContainer = document.getElementById('hindiDubbed');
const movieContainer = document.getElementById('movies');
const searchInput = document.getElementById('search');
const genreSelect = document.getElementById('genreSelect');
const loadMoreBtn = document.getElementById('loadMore');

let currentPage = 1;
let currentType = 'movie'; // Default type

// 1. Hindi Dubbed Hollywood fetch korar function
async function fetchHindiDubbed() {
    // Discovery logic: Original language English (en), but released in India (IN)
    // Bollywood ba Indian popular dubbed Hollywood movies gulo ekhane paben.
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=en&region=IN&sort_by=popularity.desc&page=1`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderHindiRow(data.results.slice(0, 10)); // Top 10 result dekhabo horizontal row-te
    } catch (e) { 
        console.error("Hindi Dubbed section error:", e); 
    }
}

function renderHindiRow(movies) {
    hindiDubbedContainer.innerHTML = '';
    movies.forEach(movie => {
        if (!movie.poster_path) return;
        const div = document.createElement('div');
        div.classList.add('movie-card');
        div.onclick = () => window.location.href = `details.html?id=${movie.id}&type=movie`;
        div.innerHTML = `
            <span class="hindi-badge">HINDI</span>
            <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        `;
        hindiDubbedContainer.appendChild(div);
    });
}

// 2. Main content (All Content) fetch korar function
async function fetchContent(isNew = true) {
    if (isNew) {
        currentPage = 1;
        movieContainer.innerHTML = '';
    }

    const query = searchInput.value.trim();
    const genre = genreSelect.value;
    
    let url;
    if (query) {
        // Search mode: User ja search korbe (Indian priority-te)
        url = `${BASE_URL}/search/${currentType}?api_key=${API_KEY}&query=${query}&page=${currentPage}&region=IN`;
    } else {
        // Normal mode: Popular movies/TV shows
        url = `${BASE_URL}/discover/${currentType}?api_key=${API_KEY}&page=${currentPage}&region=IN&sort_by=popularity.desc`;
        if (genre) url += `&with_genres=${genre}`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();
        renderMainContent(data.results);
    } catch (e) { 
        console.error("Main content error:", e); 
    }
}

function renderMainContent(items) {
    items.forEach(item => {
        if (!item.poster_path) return;
        const div = document.createElement('div');
        div.classList.add('movie-card');
        div.onclick = () => window.location.href = `details.html?id=${item.id}&type=${currentType}`;
        
        const title = item.title || item.name;
        const typeBadge = currentType === 'movie' ? 'MOVIE' : 'TV';
        
        div.innerHTML = `
            <span class="type-badge">${typeBadge}</span>
            <img src="${IMG_URL + item.poster_path}" alt="${title}">
            <h3>${title}</h3>
            <p>⭐ ${item.vote_average.toFixed(1)}</p>
        `;
        movieContainer.appendChild(div);
    });
}

// 3. Type change (Movie to TV) function
window.changeType = (type) => {
    currentType = type;
    document.getElementById('movieBtn').classList.toggle('active', type === 'movie');
    document.getElementById('tvBtn').classList.toggle('active', type === 'tv');
    fetchContent(true);
};

// 4. Event Listeners
document.getElementById('searchBtn').onclick = () => fetchContent(true);

searchInput.onkeypress = (e) => {
    if (e.key === 'Enter') fetchContent(true);
};

genreSelect.onchange = () => fetchContent(true);

loadMoreBtn.onclick = () => {
    currentPage++;
    fetchContent(false);
};

// 5. Initial Load
window.onload = () => {
    fetchHindiDubbed(); // Top horizontal row load hobe
    fetchContent();      // Main grid load hobe
};
