var map = {};
window.onload = async function() {
    console.log("Script loaded!");

    let resp = await searchQuery(10, 1, 20240101, 20241231);
    resp = await resp.json();
    console.log(resp);

    console.log("=============TESTING=============\n\n\n\n\n\n\n\n\n");
    await aggregateData(20240101, 20241231, 'desc', 1000, 2);
    console.log(map);

};

async function aggregateData(dateStart, dateEnd, order, limit, batches){
    let searchRange = `search=receivedate:[${dateStart}+TO+${dateEnd}]`;
    for(let i = 0; i < batches; i++){

        let response = await fetch(`https://api.fda.gov/drug/event.json?${searchRange}&sort=receivedate:${order}&limit=${limit}`);

        const json = await response.json();
        for(let i = 0; i < json.results.length; i++){
            //Access patient information
            console.log("==========");
            const patient = json.results[i].patient;
    
            //Access drug information
            patient.drug.forEach((drug, index) => {
                //console.log(`Drug ${index + 1} - Medicinal Product:`, drug.medicinalproduct);
                //console.log(`Drug Indication:`, drug.drugindication);
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