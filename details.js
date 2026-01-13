const API_KEY = '42ba263cafdf8e88b49b1367b5a06ea7';
const detailsContainer = document.getElementById('movieDetails');
const relatedContainer = document.getElementById('relatedMovies');
const screenshotArea = document.getElementById('screenshotArea');

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const type = urlParams.get('type') || 'movie';

async function getMovieDetails() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=${API_KEY}`);
        const movie = await res.json();
        
        const title = movie.title || movie.name;
        const year = (movie.release_date || movie.first_air_date || "").split("-")[0];
        const searchQuery = encodeURIComponent(`${title} ${year}`);

        document.title = `${title} (${year}) Download - MoHiFlix`;

        detailsContainer.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${title}">
            <div class="info">
                <h1>${title} (${year})</h1>
                <p>⭐ Rating: ${movie.vote_average.toFixed(1)} | Language: ${movie.original_language.toUpperCase()}</p>
                <p class="overview">${movie.overview}</p>
                
                <div class="download-box">
                    <h3 style="color: #e50914; text-align: center; margin-bottom: 20px;">📥 DOWNLOAD LINKS (AUTO)</h3>
                    
                    <a href="https://www.google.com/search?q=site:southfreak.shop+${searchQuery}" target="_blank" class="dl-btn btn-orange">
                        🔍 Search on SouthFreak
                    </a>

                    <a href="https://vegamovies.to/?s=${searchQuery}" target="_blank" class="dl-btn btn-green">
                        🚀 Server 1: Vegamovies (Multi-Audio)
                    </a>

                    <a href="https://gdflix.cfd/search/${searchQuery}" target="_blank" class="dl-btn btn-blue">
                        🔗 Server 2: GDrive / High Speed
                    </a>

                    <p style="color: #888; font-size: 12px; margin-top: 15px; text-align: center;">
                        * Buttons open search results for this movie on top sites.
                    </p>
                </div>
            </div>
        `;

        fetchScreenshots();
        fetchRelated();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchScreenshots() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}/images?api_key=${API_KEY}`);
        const data = await res.json();
        
        if (data.backdrops && data.backdrops.length > 0) {
            let html = `<h2 style="color: #e50914; border-bottom: 1px solid #333; padding-bottom: 10px;">📷 Movie Screenshots</h2>`;
            html += `<div class="screenshot-grid">`;
            data.backdrops.slice(0, 6).forEach(img => {
                html += `<img src="https://image.tmdb.org/t/p/w500${img.file_path}" alt="Screenshot">`;
            });
            html += `</div>`;
            screenshotArea.innerHTML = html;
        }
    } catch (e) { console.log("Screenshots error"); }
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

getMovieDetails();
