const API_KEY = '42ba263cafdf8e88b49b1367b5a06ea7';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;
let currentType = 'movie'; 
let currentGenre = '';

const movieContainer = document.getElementById('movies');
const searchInput = document.getElementById('search');
const genreSelect = document.getElementById('genreSelect');
const loadMoreBtn = document.getElementById('loadMore');

async function fetchContent(isNew = true) {
    if (isNew) {
        currentPage = 1;
        movieContainer.innerHTML = '';
    }

    const query = searchInput.value.trim();
    let url;

    if (query) {
        // Search korle 'multi' search use hobe jate Movie+TV duto-i ashe
        url = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}&page=${currentPage}`;
    } else {
        url = `${BASE_URL}/discover/${currentType}?api_key=${API_KEY}&page=${currentPage}&with_genres=${currentGenre}`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();
        renderContent(data.results);
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderContent(items) {
    items.forEach(item => {
        if (!item.poster_path) return;
        const div = document.createElement('div');
        div.classList.add('movie-card');
        
        // Multi search a 'media_type' thake, seta use kora hoyeche
        const type = item.media_type || currentType;
        
        div.onclick = () => window.location.href = `details.html?id=${item.id}&type=${type}`;
        
        div.innerHTML = `
            <img src="${IMG_URL + item.poster_path}">
            <div class="card-info">
                <h3>${item.title || item.name}</h3>
                <p>⭐ ${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</p>
                <span class="type-badge">${type.toUpperCase()}</span>
            </div>
        `;
        movieContainer.appendChild(div);
    });
}

function changeType(type) {
    currentType = type;
    searchInput.value = ''; // Type change korle search clear hobe
    document.getElementById('movieBtn').classList.toggle('active', type === 'movie');
    document.getElementById('tvBtn').classList.toggle('active', type === 'tv');
    fetchContent();
}

loadMoreBtn.onclick = () => {
    currentPage++;
    fetchContent(false);
};

genreSelect.onchange = (e) => {
    currentGenre = e.target.value;
    fetchContent();
};

document.getElementById('searchBtn').onclick = () => fetchContent();
window.onload = () => fetchContent();

// --- Ekhane theke External Hindi Dubbed Logic add kora holo ---

async function fetchMultiSourceContent(isNew = true) {
    if (isNew) {
        currentPage = 1;
        movieContainer.innerHTML = '';
    }

    const query = searchInput.value.trim();
    if (query) {
        fetchContent(isNew);
        return;
    }

    // TMDB-r normal list-er sathe Hindi audio (dubbed) priority thaka movie gulo mix kora hobe
    // Ete kore normal movie-o thakbe abar dubbed movie-o samne asbe
    let dubbedUrl = `${BASE_URL}/discover/${currentType}?api_key=${API_KEY}&page=${currentPage}&with_spoken_languages=hi&sort_by=popularity.desc&with_genres=${currentGenre}`;

    try {
        const res = await fetch(dubbedUrl);
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
            renderContent(data.results);
        }
        
        // Dubbed movie dekhano sesh hole normal movie-o niche add hobe (fetchContent call na kore logic deya holo)
        let normalUrl = `${BASE_URL}/discover/${currentType}?api_key=${API_KEY}&page=${currentPage}&with_genres=${currentGenre}`;
        const resNormal = await fetch(normalUrl);
        const dataNormal = await resNormal.json();
        renderContent(dataNormal.results);

    } catch (error) {
        console.error('Error fetching data:', error);
        fetchContent(isNew);
    }
}

// Window load hole Mixed/Dubbed priority content dekhabe
window.onload = () => fetchMultiSourceContent();

// Load More button update
loadMoreBtn.onclick = () => {
    currentPage++;
    fetchMultiSourceContent(false);
};

// Genre change update
genreSelect.onchange = (e) => {
    currentGenre = e.target.value;
    fetchMultiSourceContent();
};

// Movie/TV type change override
const originalChangeType = changeType;
window.changeType = (type) => {
    currentType = type;
    searchInput.value = '';
    document.getElementById('movieBtn').classList.toggle('active', type === 'movie');
    document.getElementById('tvBtn').classList.toggle('active', type === 'tv');
    fetchMultiSourceContent();
};
