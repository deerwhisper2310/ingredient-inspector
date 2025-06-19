// This script runs in the background of the browser

// Set default filter settings when the extension is first installed.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    filters: {
      seedOils: true,
      artificialColors: true,
      preservatives: true,
      sweeteners: true,
      allergens: false,
      processed: true,
    }
  });
});

