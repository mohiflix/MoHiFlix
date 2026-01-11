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
                <p>⭐ ${movie.vote_average.toFixed(1)} | ${movie.original_language.toUpperCase()}</p>
                <p>${movie.overview}</p>
                <div class="player-wrapper">
                    <iframe id="videoIframe" src="https://vidsrc.me/embed/${type}?tmdb=${movie.id}" width="100%" height="450px" frameborder="0" allowfullscreen></iframe>
                </div>
                
                <div style="margin-top: 20px;">
                    <button id="downloadBtn" style="background: #e50914; color: white; border: none; padding: 12px 25px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        📥 Download Full HD
                    </button>
                </div>

                <p style="color:#e50914; font-size:12px; margin-top:10px;">Note: If player doesn't load, try refreshing the page.</p>
            </div>
        `;

        // ডাউনলোড বাটনটি সক্রিয় করা
        setupDownloadBtn();

        if (type === 'tv') {
            setupTVSelector(movie.number_of_seasons);
        }
    } catch (error) {
        console.error('Error fetching details:', error);
    }
}

// ডাউনলোড ফাংশন
function setupDownloadBtn() {
    const downloadBtn = document.getElementById('downloadBtn');
    
    downloadBtn.addEventListener('click', () => {
        let finalDownloadUrl = "";
        
        if (type === 'movie') {
            // মুভির জন্য ডাউনলোড গেটওয়ে
            finalDownloadUrl = `https://vidsrc.xyz/embed/movie?tmdb=${movieId}`;
        } else {
            // টিভির জন্য সিলেক্ট করা সিজন ও এপিসোড নেওয়া
            const sNum = document.getElementById('seasonNum').value || 1;
            const eNum = document.getElementById('episodeNum').value || 1;
            finalDownloadUrl = `https://vidsrc.xyz/embed/tv?tmdb=${movieId}&season=${sNum}&episode=${eNum}`;
        }
        
        // এখানে সরাসরি প্লেয়ার লিঙ্কে পাঠিয়ে দেওয়া হচ্ছে যেখানে 'Download' অপশন থাকে
        window.open(finalDownloadUrl, '_blank');
    });
}

async function setupTVSelector(seasons) {
    epSelector.style.display = 'block';
    const sSelect = document.getElementById('seasonNum');
    const eSelect = document.getElementById('episodeNum');

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
