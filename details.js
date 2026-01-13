const API_KEY = '42ba263cafdf8e88b49b1367b5a06ea7'; //
const detailsContainer = document.getElementById('movieDetails'); //
const relatedContainer = document.getElementById('relatedMovies'); //

const urlParams = new URLSearchParams(window.location.search); //
const movieId = urlParams.get('id'); //
const type = urlParams.get('type') || 'movie'; //

async function getMovieDetails() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=${API_KEY}`); //
        const movie = await res.json();
        const movieName = movie.title || movie.name;
        const releaseYear = (movie.release_date || movie.first_air_date || "").split("-")[0];

        document.title = `${movieName} (${releaseYear}) Download - MoHiFlix`; //

        // SouthFreak Style UI with Updated Search Logic
        detailsContainer.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movieName}">
            <div class="info">
                <h1>${movieName} (${releaseYear})</h1>
                <p>⭐ Rating: ${movie.vote_average.toFixed(1)} | Language: ${movie.original_language.toUpperCase()} | Release: ${movie.release_date || movie.first_air_date}</p>
                <p class="overview">${movie.overview}</p>
                
                <div id="downloadSection" style="margin-top: 30px; background: #111; padding: 25px; border-radius: 12px; border: 2px solid #e50914;">
                    <h3 style="color: #e50914; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 15px; text-align: center; font-size: 22px;">📥 DOWNLOAD LINKS</h3>
                    
                    <div class="download-buttons" style="display: flex; flex-direction: column; gap: 15px;">
                        
                        <a href="https://gdflix.cfd/search/${encodeURIComponent(movieName + ' ' + releaseYear)}" target="_blank" style="text-decoration: none;">
                            <button style="width: 100%; background: #fb8c00; color: black; border: none; padding: 15px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 17px;">
                                🚀 Server 1: High Speed (G-Drive)
                            </button>
                        </a>

                        <a href="https://mkvcinemas.com/?s=${encodeURIComponent(movieName)}" target="_blank" style="text-decoration: none;">
                            <button style="width: 100%; background: #43a047; color: white; border: none; padding: 15px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 17px;">
                                🔗 Server 2: 480p | 720p | 1080p
                            </button>
                        </a>

                        <a href="https://luxmovies.best/?s=${encodeURIComponent(movieName)}" target="_blank" style="text-decoration: none;">
                            <button style="width: 100%; background: #1e88e5; color: white; border: none; padding: 15px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 17px;">
                                🎙️ Server 3: Hindi Dubbed / Multi-Audio
                            </button>
                        </a>

                    </div>
                    <p style="color: #888; margin-top: 20px; font-size: 13px; text-align: center;">
                        Note: If a server doesn't work, please try another one. These are automatic search links.
                    </p>
                </div>
            </div>
        `;

        showScreenshots(); // TMDB images load function

    } catch (error) {
        console.error('Error fetching details:', error);
    }
}

async function showScreenshots() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}/images?api_key=${API_KEY}`);
        const data = await res.json();
        
        if (data.backdrops && data.backdrops.length > 0) {
            const html = `
                <div style="margin: 40px 5%; border-top: 1px solid #222; padding-top: 30px; width: 90%;">
                    <h2 style="color: #e50914; text-align: center; margin-bottom: 25px;">📷 MOVIE SCREENSHOTS</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
                        ${data.backdrops.slice(0, 6).map(img => `
                            <img src="https://image.tmdb.org/t/p/w500${img.file_path}" style="width: 100%; border-radius: 8px; border: 1px solid #333;">
                        `).join('')}
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
        }
    } catch (e) {
        console.log("Screenshots not found");
    }
}

async function fetchRelated() {
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}/recommendations?api_key=${API_KEY}`); //
    const data = await res.json();
    relatedContainer.innerHTML = ''; //
    data.results.slice(0, 10).forEach(item => {
        const div = document.createElement('div');
        div.classList.add('movie-card');
        div.onclick = () => window.location.href = `details.html?id=${item.id}&type=${type}`; //
        div.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" onerror="this.src='https://via.placeholder.com/500x750?text=No+Image'">
            <div class="card-info">
                <h3>${item.title || item.name}</h3>
                <p>⭐ ${item.vote_average.toFixed(1)}</p>
            </div>
        `;
        relatedContainer.appendChild(div); //
    });
}

getMovieDetails();
fetchRelated();
