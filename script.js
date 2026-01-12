const API_KEY = '42ba24683526610738d2b904d9e79888';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;
let currentType = 'movie';
let currentGenre = '';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
});

function setType(type) {
    currentType = type;
    currentPage = 1;
    document.getElementById('movieFilter').classList.toggle('active', type === 'movie');
    document.getElementById('tvFilter').classList.toggle('active', type === 'tv');
    fetchMovies();
}

document.getElementById('genreSelect').addEventListener('change', (e) => {
    currentGenre = e.target.value;
    currentPage = 1;
    fetchMovies();
});

document.getElementById('searchBtn').addEventListener('click', () => {
    searchQuery = document.getElementById('search').value;
    currentPage = 1;
    fetchMovies();
});

async function fetchMovies() {
    let url = "";
    
    if (searchQuery) {
        url = `${BASE_URL}/search/${currentType}?api_key=${API_KEY}&query=${searchQuery}&page=${currentPage}`;
    } else {
        // Priority for Hindi (hi), Bengali (bn), Tamil (ta), Telugu (te)
        url = `${BASE_URL}/discover/${currentType}?api_key=${API_KEY}&page=${currentPage}&with_genres=${currentGenre}&with_original_language=hi|bn|ta|te&sort_by=popularity.desc`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();
        displayMovies(data.results, currentPage === 1);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayMovies(movies, clear) {
    const container = document.getElementById('movies');
    if (clear) container.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.onclick = () => {
            window.location.href = `details.html?id=${movie.id}&type=${currentType}`;
        };

        const title = movie.title || movie.name;
        const poster = movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/180x270?text=No+Poster';

        movieCard.innerHTML = `
            <img src="${poster}" alt="${title}">
            <h3>${title}</h3>
        `;
        container.appendChild(movieCard);
    });
}

document.getElementById('loadMore').addEventListener('click', () => {
    currentPage++;
    fetchMovies();
});
