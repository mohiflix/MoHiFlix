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

        detailsContainer.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
            <div class="info">
                <h1>${movie.title || movie.name}</h1>
                <p>⭐ ${movie.vote_average.toFixed(1)} | ${movie.original_language.toUpperCase()}</p>
                <p>${movie.overview}</p>
                <div class="player-wrapper">
                    <iframe id="videoIframe" src="https://vidsrc.me/embed/${type}?tmdb=${movie.id}" width="100%" height="450px" frameborder="0" allowfullscreen></iframe>
                </div>
                <p style="color:#e50914; font-size:12px; margin-top:10px;">💡 Tip: Use the 'Gear' icon in the player to change audio language (Hindi/English).</p>
            </div>
        `;

        if (type === 'tv') {
            epSelector.style.display = 'block';
            setupTVSelectors(movie.number_of_seasons);
        }
        fetchRelated();
    } catch (e) { console.error(e); }
}

function setupTVSelectors(totalSeasons) {
    const sSelect = document.getElementById('seasonNum');
    const eSelect = document.getElementById('episodeNum');
    
    sSelect.innerHTML = '';
    for (let i = 1; i <= totalSeasons; i++) {
        let opt = document.createElement('option');
        opt.value = i; opt.text = `Season ${i}`;
        sSelect.add(opt);
    }

    // Season change hole episode dropdown update hobe
    const updateEpisodes = () => {
        eSelect.innerHTML = '';
        for (let i = 1; i <= 30; i++) { // Default max 30 eps
            let opt = document.createElement('option');
            opt.value = i; opt.text = `Episode ${i}`;
            eSelect.add(opt);
        }
    };

    updateEpisodes();
    sSelect.onchange = updateEpisodes;

    document.getElementById('updatePlayer').onclick = () => {
        document.getElementById('videoIframe').src = `https://vidsrc.me/embed/tv?tmdb=${movieId}&season=${sSelect.value}&episode=${eSelect.value}`;
    };
}

async function fetchRelated() {
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}/recommendations?api_key=${API_KEY}`);
    const data = await res.json();
    relatedContainer.innerHTML = '';
    data.results.slice(0, 8).forEach(item => {
        const div = document.createElement('div');
        div.classList.add('movie-card');
        div.onclick = () => window.location.href = `details.html?id=${item.id}&type=${type}`;
        div.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${item.poster_path}"><h3>${item.title || item.name}</h3>`;
        relatedContainer.appendChild(div);
    });
}
getMovieDetails();
