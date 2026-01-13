const API_KEY = '42ba263cafdf8e88b49b1367b5a06ea7';
const detailsContainer = document.getElementById('movieDetails');
const downloadSection = document.getElementById('downloadSection');
const screenshotArea = document.getElementById('screenshotArea');
const relatedContainer = document.getElementById('relatedMovies');

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const type = urlParams.get('type') || 'movie';

async function getMovieDetails() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=${API_KEY}`);
        const movie = await res.json();
        
        const movieTitle = movie.title || movie.name;
        const year = (movie.release_date || movie.first_air_date || "").split("-")[0];
        
        // SouthFreak style clean search query
        const cleanQuery = encodeURIComponent(movieTitle.replace(/[^a-zA-Z0-9 ]/g, ""));

        document.title = `${movieTitle} (${year}) Download - MoHiFlix`;

        detailsContainer.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movieTitle}">
            <div class="info">
                <h1>${movieTitle} (${year})</h1>
                <p>⭐ ${movie.vote_average.toFixed(1)} | ${movie.original_language.toUpperCase()} | ${year}</p>
                <p class="overview">${movie.overview}</p>
            </div>
        `;

        // Download Links Section
        downloadSection.innerHTML = `
            <div class="download-container">
                <h2 style="color: #e50914; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px;">Download Options</h2>
                
                <div class="server-card">
                    <h4>SouthFreak Direct Search (Recommended)</h4>
                    <a href="https://www.google.com/search?q=site:southfreak.shop+${cleanQuery}+${year}" target="_blank" class="dl-link">GET LINKS</a>
                </div>

                <div class="server-card">
                    <h4>Server 1: GDrive / High Speed</h4>
                    <a href="https://gdflix.cfd/search/${cleanQuery}" target="_blank" class="dl-link">DOWNLOAD</a>
                </div>

                <div class="server-card">
                    <h4>Server 2: Hindi Dubbed / Multi-Audio</h4>
                    <a href="https://vegamovies.to/?s=${cleanQuery}" target="_blank" class="dl-link">DOWNLOAD</a>
                </div>

                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 15px;">
                    Note: If a link is empty, use the 'SouthFreak Direct Search' button.
                </p>
            </div>
        `;

        loadScreenshots();
        loadRelated();
    } catch (error) {
        console.error("Error:", error);
    }
}

async function loadScreenshots() {
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}/images?api_key=${API_KEY}`);
    const data = await res.json();
    if (data.backdrops && data.backdrops.length > 0) {
        let html = `<h2 style="color: #e50914; margin: 20px 0;">Movie Screenshots</h2><div class="screenshot-box">`;
        data.backdrops.slice(0, 4).forEach(img => {
            html += `<img src="https://image.tmdb.org/t/p/w500${img.file_path}">`;
        });
        html += `</div>`;
        screenshotArea.innerHTML = html;
    }
}

async function loadRelated() {
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
