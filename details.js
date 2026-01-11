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

        // SEO Title
        document.title = `Watch ${movie.title || movie.name} - MoHiFlix`;

        detailsContainer.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}">
            <div class="info">
                <h1>${movie.title || movie.name}</h1>
                <p>⭐ ${movie.vote_average.toFixed(1)} | ${movie.original_language.toUpperCase()}</p>
                <p>${movie.overview}</p>
                
                <div class="player-wrapper">
                    <iframe id="videoIframe" src="https://vidsrc.me/embed/${type}?tmdb=${movie.id}" width="100%" height="450px" frameborder="0" allowfullscreen></iframe>
                </div>

                <div style="margin-top: 30px; background: #111; padding: 25px; border: 1px solid #e50914; border-radius: 12px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <h3 style="color: #fff; margin-bottom: 15px; font-size: 20px;">📥 Download Center</h3>
                    <p style="color: #bbb; font-size: 13px; margin-bottom: 20px;">If one server doesn't work, please try another mirror link.</p>
                    
                    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                        <button id="dlServer1" style="background: #e50914; color: white; border: none; padding: 12px 25px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.3s;">🚀 Server 1 (HD)</button>
                        <button id="dlServer2" style="background: #333; color: white; border: none; padding: 12px 25px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.3s;">📡 Server 2 (Mirror)</button>
                    </div>

                    <div style="margin-top: 20px; border-top: 1px solid #222; padding-top: 15px;">
                        <p style="color: #888; font-size: 11px; line-height: 1.6;">
                            <b>Android Users:</b> Use <b>ADM</b> or <b>1DM</b> Browser for 1-click download.<br>
                            <b>PC Users:</b> Use <b>IDM</b> to capture video link automatically.
                        </p>
                    </div>
                </div>
            </div>
        `;

        setupDownloadSystem();

        if (type === 'tv') {
            setupTVSelector(movie.number_of_seasons);
        }
    } catch (error) {
        console.error('Error fetching details:', error);
    }
}

function setupDownloadSystem() {
    const s1 = document.getElementById('dlServer1');
    const s2 = document.getElementById('dlServer2');

    const openLink = (baseUrl) => {
        let finalUrl = "";
        if (type === 'movie') {
            finalUrl = `${baseUrl}/movie/${movieId}`;
        } else {
            const s = document.getElementById('seasonNum').value || 1;
            const e = document.getElementById('episodeNum').value || 1;
            finalUrl = `${baseUrl}/tv/${movieId}/${s}/${e}`;
        }
        window.open(finalUrl, '_blank');
    };

    // Server 1 uses a modern gateway
    s1.onclick = () => openLink('https://vidsrc.pm/video');
    
    // Server 2 uses a different stable gateway
    s2.onclick = () => {
        let altUrl = (type === 'movie') 
            ? `https://vidsrc.xyz/embed/movie?tmdb=${movieId}` 
            : `https://vidsrc.xyz/embed/tv?tmdb=${movieId}&season=${document.getElementById('seasonNum').value || 1}&episode=${document.getElementById('episodeNum').value || 1}`;
        window.open(altUrl, '_blank');
    };
}

// TV Selector and Related Content (Unchanged)
async function setupTVSelector(seasons) {
    epSelector.style.display = 'block';
    const sSelect = document.getElementById('seasonNum');
    const eSelect = document.getElementById('episodeNum');
    for (let i = 1; i <= seasons; i++) {
        let opt = document.createElement('option');
        opt.value = i; opt.text = `Season ${i}`;
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
        div.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${item.poster_path}">
            <div class="card-info">
                <h3>${item.title || item.name}</h3>
                <p>⭐ ${item.vote_average.toFixed(1)}</p>
            </div>
        `;
        relatedContainer.appendChild(div);
    });
}

getMovieDetails();
fetchRelated();
