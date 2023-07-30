let enableAnalysis = false;

// Function to update the slider value and display it
function updateSliderValue(sliderId, displayId) {
    const sliderValue = document.getElementById(sliderId).value;
    document.getElementById(displayId).textContent = sliderValue;
}

// Function to update the JSON values and display them
function updateValues() {
    const populationValue = parseInt(document.getElementById('populationSlider').value, 10);
    const seedValue = parseInt(document.getElementById('seedSlider').value, 10);

    document.getElementById('PopulationValue').textContent = populationValue;
    document.getElementById('SeedValue').textContent = seedValue;

    // Send the updated values to the server
    fetch('/updateValues', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ EnableAnalysis: enableAnalysis, Population: populationValue, Seed: seedValue })
    })
        .then(response => response.json())
        .then(data => console.log('Data saved:', data))
        .catch(error => console.error('Error saving data:', error));
}

// Attach the updateSliderValue function to the sliders' "input" events
document.getElementById('populationSlider').addEventListener('input', () => updateSliderValue('populationSlider', 'PopulationValue'));
document.getElementById('seedSlider').addEventListener('input', () => updateSliderValue('seedSlider', 'SeedValue'));

// Attach the updateValues function to the "Update Values" button click event
document.getElementById('updateButton').addEventListener('click', updateValues);

// Attach the updateAnalysis function to the "Enable Analysis" checkbox change event
document.getElementById('enableAnalysis').addEventListener('change', function() {
    enableAnalysis = this.checked;
});

// Initial display of the default values
fetch('/initialValues')
    .then(response => response.json())
    .then(data => {
        enableAnalysis = data.EnableAnalysis;
        document.getElementById('enableAnalysis').checked = data.EnableAnalysis;
        document.getElementById('populationSlider').value = data.Population;
        document.getElementById('PopulationValue').textContent = data.Population;

        document.getElementById('seedSlider').value = data.Seed;
        document.getElementById('SeedValue').textContent = data.Seed;
    })
    .catch(error => console.error('Error fetching initial values:', error));
