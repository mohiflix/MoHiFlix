// URL parameter theke type nite hobe
const type = urlParams.get('type') || 'movie';

async function getMovieDetails() {
    // API call change hobe type onujayi
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=${API_KEY}`);
    // ... baki code ager motoi thakbe
}
