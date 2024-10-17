function searchCocktail() {
    const query = document.getElementById("search").value;
    if (!query) {
        alert("Prosím, zadejte název koktejlu.");
        return;
    }

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById("results");
            resultsDiv.innerHTML = ""; // Vyčistit obsah před zobrazením nových výsledků

            if (data.drinks) {
                data.drinks.forEach(drink => {
                    const drinkDiv = document.createElement("div");
                    drinkDiv.innerHTML = `
                        <h3>${drink.strDrink}</h3>
                        <img src="${drink.strDrinkThumb}/preview" alt="${drink.strDrink}">
                        <button onclick="showCocktailDetails('${drink.idDrink}')">Zobrazit podrobnosti</button>
                    `;
                    resultsDiv.appendChild(drinkDiv); // Přidat nový div k výsledkům
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
                    <h2>${cocktail.strDrink}</h2>
                    <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
                    <p><strong>Pokyny:</strong> ${cocktail.strInstructions}</p>
                `;

                // Zobrazení ingrediencí s obrázky
                let ingredientsList = "<h3>Ingredience:</h3><ul>";
                for (let i = 1; i <= 15; i++) {
                    const ingredient = cocktail[`strIngredient${i}`];
                    const measure = cocktail[`strMeasure${i}`];
                    if (ingredient) {
                        ingredientsList += `
                            <li>
                                <img src="https://www.thecocktaildb.com/images/ingredients/${ingredient}-Small.png" alt="${ingredient}">
                                ${measure ? measure : ""} ${ingredient}
                            </li>
                        `;
                    }
                }
                ingredientsList += "</ul>";
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

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${query}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById("ingredient-results");
            resultsDiv.innerHTML = ""; // Vyčistit předchozí výsledky

            if (data.ingredients && data.ingredients.length > 0) {
                data.ingredients.forEach(ingredient => {
                    const ingredientDiv = document.createElement("div");
                    ingredientDiv.innerHTML = `
                        <h3>${ingredient.strIngredient}</h3>
                        <img src="${ingredient.strIngredientThumb}" alt="${ingredient.strIngredient}">
                        <p>${ingredient.strDescription || "Popis není k dispozici."}</p>
                    `;
                    resultsDiv.appendChild(ingredientDiv); // Přidat ingredienci do výsledků
                });
            } else {
                resultsDiv.innerHTML = "<p>Ingredience nebyla nalezena.</p>";
            }
        })
        .catch(error => {
            console.error("Chyba při získávání dat o ingredienci:", error);
        });
}
