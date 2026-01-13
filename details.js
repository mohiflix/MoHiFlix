const API_KEY = '42ba263cafdf8e88b49b1367b5a06ea7';
const detailsContainer = document.getElementById('movieDetails');
const relatedContainer = document.getElementById('relatedMovies');
const epSelector = document.getElementById('episodeSelector');

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const type = urlParams.get('type') || 'movie';

async function getMovieDetails() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=${API_KEY}`);
        const movie = await res.json();
        document.title = `Watch ${movie.title || movie.name} Online - MoHiFlix`;

        detailsContainer.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}">
            <div class="info">
                <h1>${movie.title || movie.name}</h1>
                <p>⭐ ${movie.vote_average.toFixed(1)} | ${movie.original_language.toUpperCase()} | ${movie.release_date || movie.first_air_date}</p>
                <p class="overview">${movie.overview}</p>
                <div id="playerPlaceholder" style="margin-top: 30px; text-align: center; background: #111; padding: 50px 20px; border-radius: 10px; border: 1px solid #333;">
                    <button id="watchBtn" style="background: #e50914; color: white; border: none; padding: 15px 40px; border-radius: 50px; cursor: pointer; font-weight: bold; font-size: 20px; box-shadow: 0 5px 20px rgba(229, 9, 20, 0.4); transition: 0.3s;">
                        ▶ Play Hindi Dubbed (Auto)
                    </button>
                </div>
                <div id="videoContainer" style="display: none; margin-top: 20px; position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; background: #000;">
                    <iframe id="videoIframe" src="" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
        `;

        document.getElementById('watchBtn').onclick = async function() {
            startPlayer();
        };

        if (type === 'tv') setupTVSelector(movie.number_of_seasons);
    } catch (error) { console.error(error); }
}

async function startPlayer() {
    const iframe = document.getElementById('videoIframe');
    const placeholder = document.getElementById('playerPlaceholder');
    const videoContainer = document.getElementById('videoContainer');
    
    // Check our Auto-Scraped Database first
    try {
        const dbRes = await fetch('movies_db.json');
        const dbData = await dbRes.json();
        const manualLink = dbData.find(m => m.tmdb_id == movieId);

        placeholder.style.display = 'none';
        videoContainer.style.display = 'block';

        if (manualLink) {
            iframe.src = manualLink.stream_link; // Playing SouthFreak Style Link
        } else {
            iframe.src = `https://vidsrc.pro/embed/${type}/${movieId}`; // Fallback to Scraper API
        }
    } catch (e) {
        iframe.src = `https://vidsrc.pro/embed/${type}/${movieId}`;
    }
}

// Global functions for buttons
window.changeServer = function(server) {
    const iframe = document.getElementById('videoIframe');
    if(server === 'pro') iframe.src = `https://vidsrc.pro/embed/${type}/${movieId}`;
    if(server === 'vidsrc') iframe.src = `https://vidsrc.me/embed/${type}?tmdb=${movieId}`;
}

getMovieDetails();
// Add Server Buttons
setTimeout(() => {
    const info = document.querySelector('.info');
    const div = document.createElement('div');
    div.style.marginTop = "20px";
    div.innerHTML = `
        <button onclick="changeServer('pro')" style="background:#333;color:#fff;padding:8px;border:none;margin-right:5px;cursor:pointer">Server 1 (Hindi)</button>
        <button onclick="changeServer('vidsrc')" style="background:#333;color:#fff;padding:8px;border:none;cursor:pointer">Server 2 (English)</button>
    `;
    info.appendChild(div);
}, 2000);
