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

        // SEO: Dynamic Title update
        document.title = `Watch ${movie.title || movie.name} Online - MoHiFlix`;

        detailsContainer.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}">
            <div class="info">
                <h1>${movie.title || movie.name}</h1>
                <p>⭐ ${movie.vote_average.toFixed(1)} | ${movie.original_language.toUpperCase()} | ${movie.release_date || movie.first_air_date}</p>
                <p class="overview">${movie.overview}</p>
                
                <div class="player-wrapper" style="margin-top: 20px; position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; background: #000;">
                    <iframe id="videoIframe" 
                        src="https://vidsrc.me/embed/${type}?tmdb=${movie.id}" 
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                        frameborder="0" allowfullscreen>
                    </iframe>
                </div>
                
                <p style="color:#e50914; font-size:12px; margin-top:15px; text-align: center;">
                    💡 Tip: If the player doesn't load, please refresh the page.
                </p>
            </div>
        `;

        if (type === 'tv') {
            setupTVSelector(movie.number_of_seasons);
        }
    } catch (error) {
        console.error('Error fetching details:', error);
        detailsContainer.innerHTML = "<p style='color:white; text-align:center;'>Failed to load movie details. Please try again later.</p>";
    }
}

async function setupTVSelector(seasons) {
    epSelector.style.display = 'block';
    const sSelect = document.getElementById('seasonNum');
    const eSelect = document.getElementById('episodeNum');

    sSelect.innerHTML = ''; // Clear previous options
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
        const sValue = sSelect.value;
        const eValue = eSelect.value;
        document.getElementById('videoIframe').src = `https://vidsrc.me/embed/tv?tmdb=${movieId}&season=${sValue}&episode=${eValue}`;
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll back to player
    };
}

async function fetchRelated() {
    try {
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
    } catch (error) {
        console.error('Error fetching related movies:', error);
    }
}

getMovieDetails();
fetchRelated();
