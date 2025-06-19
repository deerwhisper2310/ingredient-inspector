// This script runs on the actual webpage (e.g., walmart.com)

// List of CSS selectors to find ingredient lists on various websites.
const ingredientSelectors = [
  "#ingredients-section", // Instacart
  "div[data-cel-widget=ingredients_feature_div] .a-section", // Amazon
  "div[aria-label=Ingredients] > div", // Walmart new layout
  "#add-on-desktop-container .ingredients", // Walmart old layout
  "[data-testid=ingredients-and-allergens] p", // Target
  // Add more selectors for other websites here
];

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_INGREDIENTS") {
    console.log("Content script received request for ingredients.");
    let ingredientsText = "";
    
    // Try each selector to find the ingredient list
    for (const selector of ingredientSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`Found ingredients with selector: ${selector}`);
        ingredientsText = element.innerText;
        break; // Stop once we find one
      }
    }

    if (ingredientsText) {
      sendResponse({ ingredients: ingredientsText });
    } else {
      console.log("Could not find ingredient list on this page.");
      sendResponse({ ingredients: "" }); // Send back empty string if not found
    }
  }
  return true; // Indicates you wish to send a response asynchronously
});

