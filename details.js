const API_KEY = '42ba263cafdf8e88b49b1367b5a06ea7';
const detailsContainer = document.getElementById('movieDetails');
const relatedContainer = document.getElementById('relatedMovies');

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const type = urlParams.get('type') || 'movie';

async function getMovieDetails() {
    if (!movieId) return;

    try {
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=${API_KEY}`);
        const movie = await res.json();

        detailsContainer.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}">
            <div class="info">
                <h1>${movie.title || movie.name}</h1>
                <p style="color: #f1c40f; font-weight: bold;">⭐ ${movie.vote_average.toFixed(1)} / 10</p>
                <p><strong>Release:</strong> ${movie.release_date || movie.first_air_date}</p>
                <p><strong>Genre:</strong> ${movie.genres.map(g => g.name).join(', ')}</p>
                <h3>Overview:</h3>
                <p>${movie.overview}</p>
                <div class="download-section">
                    <a href="https://vidsrc.me/embed/${type}?tmdb=${movie.id}" target="_blank" class="download-btn">Watch Server 1</a>
                    <a href="https://vidsrc.to/embed/${type}/${movie.id}" target="_blank" class="download-btn" style="background:#2980b9">Watch Server 2</a>
                </div>
            </div>
        `;
        fetchRelated();
    } catch (e) {
        detailsContainer.innerHTML = "<h2>Failed to load details.</h2>";
    }
}

async function fetchRelated() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}/recommendations?api_key=${API_KEY}`);
        const data = await res.json();
        relatedContainer.innerHTML = '';
        data.results.slice(0, 8).forEach(item => {
            if (!item.poster_path) return;
            const div = document.createElement('div');
            div.classList.add('movie-card');
            div.onclick = () => window.location.href = `details.html?id=${item.id}&type=${type}`;
            div.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${item.poster_path}"><h3>${item.title || item.name}</h3>`;
            relatedContainer.appendChild(div);
        });
    } catch (e) { console.error("Related error"); }
}

getMovieDetails();
