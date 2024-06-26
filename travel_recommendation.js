const txtSearch = document.getElementById("txtSearch");
const btnSearch = document.getElementById("btnSearch");
const btnClear = document.getElementById("btnClear");
const searchResults = document.getElementById("searchResults");

let recommendationsList;

const beachRegex = /beach/i;
const templeRegex = /temple/i;
const countryRegex = /(countr(y|ies)\b)|australia|japan|brazil/i;

fetch("travel_recommendation_api.json")
  .then((response) => response.json())
  .then((data) => {
    recommendationsList = data;
  })
  .catch((err) => {
    console.log(err);
    addInvalidsearchResultItem("Error occurred: failed to retrieve search results.");
  });

btnClear.addEventListener("click", function () {
  txtSearch.value = "";
  searchResults.innerHTML = "";
});

btnSearch.addEventListener("click", function () {
  const text = txtSearch.value.toLowerCase();
  searchResults.innerHTML = "";

  if (!text) {
    addInvalidsearchResultItem("Please enter a destination or keyword");
    return;
  }

  if (!recommendationsList) {
    addInvalidsearchResultItem("Error occurred: failed to retrieve search results.");
    return;
  }
  
  if (!beachRegex.test(text) && !templeRegex.test(text) && !countryRegex.test(text)) {
    addInvalidsearchResultItem(`No results found for '${text}'`);
    return;
  }

  processSearch(text);
});


function processSearch(text) {
  if (beachRegex.test(text)) {
    recommendationsList.beaches.forEach(beach => {
      addsearchResultItem(beach.name, beach.description, beach.imageUrl);
    });
  }

  if (templeRegex.test(text)) {
    recommendationsList.temples.forEach(temple => {
      addsearchResultItem(temple.name, temple.description, temple.imageUrl);
    });
  }

  if (countryRegex.test(text)) {
    processCountries(text);
  }
}

function processCountries(text) {
  const country = recommendationsList.countries.find(e => e.name.toLowerCase() === text);
  if (!country) {
    recommendationsList.countries.forEach(country => {
      country.cities.forEach(city => {
        addsearchResultItem(city.name, city.description, city.imageUrl);
      });
    });
  } else {
    country.cities.forEach(city => {
      addsearchResultItem(city.name, city.description, city.imageUrl);
    });
  }
}

function addsearchResultItem(name, description, imageUrl) {
  const item = document.createElement("div");
  item.innerHTML = `<div class="search-result-item">
                      <img src="${imageUrl}" width="100%" />
                      <div style="padding: 1em; padding-top: 0;">
                        <h4>${name}</h4>
                        <p>${description}</p>
                        <button class="btn-primary">Visit</button>
                      </div>
                    </div>`;
  searchResults.append(item);
}

function addInvalidsearchResultItem(message) {
  const item = document.createElement("div");
  item.innerHTML = `<div class="search-result-item">
                      <span style="display: inline-block; padding: 0.75em 1em">${message}</span>
                    </div>`;
  searchResults.append(item);
}

txtSearch.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    btnSearch.click();
  }
});
