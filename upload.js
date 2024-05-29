// Import required modules
const algoliasearch = require('algoliasearch'); // Algolia search client library
const fs = require('fs'); // File system module for file operations
const StreamArray = require('stream-json/streamers/StreamArray'); // JSON streaming library

// Initialize Algolia client with your Application ID and search-only API Key
const client = algoliasearch('IHB2PAIMW6', 'd7622d1be869c317693c69aebd5b3e1f');
const index = client.initIndex('salazar_demo'); // Specify the index name

// Read JSON file as a stream
const stream = fs.createReadStream('expected algolia payload.json').pipe(StreamArray.withParser());

let chunks = []; // Array to store chunks of data from the stream

// Event listener for incoming data from the stream
stream
  .on('data', ({ value }) => {
    chunks.push(value); // Store each chunk of data
    
    // Check if chunks array reaches a certain size (e.g., 10,000 objects)
    if (chunks.length === 10000) {
      stream.pause(); // Pause the stream
      
      // Save objects to Algolia index
      index.saveObjects(chunks, { autoGenerateObjectIDIfNotExist: true })
        .then(() => {
          chunks = []; // Clear the chunks array
          stream.resume(); // Resume the stream
        })
        .catch(console.error); // Log any errors
    }
  })
  .on('end', () => {
    // If there are remaining chunks after the stream ends, save them to Algolia
    if (chunks.length) {
      index.saveObjects(chunks, { autoGenerateObjectIDIfNotExist: true })
        .catch(console.error); // Log any errors
    }
  })
  .on('error', err => console.error(err)); // Log any errors during the stream processing