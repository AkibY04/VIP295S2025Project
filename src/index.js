window.onload = async function() {
    console.log("Script loaded!");
    let response = await fetch("https://api.fda.gov/drug/event.json?limit=5");
    const json = await response.json();

    for(let i = 0; i < json.results.length; i++){
        // // Access patient information
        console.log("==========");
        const patient = json.results[i].patient;
        console.log("Patient Onset Age:", patient.patientonsetage);
        console.log("Patient Sex:", patient.patientsex);

        // Access reactions
        patient.reaction.forEach((reaction, index) => {
        console.log(`Reaction ${index + 1}:`, reaction.reactionmeddrapt);
        });

        // Access drug information
        patient.drug.forEach((drug, index) => {
        console.log(`Drug ${index + 1} - Medicinal Product:`, drug.medicinalproduct);
        console.log(`Drug Indication:`, drug.drugindication);
        });
    }
    // console.log(json);
};