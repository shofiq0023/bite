let searchForm = document.getElementById('form');
let searchResultDiv = document.querySelector('.search-result');
let modalBody = document.getElementById('modal-body');
let loadingIcon = document.getElementById('loading');
let loadMoreBtn = document.getElementById('load-more');
let errorDiv = document.getElementById('error');
let inputValue;
let baseUrl;
let current = 0;
let resultIncre = 21;
const APP_ID = '6a08aa77';
const APP_KEY = '5785a1162006789982bfb4212eb74749';

const getMeal = (e) => {
    e.preventDefault();
    loadingIcon.classList.remove('hide');
    inputValue = document.getElementById('input').value;
    current = 0;
    fetchApi(inputValue, false, 0, current + resultIncre);
    current += resultIncre;
}

const loadMore = (e) => {
    e.preventDefault();
    fetchApi(inputValue, true, current, current + resultIncre);
    current += resultIncre;
}
const fetchApi = async (inputValue, htmlAdd, previousResult, currentResult) => {
    baseUrl = `https://api.edamam.com/search?q=${inputValue}&app_id=${APP_ID}&app_key=${APP_KEY}&from=${previousResult}&to=${currentResult}`;
    let response = await fetch(baseUrl);
    let data = await response.json();
    loadingIcon.classList.add('hide');
    loadMoreBtn.classList.remove('hide');
    if(errorDiv.classList.contains('show')){
        errorDiv.classList.remove('show');
        errorDiv.classList.add('hide');
    }
    
    if(data.hits == 0){
        searchResultDiv.innerHTML = "";
        errorDiv.classList.add('show');
        loadMoreBtn.classList.add('hide');
    } else if (!htmlAdd){
        generateHTML(data.hits, false);
    } else if (htmlAdd){
        generateHTML(data.hits, true);
    }
}

const generateHTML = (jsonData, htmlAdd) => {
    let HTML = '';
    jsonData.map(result => {
        HTML += 
        `
        <div class="col-md-6 col-lg-4">
            <div class="item">
                <img src="${result.recipe.image}" alt="food image" class="item-img img-fluid rounded w-100">
                <h4 class="item-name text-white my-2">${result.recipe.label}</h4>
                <div class="item-type mb-2"><p>Dish Type: ${result.recipe.dishType == undefined ? 'N/A' : result.recipe.dishType}</p></div>
                <div class="item-type mb-2"><p>Cuisine Type: ${result.recipe.cuisineType == undefined ? 'N/A' : result.recipe.cuisineType}</p></div>
                <a href="#meal-info-modal" class="btn btn-info" onclick="mealInfo('${result.recipe.uri}')" data-toggle="modal" data-backdrop="static" data-keyboard="false">View Recipe</a>
                </div>
            </div>
        `
    });

    if(htmlAdd){
        searchResultDiv.insertAdjacentHTML('beforeend', HTML);
    } else {
        searchResultDiv.innerHTML= HTML;
    }
}

const mealInfo = async (foodId) => {
    foodId = foodId.replace(/(:)/g, '%3A').replace(/[/]/g, '%2F').replace(/(#)/g, '%23');
    baseUrl = `https://api.edamam.com/search?r=${foodId}&app_id=${APP_ID}&app_key=${APP_KEY}`;
    let response = await fetch(baseUrl);
    let data = await response.json();

    generateModal(data);
}

const generateModal = (jsonData) => {
    let HTML = '';
    jsonData.map(result => {
        HTML += 
        `
        <div class="container-fluid">
            <div class="row">
                <div class="col-6">
                    <img src="${result.image}" alt="meal image" class="img-fluid rounded text-center">
                </div>
                <div class="col-6">
                    <p class="text-secondary">Meal name:</p>
                    <h5 class="pb-2">${result.label}</h5>
                    <p class="text-secondary">Cuisine Type:</p>
                    <h6 class="pb-2 capitalize">${result.cuisineType}</h6>
                    <p class="text-secondary">Meal type:</p>
                    <h6 class="pb-2 capitalize">${result.dishType}</h6>
                </div>
            </div>
            <div class="row mt-3">
                <p class="text-secondary">Ingredients:</p>
                <p>${result.ingredientLines}</p>
            </div>
            <div class="row mt-3">
                <a href="${result.url}" target="_blank" class="text-info">Full instruction <i class="fas fa-external-link-alt ml-1 fa-sm"></i></a>                
            </div>
	    </div>
        `
    });
    modalBody.innerHTML = HTML;
}

const resetModal = () => {
    modalBody.innerHTML =
    `
    <div class="text-center py-4 mx-3">
        <div class="spinner-border text-info" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
    `
}

searchForm.addEventListener('submit', getMeal);
loadMoreBtn.addEventListener('click', loadMore);