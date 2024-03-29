// script.js

// Assume firebaseConfig is defined elsewhere or imported before this script runs
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

const searchInput = document.getElementById('search-box');

searchInput.addEventListener('input', function() {
  const searchTerm = this.value.trim().toLowerCase();
  console.log(`Searching for: ${searchTerm}`); // Debugging line

  const recipesRef = database.ref('recipes');
  recipesRef.orderByChild('Title').startAt(searchTerm).endAt(searchTerm + '\uf8ff').on('value', function(snapshot) {
    if (!snapshot.exists()) {
      console.log('No matches found');
      return;
    }

    const searchResults = [];
    snapshot.forEach(function(childSnapshot) {
      searchResults.push(childSnapshot.val());
    });

    console.log(`Found ${searchResults.length} result(s)`); // Debugging line
    displaySearchResults(searchResults);
  }, function(error) {
    console.error('Search failed:', error);
  });
});

function displaySearchResults(results) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  results.forEach(recipe => {
    const recipeElement = document.createElement('div');
    recipeElement.classList.add('recipe-box');
    recipeElement.innerHTML = `<h3 class="recipe-title">${recipe.Title}</h3>`;
    recipeElement.addEventListener('click', () => fetchAndDisplayRecipeDetails(recipe));
    resultsContainer.appendChild(recipeElement);
  });
}

function fetchAndDisplayRecipeDetails(recipe) {
  const detailsContainer = document.getElementById('recipe-details-container');
  const titleElement = document.getElementById('recipe-title');

  titleElement.textContent = recipe.Title;
  detailsContainer.querySelector('.ingredients-card ul').innerHTML = recipe.Ingredients.map(ingredient => `<li>${ingredient.Name} - ${ingredient.Quantity} ${ingredient.Unit}</li>`).join('');
  detailsContainer.querySelector('.instructions-card ul').innerHTML = recipe['Numbered Instructions'].map(instruction => `<li>${instruction}</li>`).join('');

  detailsContainer.style.display = 'block';
  toggleBlurAndOverlay(true);
}

function toggleBlurAndOverlay(show) {
  const overlay = document.getElementById('darkOverlay');
  const backgroundContent = document.querySelector('.container');
  overlay.style.display = show ? 'block' : 'none';
  backgroundContent.classList.toggle('blur-background', show);
}

window.addEventListener('click', function(event) {
  const detailsContainer = document.getElementById('recipe-details-container');
  if (!detailsContainer.contains(event.target) && detailsContainer.style.display === 'block') {
    detailsContainer.style.display = 'none';
    toggleBlurAndOverlay(false);
  }
});
