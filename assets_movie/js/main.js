//Elementos necesarios
const KEY = 'a89b0d1768117658197e359f07cecc0e';

const URL = 'https://api.themoviedb.org/3/movie/550?api_key=a89b0d1768117658197e359f07cecc0e';

const IMG_URL = 'https://image.tmdb.org/t/p/original';

const TRENDING = 'https://api.themoviedb.org/3/trending/movie/week?api_key=a89b0d1768117658197e359f07cecc0e';

const TOP_RATED = 'https://api.themoviedb.org/3/movie/top_rated?api_key=a89b0d1768117658197e359f07cecc0e';

const UPCOMING = 'https://api.themoviedb.org/3/movie/upcoming?api_key=a89b0d1768117658197e359f07cecc0e';




//Request
const fetchMovies = async (searchTerm, page = 1) =>{
    const response = await fetch(searchTerm + `&page=${page}`);
    const data = await response.json();
    console.log(data);
    return data;
} 




//MAIN

//Elementos del DOM a manipular

const container = document.querySelector('.movies-container');
const filterBTN = document.querySelectorAll('.btn');
const prevBTN = document.querySelector('.left');
const nextBTN = document.querySelector('.right');
const pagination = document.querySelector('.page-number');

const pageController ={
    page: null,
    total: null,
    searchParameter:TRENDING,
};

const parameterSelector = (filterType) =>{
    return filterType === "TOPRATED" 
    ? TOP_RATED 
    : filterType === "UPCOMING" 
    ? UPCOMING 
    : TRENDING;
};

const changeSearchParameter = (e) =>{
    if(!e.target.classList.contains('btn') || e.target.classList.contains('btn--active')){
        return;
    };
    const selectedParameter = e.target.dataset.filter;
    pageController.searchParameter =parameterSelector(selectedParameter);
    const buttons = [...filterBTN];
    buttons.forEach((btn)=>{
        if(btn.dataset.filter !== selectedParameter){
            btn.classList.remove('btn--active')
        }else{
            btn.classList.add('btn--active');
        };
    });
    getMovies();
};

//Formatear fecha

const formDate = (date) =>{
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
};

const renderCard = (movie) =>{
    const {title, poster_path, vote_average, release_date} = movie;

    return `
    <div class="movies">
        <img src="${IMG_URL + poster_path}" alt="${title}">
        <div class="card-popularity">
            ${Math.floor(vote_average * 10)}% de popularidad
        </div>
        <div class="card-content">

            <h2>${title}</h2>

            <p>Fecha de estreno: ${formDate(release_date)}</p>

        </div>
    </div>
    `
};

const renderCards = (movies) =>{
    container.innerHTML = movies.map((movie) => renderCard(movie)).join('');
};

const disablePreviousBTN = (page) =>{
    if(page === 1){
        prevBTN.classList.add('disabled');
    }else{
        prevBTN.classList.remove('disabled');
    };
};

const disableNextBTN = (page, total) =>{
    if(page === total) {
        nextBTN.classList.add('disabled');
    }else{
        nextBTN.classList.remove('disabled');
    };
};

const setPagination = () =>{
    pagination.innerHTML = pageController.page
    disablePreviousBTN(pageController.page);
    disableNextBTN(pageController.page, pageController.total);
};

const loadAndShow = (movies) =>{
    setTimeout(()=>{
        renderCards(movies.results)
        container.scrollIntoView({behavior:"smooth"})
    },1500);
};

const getMovies = async () =>{
    const movies = await fetchMovies(pageController.searchParameter);
    pageController.total = movies.total_pages;
    pageController.page = movies.page
    setPagination();
    renderCards(movies.results);
};

const changePage = async () =>{
    const movies = await fetchMovies(pageController.searchParameter, pageController.page);
    setPagination();
    loadAndShow(movies);
};

const nextPage = async (e) =>{
    e.stopImmediatePropagation();
    if(pageController.page === pageController.total) return;
    pageController.page += 1;
    changePage();

};

const previousPage = async (e) =>{
    e.stopImmediatePropagation();
    if(pageController.page === 1) return;
    pageController.page -= 1;
    changePage();

};

const init = () =>{
    window.addEventListener('DOMContentLoaded',getMovies())
    nextBTN.addEventListener('click', nextPage)
    prevBTN.addEventListener('click',previousPage)
    pagination.addEventListener('click',changeSearchParameter)
};
init();




