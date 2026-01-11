const API_KEY = '42ba263cafdf8e88b49b1367b5a06ea7';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;
let currentType = 'movie'; 
let currentGenre = '';

const movieContainer = document.getElementById('movies');
const searchInput = document.getElementById('search');
const genreSelect = document.getElementById('genreSelect');
const loadMoreBtn = document.getElementById('loadMore');

async function fetchContent(isNew = true) {
    if (isNew) {
        currentPage = 1;
        movieContainer.innerHTML = '';
    }

    let url = `${BASE_URL}/discover/${currentType}?api_key=${API_KEY}&page=${currentPage}&with_genres=${currentGenre}`;
    
    const query = searchInput.value.trim();
    if (query) {
        url = `${BASE_URL}/search/${currentType}?api_key=${API_KEY}&query=${query}&page=${currentPage}`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();
        renderContent(data.results);
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderContent(items) {
    items.forEach(item => {
        if (!item.poster_path) return;
        const div = document.createElement('div');
        div.classList.add('movie-card');
        
        // Movie ba TV type pathano details page-e
        div.onclick = () => window.location.href = `details.html?id=${item.id}&type=${currentType}`;
        
        div.innerHTML = `
            <img src="${IMG_URL + item.poster_path}">
            <div class="card-info">
                <h3>${item.title || item.name}</h3>
                <p>⭐ ${item.vote_average.toFixed(1)}</p>
            </div>
        `;
        movieContainer.appendChild(div);
    });
}

function changeType(type) {
    currentType = type;
    document.getElementById('movieBtn').classList.toggle('active', type === 'movie');
    document.getElementById('tvBtn').classList.toggle('active', type === 'tv');
    fetchContent();
}

loadMoreBtn.onclick = () => {
    currentPage++;
    fetchContent(false);
};

genreSelect.onchange = (e) => {
    currentGenre = e.target.value;
    fetchContent();
};

document.getElementById('searchBtn').onclick = () => fetchContent();
window.onload = () => fetchContent();
