const API_KEY = '42ba24683526610738d2b904d9e79888';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const type = urlParams.get('type');

document.addEventListener('DOMContentLoaded', () => {
    fetchMovieDetails();
    fetchRecommendations();
});

async function fetchMovieDetails() {
    const res = await fetch(`${BASE_URL}/${type}/${movieId}?api_key=${API_KEY}`);
    const movie = await res.json();

    const container = document.getElementById('movieDetails');
    const poster = movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/300x450?text=No+Poster';
    
    container.innerHTML = `
        <img src="${poster}" alt="${movie.title || movie.name}">
        <div class="info">
            <h1>${movie.title || movie.name}</h1>
            <p class="overview">${movie.overview}</p>
            <p><strong>Release Date:</strong> ${movie.release_date || movie.first_air_date}</p>
            <p><strong>Rating:</strong> ⭐ ${movie.vote_average}</p>
        </div>
    `;

    if (type === 'tv') {
        setupTVShow(movie);
    } else {
        loadPlayer(1, 1);
    }
}

function loadPlayer(season, episode) {
    const playerContainer = document.getElementById('playerContainer');
    let embedUrl = "";

    if (type === 'movie') {
        embedUrl = `https://vidsrc.me/embed/movie?tmdb=${movieId}`;
    } else {
        embedUrl = `https://vidsrc.me/embed/tv?tmdb=${movieId}&season=${season}&episode=${episode}`;
    }

    playerContainer.innerHTML = `<iframe src="${embedUrl}" allowfullscreen></iframe>`;
}

async function setupTVShow(movie) {
    const epBox = document.getElementById('episodeSelector');
    epBox.style.display = 'block';

    const seasonSelect = document.getElementById('seasonSelect');
    const episodeSelect = document.getElementById('episodeSelect');

    for (let i = 1; i <= movie.number_of_seasons; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.text = `Season ${i}`;
        seasonSelect.appendChild(opt);
    }

    async function updateEpisodes() {
        const sNum = seasonSelect.value;
        const res = await fetch(`${BASE_URL}/tv/${movieId}/season/${sNum}?api_key=${API_KEY}`);
        const sData = await res.json();

        episodeSelect.innerHTML = '';
        sData.episodes.forEach(ep => {
            let opt = document.createElement('option');
            opt.value = ep.episode_number;
            opt.text = `Episode ${ep.episode_number}: ${ep.name}`;
            episodeSelect.appendChild(opt);
        });
        loadPlayer(sNum, episodeSelect.value);
    }

    seasonSelect.onchange = updateEpisodes;
    episodeSelect.onchange = () => loadPlayer(seasonSelect.value, episodeSelect.value);

    updateEpisodes();
}

async function fetchRecommendations() {
    // Adding regional language preference to recommendations too
    const res = await fetch(`${BASE_URL}/${type}/${movieId}/recommendations?api_key=${API_KEY}&with_original_language=hi|bn|ta|te`);
    const data = await res.json();
    const container = document.getElementById('relatedMovies');

    data.results.slice(0, 12).forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.onclick = () => window.location.href = `details.html?id=${movie.id}&type=${type}`;
        
        const poster = movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/180x270?text=No+Poster';
        card.innerHTML = `
            <img src="${poster}" alt="${movie.title || movie.name}">
            <h3>${movie.title || movie.name}</h3>
        `;
        container.appendChild(card);
    });
}
