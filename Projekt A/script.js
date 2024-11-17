function searchCocktail() {
    const query = document.getElementById("search").value;
    if (!query) {
        alert("Prosím, zadejte název koktejlu.");
        return;
    }
    // Vyčistíme předchozí výsledky
    const resultsDiv = document.getElementById("results");
    const cocktailDetailsDiv = document.getElementById("cocktail-details");
    const ingredientResultsDiv = document.getElementById("ingredient-results");
    const chartDiv = document.getElementById("ingredient-chart");
    resultsDiv.innerHTML = "";
    cocktailDetailsDiv.innerHTML = ""; 
    ingredientResultsDiv.innerHTML = "";
    chartDiv.innerHTML = "";

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById("results");
            resultsDiv.innerHTML = ""; 

            if (data.drinks) {
                data.drinks.forEach(drink => {
                    const drinkDiv = document.createElement("div");
                    drinkDiv.innerHTML = ` <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
                        <h3>${drink.strDrink}</h3>
                        <img src="${drink.strDrinkThumb}/preview" alt="${drink.strDrink}" onclick="showCocktailDetails('${drink.idDrink}')">
                        </div>
                    `;
                    resultsDiv.appendChild(drinkDiv); 
                });
            } else {
                resultsDiv.innerHTML = "<p>Koktejl nebyl nalezen.</p>";
            }
        })
        .catch(error => {
            console.error("Chyba při získávání dat:", error);
        });
}

