const API_KEY = '42ba263cafdf8e88b49b1367b5a06ea7';
const detailsContainer = document.getElementById('movieDetails');
const epSelector = document.getElementById('episodeSelector');
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const type = urlParams.get('type') || 'movie';

async function getMovieDetails() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=${API_KEY}`);
        const movie = await res.json();

        detailsContainer.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
            <div class="info">
                <h1>${movie.title || movie.name}</h1>
                <p>⭐ ${movie.vote_average.toFixed(1)} | ${movie.original_language.toUpperCase()}</p>
                <p>${movie.overview}</p>
                
                <div class="player-wrapper">
                    <iframe id="mainPlayer" src="https://vidsrc.me/embed/${type}?tmdb=${movieId}" width="100%" height="450px" frameborder="0" allowfullscreen></iframe>
                </div>

                <div class="server-options" style="margin-top:15px; display:flex; gap:10px;">
                    <button onclick="changeServer('vidsrc')" style="background:#e50914; color:white; padding:10px; border:none; cursor:pointer; border-radius:5px; font-weight:bold;">Server 1 (Multi)</button>
                    <button onclick="changeServer('vidsrc.to')" style="background:#2980b9; color:white; padding:10px; border:none; cursor:pointer; border-radius:5px; font-weight:bold;">Server 2 (Hindi)</button>
                </div>

                <div style="background:#1a1a1a; padding:15px; border-radius:8px; margin-top:15px; border:1px solid #f1c40f;">
                    <p style="color:#f1c40f; font-size:13px; margin:0;">
                        <b>Hindi Dubbing Guide:</b> Select <b>Server 2</b> for auto-Hindi. 
                        In Server 1, click <b>Settings (Gear)</b> inside player > <b>Audio</b> > <b>Hindi</b>.
                    </p>
                </div>
            </div>
        `;

        if (type === 'tv') {
            epSelector.style.display = 'block';
            setupTVSelectors(movie.seasons);
        }
    } catch (e) { console.error(e); }
}

window.changeServer = (server) => {
    const player = document.getElementById('mainPlayer');
    player.src = server === 'vidsrc' 
        ? `https://vidsrc.me/embed/${type}?tmdb=${movieId}`
        : `https://vidsrc.to/embed/${type}/${movieId}`;
};

async function setupTVSelectors(seasons) {
    const sSelect = document.getElementById('seasonNum');
    const eSelect = document.getElementById('episodeNum');
    sSelect.innerHTML = seasons.filter(s => s.season_number > 0).map(s => `<option value="${s.season_number}">Season ${s.season_number}</option>`).join('');

    const updateEpisodes = async () => {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${movieId}/season/${sSelect.value}?api_key=${API_KEY}`);
        const data = await res.json();
        eSelect.innerHTML = data.episodes.map(ep => `<option value="${ep.episode_number}">Episode ${ep.episode_number}: ${ep.name}</option>`).join('');
    };

    sSelect.onchange = updateEpisodes;
    await updateEpisodes();

    document.getElementById('updatePlayer').onclick = () => {
        document.getElementById('mainPlayer').src = `https://vidsrc.me/embed/tv?tmdb=${movieId}&season=${sSelect.value}&episode=${eSelect.value}`;
    };
}
getMovieDetails();
