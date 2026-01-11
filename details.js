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
                <p style="color:#e50914; font-size:12px; margin-top:10px;">💡 Tip: Player-er 'Gear' icon theke Audio (Hindi/English) change korun jodi thake.</p>
            </div>
        `;

        if (type === 'tv') {
            epSelector.style.display = 'block';
            setupTVSelectors(movie.seasons);
        }
        fetchRelated();
    } catch (e) { console.error(e); }
}

async function setupTVSelectors(seasons) {
    const sSelect = document.getElementById('seasonNum');
    const eSelect = document.getElementById('episodeNum');
    
    sSelect.innerHTML = '';
    // Special/Season 0 bad diye baki shob season add kora
    seasons.filter(s => s.season_number > 0).forEach(s => {
        let opt = document.createElement('option');
        opt.value = s.season_number;
        opt.text = `Season ${s.season_number}`;
        sSelect.add(opt);
    });

    const updateEpisodes = async () => {
        const sNum = sSelect.value;
        const res = await fetch(`https://api.themoviedb.org/3/tv/${movieId}/season/${sNum}?api_key=${API_KEY}`);
        const sData = await res.json();
        
        eSelect.innerHTML = '';
        sData.episodes.forEach(ep => {
            let opt = document.createElement('option');
            opt.value = ep.episode_number;
            opt.text = `Episode ${ep.episode_number}: ${ep.name}`;
            eSelect.add(opt);
        });
    };

    sSelect.onchange = updateEpisodes;
    await updateEpisodes(); // Initial load

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
