const API_KEY = '42ba263cafdf8e88b49b1367b5a06ea7';
const detailsContainer = document.getElementById('movieDetails');
const relatedContainer = document.getElementById('relatedMovies');

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

async function getMovieDetails() {
    if (!movieId) return;

    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
        const movie = await res.json();

        detailsContainer.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="info">
                <h1>${movie.title}</h1>
                <p style="color: #f1c40f; font-weight: bold;">⭐ ${movie.vote_average.toFixed(1)} / 10</p>
                <p><strong>Release Date:</strong> ${movie.release_date}</p>
                <p><strong>Genres:</strong> ${movie.genres.map(g => g.name).join(', ')}</p>
                <h3>Overview:</h3>
                <p>${movie.overview}</p>
                
                <div class="download-section">
                    <h3>Watch / Download:</h3>
                    <a href="https://vidsrc.me/embed/movie?tmdb=${movie.id}" target="_blank" class="download-btn">Watch Now (Server 1)</a>
                    <a href="https://vidsrc.to/embed/movie/${movie.id}" target="_blank" class="download-btn" style="background:#2980b9">Watch Now (Server 2)</a>
                </div>
            </div>
        `;
        
        // Related movies fetch korbo
        fetchRelatedMovies();
    } catch (error) {
        detailsContainer.innerHTML = "<h2>Something went wrong.</h2>";
    }
}

async function fetchRelatedMovies() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${API_KEY}`);
        const data = await res.json();
        const related = data.results.slice(0, 10); // 10 ti movie dekhabo

        relatedContainer.innerHTML = '';
        related.forEach(movie => {
            if (!movie.poster_path) return;
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie-card');
            movieDiv.onclick = () => {
                window.location.href = `details.html?id=${movie.id}`;
            };
            movieDiv.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>⭐ ${movie.vote_average.toFixed(1)}</p>
            `;
            relatedContainer.appendChild(movieDiv);
        });
    } catch (error) {
        console.error("Related movies load hoyni.");
    }
}

getMovieDetails();
