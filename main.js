const API_URL = "https://hirc-notes-back-gfbwg8aqb6c0f4cs.centralus-01.azurewebsites.net";

//Parses in both client and server side
async function calculateRisk() {
    const age = parseInt(document.getElementById('age').value);
    const feet = parseInt(document.getElementById('heightFeet').value);
    const inches = parseInt(document.getElementById('heightInches').value) || 0; //defaults to 0 if no value
    const weight = parseFloat(document.getElementById('weight').value);
    const systolic = parseInt(document.getElementById('systolic').value);
    const diastolic = parseInt(document.getElementById('diastolic').value);
    

    //Handle family history
    let familyHistoryArray = [] //Initializes empty array
    const familyCheckboxes = document.querySelectorAll('input[name="familyHistory"]:checked'); // Selects checked boxes
    familyHistoryArray = Array.from(familyCheckboxes).map(cb => cb.value); //Maps the values to the array
    const familyHistory = familyHistoryArray.join(','); //Joins the array into a comma seperated list

    //Builds query string for a URL
    const queryParams = new URLSearchParams({ //auto formats objects into the string
        age, feet, inches, weight, systolic, diastolic, familyHistory
    })

    //Call API with the query string
    try {
        const response = await fetch(`${API_URL}/calculate?${queryParams.toString()}`);
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        const data = await response.json();

        document.dispatchEvent(new CustomEvent('riskCalculated', {detail: data}))

        console.log("Risk data:", data);

    } catch (error) {
            console.error("Error fetching risk data:", error);
    }
}

//Connect form submission to call function calculateRisk
console.log("Script loaded, setting up event listener."); // Debugging line to confirm script load
document.getElementById('riskForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log("Form submitted, calculating risk..."); // Debugging line to confirm form submission
    await calculateRisk(); // Call the async function
});

document.addEventListener('riskCalculated', function(event) {
            const data = event.detail;
            const resultDiv = document.getElementById('result');
            resultDiv.className = ''; // reset old color
            resultDiv.classList.add(data.riskCategory.toLowerCase()); // add new color class

            resultDiv.innerHTML = `
                <h2>Results</h2>
                <p><strong>BMI:</strong> ${data.bmi} (${data.bmiCategory})</p>
                <p><strong>Blood Pressure:</strong> ${data.bpCategory}</p>
                <p><strong>Family History Points:</strong> ${data.familyHistoryPoints}</p>
                <p><strong>Total Risk Score:</strong> ${data.riskScore}</p>
                <p><strong>Risk Category:</strong> <span class="${data.riskCategory.toLowerCase()}">${data.riskCategory.toUpperCase()}</span></p>
            `;
        });