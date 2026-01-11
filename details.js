const API_KEY = '42ba263cafdf8e88b49b1367b5a06ea7';
const detailsContainer = document.getElementById('movieDetails');
const relatedContainer = document.getElementById('relatedMovies');

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

async function getMovieDetails() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
        const movie = await res.json();

        detailsContainer.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="info">
                <h1>${movie.title}</h1>
                <p class="rating">⭐ ${movie.vote_average.toFixed(1)} / 10</p>
                <p><strong>Release:</strong> ${movie.release_date} | <strong>Runtime:</strong> ${movie.runtime} min</p>
                <p><strong>Genre:</strong> ${movie.genres.map(g => g.name).join(', ')}</p>
                <h3>Overview:</h3>
                <p>${movie.overview}</p>
                <div class="download-section">
                    <a href="https://vidsrc.me/embed/movie?tmdb=${movie.id}" target="_blank" class="download-btn">Play Server 1</a>
                    <a href="https://vidsrc.to/embed/movie/${movie.id}" target="_blank" class="download-btn" style="background:#2980b9">Play Server 2</a>
                </div>
            </div>
        `;
        fetchRelatedMovies();
    } catch (e) { detailsContainer.innerHTML = "<h2>Failed to load details.</h2>"; }
}

async function fetchRelatedMovies() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${API_KEY}`);
        const data = await res.json();
        const related = data.results.slice(0, 8);
        relatedContainer.innerHTML = '';
        related.forEach(movie => {
            if (!movie.poster_path) return;
            const div = document.createElement('div');
            div.classList.add('movie-card');
            div.onclick = () => window.location.href = `details.html?id=${movie.id}`;
            div.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"><h3>${movie.title}</h3>`;
            relatedContainer.appendChild(div);
        });
    } catch (e) { console.error("Related error"); }
}

if(movieId) getMovieDetails();
