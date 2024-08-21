const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Local variable to store fetched data
let storedData = [];

// Middleware to serve static files
app.use(express.static('public'));

// Function to delay the response
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to fetch a list of Pokémon
const fetchPokemonsList = async (offset, limit) => {
  try {
    const apiEndpoint = 'https://pokeapi.co/api/v2/pokemon';
    const response = await axios.get(`${apiEndpoint}?limit=${limit}&offset=${offset}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching Pokémon list:', error.message);
    return [];
  }
};

// Function to fetch detailed data for a single Pokémon
const fetchPokemonDetails = async (url) => {
  try {
    const response = await axios.get(url);
    const pokemon = response.data;
    return {
      name: pokemon.name,
      abilities: pokemon.abilities.map(a => a.ability.name).join(', '),
      types: pokemon.types.map(t => t.type.name).join(', ')
    };
  } catch (error) {
    console.error('Error fetching Pokémon details:', error.message);
    return { name: 'Unknown', abilities: 'N/A', types: 'N/A' };
  }
};

// Endpoint to fetch data
app.get('/fetch-data', async (req, res) => {
  const startTime = Date.now(); // Start timing

  try {
    // Validate query parameter
    const totalRequests = parseInt(req.query.totalRequests, 10);
    if (isNaN(totalRequests) || totalRequests <= 0) {
      throw new Error('Invalid totalRequests parameter. It must be a positive number.');
    }

    // Fetch Pokémon list
    const pokemons = await fetchPokemonsList(0, totalRequests);
    const detailedRequests = pokemons.map(pokemon => fetchPokemonDetails(pokemon.url));
    await delay(2000); // Wait for 2 seconds
    const detailedData = await Promise.all(detailedRequests);
    storedData = [...storedData, ...detailedData]; // Keep previous data and add new data

    const endTime = Date.now(); // End timing
    const elapsedTime = (endTime - startTime) / 1000; // Time in seconds

    res.json({
      data: detailedData,
      message: `Fetched ${totalRequests} Pokémon in ${elapsedTime.toFixed(2)} seconds.`
    });
  } catch (error) {
    console.error('Error handling requests:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
