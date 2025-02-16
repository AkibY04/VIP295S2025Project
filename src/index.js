window.onload = async function() {
    console.log("Script loaded!");
    let response = await fetch("https://api.fda.gov/drug/event.json?search=receivedate:[20040101+TO+20081231]sort=receivedate:desc&limit=10");
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

    console.log("=============TESTING=============");

    console.log(json);

    let resp = await searchQuery(10, 1, 20240101, 20241231);
    resp = await resp.json();
    console.log(resp);
};

async function searchQuery(limit, order, dateStart, dateEnd){
    
    let searchRange = "";
    if(order==0){
        order='desc'
    }
    else{
        order = 'asc'
    }
    if(dateStart && dateEnd){
        searchRange = `search=receivedate:[${dateStart}+TO+${dateEnd}]`
    }

    let response = await fetch(`https://api.fda.gov/drug/event.json?${searchRange}&sort=receivedate:${order}&limit=${limit}`);
    return response;
}