const API_KEY = '42ba263cafdf8e88b49b1367b5a06ea7';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const movieContainer = document.getElementById('movies');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');

// ১. API theke data niye ashar function
async function fetchMovies(url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

// ২. Screen-e movie dekhano ebong click logic
function renderMovies(movies) {
    movieContainer.innerHTML = '';
    
    if (movies.length === 0) {
        movieContainer.innerHTML = '<h2>No movies found</h2>';
        return;
    }

    movies.forEach(movie => {
        if (!movie.poster_path) return; // Poster na thakle dekhabe na

        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie-card');
        
        movieDiv.onclick = () => {
            window.location.href = `details.html?id=${movie.id}`;
        };

        movieDiv.innerHTML = `
            <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average || 'N/A'}</p>
        `;
        movieContainer.appendChild(movieDiv);
    });
}

// ৩. Search Logic
function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    } else {
        fetchMovies();
    }
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') performSearch();
});

// Prothome trending movie load hobe
window.onload = () => fetchMovies();