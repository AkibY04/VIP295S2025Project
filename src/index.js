var map = {};
window.onload = async function() {
    console.log("Script loaded!");
    let response = await fetch(     "https://api.fda.gov/drug/event.json?search=receivedate:[20040101+TO+20081231]&sort=receivedate:desc&limit=10");
    const json = await response.json();

    // for(let i = 0; i < json.results.length; i++){
    //     // // Access patient information
    //     console.log("==========");
    //     const patient = json.results[i].patient;
    //     console.log("Patient Onset Age:", patient.patientonsetage);
    //     console.log("Patient Sex:", patient.patientsex);

    //     // Access reactions
    //     patient.reaction.forEach((reaction, index) => {
    //     console.log(`Reaction ${index + 1}:`, reaction.reactionmeddrapt);
    //     });

    //     // Access drug information
    //     patient.drug.forEach((drug, index) => {
    //     console.log(`Drug ${index + 1} - Medicinal Product:`, drug.medicinalproduct);
    //     console.log(`Drug Indication:`, drug.drugindication);
    //     });
    // }

    console.log("=============TESTING=============");
    console.log(json);

    let resp = await searchQuery(10, 1, 20240101, 20241231);
    resp = await resp.json();
    console.log(resp);

    console.log("=============TESTING=============\n\n\n\n\n\n\n\n\n");

    await aggregateData();
    
    console.log(map);

};

async function aggregateData(){
    let dateStart   = "20240101";
    let dateEnd     = "20241231";
    let searchRange = `search=receivedate:[${dateStart}+TO+${dateEnd}]`;
    let order       = 'desc';
    let limit       = '1000';
    let batches     =  2;
    // 2 batches
    for(let i = 0; i < batches; i++){

        let response = await fetch(`https://api.fda.gov/drug/event.json?${searchRange}&sort=receivedate:${order}&limit=${limit}`);
        const json = await response.json();
        for(let i = 0; i < json.results.length; i++){
            // // Access patient information
            console.log("==========");
            const patient = json.results[i].patient;
    
            // Access drug information
            patient.drug.forEach((drug, index) => {
                // console.log(`Drug ${index + 1} - Medicinal Product:`, drug.medicinalproduct);
                // console.log(`Drug Indication:`, drug.drugindication);
                if (drug.medicinalproduct in map){
                    map[drug.medicinalproduct] = map[drug.medicinalproduct]+1;
                }
                else {
                    map[drug.medicinalproduct] = 1
                }
            });
        }
        // update search query
        let dateStart   = "20230101";
        let dateEnd     = "20231231";
    }
}

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
    
    const RED = "\u001b[31m";
    const WHITE_GREEN = "\u001b[37;42m";
    console.log( RED + "Link:" );

    let response = await fetch(`https://api.fda.gov/drug/event.json?${searchRange}&sort=receivedate:${order}&limit=${limit}`);
    return response;
}