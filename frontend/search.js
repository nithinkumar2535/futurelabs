let cachedTests = []; // To cache the fetched data
let dataFetched = false; // To track if data is already fetched

// Common function for handling search input
async function handleSearchInput(inputId, suggestionsId) {
    const inputElement = document.getElementById(inputId);
    const suggestionsContainer = document.getElementById(suggestionsId);

    inputElement.addEventListener("input", async function (event) {
        const query = event.target.value;

        if (query.length > 0) {
            if (!dataFetched) {
                // Fetch data on first input
                await fetchAllTests();
                dataFetched = true; // Mark as fetched
            }
            // Filter cached data locally
            const filteredTests = filterTests(query);
            showSuggestions(filteredTests, suggestionsContainer);
        } else {
            suggestionsContainer.innerHTML = ''; // Clear suggestions
            suggestionsContainer.style.display = 'none'; // Hide container
        }
    });
}

// Fetch all tests from the backend on the first input
async function fetchAllTests() {
    try {
        const response = await fetch(`${baseUrl}/api/v1/tests/all-tests`);
        const Tests = await response.json();
        cachedTests = Tests.data; // Cache the data
        console.log("Fetched and cached tests:", cachedTests);
    } catch (error) {
        console.error("Error fetching tests:", error);
        
    }
}

// Filter cached data based on query
function filterTests(query) {
    return cachedTests.filter(test => {
        const matchesTestName = test.testName.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = test.category.toLowerCase().includes(query.toLowerCase());
        const matchesSubcategory = test.subcategory.toLowerCase().includes(query.toLowerCase());
        return matchesTestName || matchesCategory || matchesSubcategory;
    }).map(test => ({
        name: test.testName,
        id: test._id,
        category: test.category,
        subcategory: test.subcategory,
    }));
}

// Show suggestions in the dropdown
function showSuggestions(suggestions, suggestionsContainer) {
    suggestionsContainer.innerHTML = ''; // Clear existing suggestions

    if (suggestions.length > 0) {
        suggestionsContainer.style.display = 'block'; // Show container
        suggestions.forEach(function (suggestion) {
            const suggestionItem = document.createElement("div");
            suggestionItem.classList.add("suggestion-item");
            suggestionItem.textContent = suggestion.name;

            suggestionItem.addEventListener("click", function () {
                window.location.href = `product.html?id=${suggestion.id}&category=${suggestion.category}`;
            });

            suggestionsContainer.appendChild(suggestionItem);
        });
    } else {
        suggestionsContainer.style.display = 'none'; // Hide container if no matches
    }
}

// Initialize search input handlers for desktop and mobile
handleSearchInput("unique-search-input", "suggestions");
handleSearchInput("unique-search-input-mobile", "suggestions-mobile");
