document.getElementById('fetchButton').addEventListener('click', async () => {
    const numRequests = parseInt(document.getElementById('numRequests').value, 10);

    try {
        // Show loading message
        const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';

        // Fetching data from the server
        const response = await fetch(`/fetch-data?totalRequests=${numRequests}`);
        const data = await response.json();

        // Clear existing rows
        tableBody.innerHTML = '';

        // Append new rows
        data.data.forEach(pokemon => {
            const row = tableBody.insertRow();
            const nameCell = row.insertCell(0);
            const abilitiesCell = row.insertCell(1);
            const typesCell = row.insertCell(2);

            nameCell.textContent = pokemon.name || 'N/A';
            abilitiesCell.textContent = pokemon.abilities || 'N/A';
            typesCell.textContent = pokemon.types || 'N/A';
        });

        // Show time taken
        alert(`Fetched ${numRequests} Pokémon in ${data.message.split(' ')[4]} seconds.`);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data. Check console for details.');
    }
});

// Add functionality for the "Clear" button
document.getElementById('clearButton').addEventListener('click', () => {
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear all rows in the table body
});
