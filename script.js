const API_KEY = '42ba263cafdf8e88b49b1367b5a06ea7';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const hindiDubbedContainer = document.getElementById('hindiDubbed');
const movieContainer = document.getElementById('movies');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const genreSelect = document.getElementById('genreSelect');
const loadMoreBtn = document.getElementById('loadMore');

let currentPage = 1;
let currentType = 'movie';

// 1. Latest Hindi Dubbed Row (Only for Home Screen)
async function fetchHindiDubbed() {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=en&region=IN&sort_by=popularity.desc&page=1`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderHindiRow(data.results.slice(0, 10));
    } catch (e) { console.error(e); }
}

function renderHindiRow(movies) {
    hindiDubbedContainer.innerHTML = '';
    movies.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('movie-card');
        div.onclick = () => window.location.href = `details.html?id=${movie.id}&type=movie`;
        div.innerHTML = `
            <span class="hindi-badge">HINDI</span>
            <img src="${IMG_URL + movie.poster_path}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        `;
        hindiDubbedContainer.appendChild(div);
    });
}

// 2. Optimized Search & Main Content Loader
async function fetchContent(isNew = true) {
    if (isNew) {
        currentPage = 1;
        movieContainer.innerHTML = '';
    }

    const query = searchInput.value.trim();
    const genre = genreSelect.value;
    
    // Search korle Hindi row hide korbo
    if (query) {
        document.getElementById('hindiDubbed').style.display = 'none';
        document.getElementById('hindiTitle').style.display = 'none';
        document.getElementById('mainTitle').innerText = `Search Results for: ${query}`;
    } else {
        document.getElementById('hindiDubbed').style.display = 'flex';
        document.getElementById('hindiTitle').style.display = 'block';
        document.getElementById('mainTitle').innerText = `All Content`;
    }

    let url = query 
        ? `${BASE_URL}/search/${currentType}?api_key=${API_KEY}&query=${query}&page=${currentPage}`
        : `${BASE_URL}/discover/${currentType}?api_key=${API_KEY}&page=${currentPage}&sort_by=popularity.desc`;
    
    if (!query && genre) url += `&with_genres=${genre}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        renderMainContent(data.results);
    } catch (e) { console.error(e); }
}

function renderMainContent(items) {
    items.forEach(item => {
        if (!item.poster_path) return;
        const div = document.createElement('div');
        div.classList.add('movie-card');
        div.onclick = () => window.location.href = `details.html?id=${item.id}&type=${currentType}`;
        const badge = currentType === 'movie' ? 'MOVIE' : 'TV';
        div.innerHTML = `
            <span class="type-badge">${badge}</span>
            <img src="${IMG_URL + item.poster_path}">
            <h3>${item.title || item.name}</h3>
            <p>⭐ ${item.vote_average.toFixed(1)}</p>
        `;
        movieContainer.appendChild(div);
    });
}

// 3. Event Listeners
searchBtn.onclick = () => fetchContent(true);
searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') fetchContent(true); });
genreSelect.onchange = () => fetchContent(true);
loadMoreBtn.onclick = () => { currentPage++; fetchContent(false); };

window.changeType = (type) => {
    currentType = type;
    document.getElementById('movieBtn').classList.toggle('active', type === 'movie');
    document.getElementById('tvBtn').classList.toggle('active', type === 'tv');
    fetchContent(true);
};

window.onload = () => { fetchHindiDubbed(); fetchContent(); };
