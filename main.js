const API_URL = "URL HERE";

//Parses in both client and server side
async function calculateRisk() {
    const age = parseInt(document.getElementById('age').value);
    const feet = parseInt(document.getElementById('feet').value);
    const inches = parseInt(document.getElementById('inches').value) || 0; //defaults to 0 if no value
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
        const response = await fetch(`${API_URL}?${queryParams.toString()}`);
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        const data = await response.json();

        console.log("Risk data:", data);
    } catch (error) {
            console.error("Error fetching risk data:", error);
    }
}