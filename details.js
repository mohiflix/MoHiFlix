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
                        ▶ Play in Hindi / Multi-Audio
                    </button>
                    <p style="color: #888; margin-top: 15px; font-size: 14px;">Server 1: Best for Hindi Dubbed (SouthFreak/Vega Style)</p>
                </div>

                <div id="videoContainer" style="display: none; margin-top: 20px; position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; background: #000;">
                    <iframe id="videoIframe" src="" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
        `;

        document.getElementById('watchBtn').onclick = function() {
            changeServer('pro_server'); 
        };

        if (type === 'tv') {
            setupTVSelector(movie.number_of_seasons);
        }
    } catch (error) {
        console.error('Error fetching details:', error);
    }
}

async function setupTVSelector(seasons) {
    epSelector.style.display = 'block';
    const sSelect = document.getElementById('seasonNum');
    const eSelect = document.getElementById('episodeNum');

    sSelect.innerHTML = ''; 
    for (let i = 1; i <= seasons; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.text = `Season ${i}`;
        sSelect.add(opt);
    }

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
    await updateEpisodes();

    document.getElementById('updatePlayer').onclick = () => {
        changeServer('pro_server');
        window.scrollTo({ top: 300, behavior: 'smooth' });
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
        div.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" onerror="this.src='https://via.placeholder.com/500x750?text=No+Image'">
            <div class="card-info">
                <h3>${item.title || item.name}</h3>
                <p>⭐ ${item.vote_average.toFixed(1)}</p>
            </div>
        `;
        relatedContainer.appendChild(div);
    });
}

function addAlternativeServers() {
    const infoDiv = document.querySelector('.info');
    if (!infoDiv) return;

    const serverDiv = document.createElement('div');
    serverDiv.style.marginTop = "25px";
    serverDiv.innerHTML = `
        <h4 style="color: #e50914; margin-bottom: 12px; font-size: 16px;">Try Other Servers:</h4>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button onclick="changeServer('pro_server')" style="background: #e50914; color: white; border: none; padding: 10px 18px; border-radius: 5px; cursor: pointer; font-weight: bold;">Server 1 (Hindi/Vega)</button>
            <button onclick="changeServer('vidsrc')" style="background: #333; color: white; border: none; padding: 10px 18px; border-radius: 5px; cursor: pointer;">Server 2 (Multi-Lang)</button>
            <button onclick="changeServer('2embed')" style="background: #333; color: white; border: none; padding: 10px 18px; border-radius: 5px; cursor: pointer;">Server 3 (Eng)</button>
        </div>
    `;
    infoDiv.appendChild(serverDiv);
}

window.changeServer = function(serverType) {
    const iframe = document.getElementById('videoIframe');
    const placeholder = document.getElementById('playerPlaceholder');
    const videoContainer = document.getElementById('videoContainer');
    const sNum = document.getElementById('seasonNum') ? document.getElementById('seasonNum').value : 1;
    const eNum = document.getElementById('episodeNum') ? document.getElementById('episodeNum').value : 1;
    
    placeholder.style.display = 'none';
    videoContainer.style.display = 'block';

    if (serverType === 'pro_server') {
        // This is the SouthFreak/Vega style scrapper
        iframe.src = type === 'movie' 
            ? `https://vidsrc.pro/embed/movie/${movieId}` 
            : `https://vidsrc.pro/embed/tv/${movieId}/${sNum}/${eNum}`;
    } else if (serverType === 'vidsrc') {
        iframe.src = `https://vidsrc.me/embed/${type}?tmdb=${movieId}${type === 'tv' ? `&season=${sNum}&episode=${eNum}` : ''}`;
    } else if (serverType === '2embed') {
        iframe.src = type === 'movie' 
            ? `https://www.2embed.cc/embed/${movieId}` 
            : `https://www.2embed.cc/embedtv/${movieId}&s=${sNum}&e=${eNum}`;
    }
};

getMovieDetails();
fetchRelated();
setTimeout(addAlternativeServers, 2000);
