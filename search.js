// Retrieve DOM elements
const searchInput = document.getElementById('searchInput'); // Input field for search query
const searchResults = document.getElementById('searchResults'); // Container for displaying search results

// Initialize Algolia client with your Application ID and search-only API Key
const client = algoliasearch('IHB2PAIMW6', 'd7622d1be869c317693c69aebd5b3e1f');

// Specify the index name
const index = client.initIndex('salazar_demo');

/**
 * Function to search Algolia index for query
 * @param {string} query - The search query
 */
const searchAlgolia = (query) => {
    // Specify the attributes to retrieve, including thumbnailUrl
    const attributesToRetrieve = ['name', 'image', 'url']; // Add other attributes as needed

    // Perform search
    index.search(query, {
        attributesToRetrieve: attributesToRetrieve // Requested attributes
    })
    .then(({ hits }) => {
        displayResults(hits);
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

/**
 * Function to display search results with thumbnails
 */
const displayResults = (results) => {
    // Clear previous search results
    searchResults.innerHTML = '';

    // Display "No results found" if there are no results
    if (results.length === 0) {
        searchResults.innerHTML = '<li>No results found</li>';
        return;
    }
    
    // Iterate through search results
    results.forEach(result => {
        // Create a list item
        const li = document.createElement('li');
        
        // Create an anchor element
        const link = document.createElement('a');
        link.href = result.url; // Set the href attribute to the URL
        
        // Create an image element
        const img = document.createElement('img');
        img.src = result.image; // Set the src attribute to the image URL
        img.alt = 'product image';
        
        // Append the image to the anchor element
        link.appendChild(img);
        
        // Create a span for the title
        const title = document.createElement('span');
        title.textContent = " " + result.name; // Set the text content to the name
        
        // Append the title to the anchor element
        link.appendChild(title);
        
        // Append the anchor element to the list item
        li.appendChild(link);

        // Append the list item to the search results
        searchResults.appendChild(li);
    });
};

// Event listener for input change
searchInput.addEventListener('input', (event) => {
    const query = event.target.value;
    searchAlgolia(query);
});