function showCocktailDetails(cocktailId) {
    console.log("Zobrazování detailů pro koktejl s ID:", cocktailId);
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`)
        .then(response => response.json())
        .then(data => {
            if (data.drinks) {
                const cocktail = data.drinks[0];
                const detailsDiv = document.getElementById("cocktail-details");

                // Zobrazení detailů o koktejlu
                detailsDiv.innerHTML = `
                    <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
                    <div style="display: flex; flex-direction: column; width: 400px;">
                    <h2>${cocktail.strDrink}</h2>
                    <p><strong>Pokyny:</strong> ${cocktail.strInstructions}</p>
                    <p><strong>Sklenice:</strong> ${cocktail.strGlass}</p>
                    </div>
                `;

                // Zobrazení ingrediencí s obrázky
                let ingredientsList = `<div style="display:flex; flex-direction: column;"><h3>Ingredience:</h3><ul>`;
                for (let i = 1; i <= 15; i++) {
                    const ingredient = cocktail[`strIngredient${i}`];
                    const measure = cocktail[`strMeasure${i}`];
                    if (ingredient) {
                        ingredientsList += `
                            <li style="list-style:none">
                                <img src="https://www.thecocktaildb.com/images/ingredients/${ingredient}-Small.png" alt="${ingredient}">
                                ${measure ? measure : ""} ${ingredient}
                            </li>
                        `;
                    }
                }
                ingredientsList += "</ul></div>";
                detailsDiv.innerHTML += ingredientsList;

                // Zobrazit graf ingrediencí
                displayIngredientChart(cocktail);

                // Posunout stránku na začátek
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                console.error("Koktejl nebyl nalezen.");
            }
        })
        .catch(error => {
            console.error("Chyba při získávání detailů koktejlu:", error);
        });
}


function displayIngredientChart(cocktail) {
    const ingredients = [];
    const measurements = [];
    for (let i = 0; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measurement = cocktail[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push(ingredient);
            measurements.push(parseFloat(measurement) || 0);
        }
    }

    const chartDiv = document.getElementById("ingredient-chart");
    chartDiv.innerHTML = ""; // Vyčištění předchozího grafu

    const ctx = document.createElement("canvas");
    chartDiv.appendChild(ctx);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ingredients,
            datasets: [{
                label: "Množství",
                data: measurements,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Nastavení velikosti grafu
    chartDiv.style.width = "400px";
    chartDiv.style.height = "300px";
}


function searchIngredient() {
    const query = document.getElementById("ingredient-search").value;
    if (!query) {
        alert("Prosím, zadejte název ingredience.");
        return;
    }

    // Vyčistíme předchozí výsledky
    const resultsDiv = document.getElementById("results");
    const cocktailDetailsDiv = document.getElementById("cocktail-details");
    const ingredientResultsDiv = document.getElementById("ingredient-results");
    const chartDiv = document.getElementById("ingredient-chart");
    resultsDiv.innerHTML = "";
    cocktailDetailsDiv.innerHTML = ""; 
    ingredientResultsDiv.innerHTML = "";
    chartDiv.innerHTML = "";

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Chyba při získávání dat z API.");
            }
            return response.json();
        })
        .then(data => {
            const resultsDiv = document.getElementById("ingredient-results");
            resultsDiv.innerHTML = ""; 

            if (data.ingredients && data.ingredients.length > 0) {
                data.ingredients.forEach(ingredient => {
                    const ingredientDiv = document.createElement("div");
                    ingredientDiv.innerHTML = `
                        <h3>${ingredient.strIngredient}</h3>
                        <p><strong>Typ:</strong> ${ingredient.strType || "Neuvedeno"}</p>
                        <p>${ingredient.strDescription || "Popis není k dispozici."}</p>
                        <img src="www.thecocktaildb.com/images/ingredients/${ingredient}.png" alt="${ingredient}">
                    `;
                    resultsDiv.appendChild(ingredientDiv); 
                });
            } else {
                resultsDiv.innerHTML = "<p>Ingredience nebyla nalezena.</p>";
            }
        })
        
        .catch(error => {
            console.error("Chyba při získávání dat o ingredienci:", error);
            const resultsDiv = document.getElementById("ingredient-results");
            resultsDiv.innerHTML = "<p>Chyba při načítání dat. Zkuste to prosím znovu.</p>";
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
}

function filterByAlcoholic() {
        // Vyčistíme předchozí výsledky
        const resultsDiv = document.getElementById("results");
        const cocktailDetailsDiv = document.getElementById("cocktail-details");
        const ingredientResultsDiv = document.getElementById("ingredient-results");
        const chartDiv = document.getElementById("ingredient-chart");
        resultsDiv.innerHTML = "";
        cocktailDetailsDiv.innerHTML = ""; 
        ingredientResultsDiv.innerHTML = "";
        chartDiv.innerHTML = "";
    // Zavoláme API pro alkoholické koktejly
    fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic')
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById("cocktail-results");
            resultsDiv.innerHTML = ""; // Vyčistit předchozí výsledky

            if (data.drinks && data.drinks.length > 0) {
                data.drinks.forEach(cocktail => {
                    const cocktailDiv = document.createElement("div");
                    cocktailDiv.innerHTML = `
                        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
                        <h3>${cocktail.strDrink}</h3>
                        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" onclick="showCocktailDetails('${cocktail.idDrink}')" />
                        </div>
                    `;
                    resultsDiv.appendChild(cocktailDiv); // Přidat koktejl do výsledků
                });
            } else {
                resultsDiv.innerHTML = "<p>Žádné alkoholické koktejly nebyly nalezeny.</p>";
            }
        })
        .catch(error => {
            console.error("Chyba při získávání dat o koktejlech:", error);
        });
}

function filterByNonAlcoholic() {
        // Vyčistíme předchozí výsledky
        const resultsDiv = document.getElementById("results");
        const cocktailDetailsDiv = document.getElementById("cocktail-details");
        const ingredientResultsDiv = document.getElementById("ingredient-results");
        const chartDiv = document.getElementById("ingredient-chart");
        resultsDiv.innerHTML = "";
        cocktailDetailsDiv.innerHTML = ""; 
        ingredientResultsDiv.innerHTML = "";
        chartDiv.innerHTML = "";
    // Zavoláme API pro nealkoholické koktejly
    fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic')
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById("cocktail-results");
            resultsDiv.innerHTML = ""; // Vyčistit předchozí výsledky

            if (data.drinks && data.drinks.length > 0) {
                data.drinks.forEach(cocktail => {
                    const cocktailDiv = document.createElement("div");
                    cocktailDiv.innerHTML = `
                    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
                        <h3>${cocktail.strDrink}</h3>
                        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" onclick="showCocktailDetails('${cocktail.idDrink}')" />
                        </div>
                    `;
                    resultsDiv.appendChild(cocktailDiv); // Přidat koktejl do výsledků
                });
            } else {
                resultsDiv.innerHTML = "<p>Žádné nealkoholické koktejly nebyly nalezeny.</p>";
            }
        })
        .catch(error => {
            console.error("Chyba při získávání dat o koktejlech:", error);
        });
}
