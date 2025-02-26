var map = {};
window.onload = async function() {
    console.log("Script loaded!");

    let resp = await searchQuery(10, 1, 20240101, 20241231);
    resp = await resp.json();
    console.log(resp);

    console.log("=============TESTING=============\n\n\n\n\n\n\n\n\n");
    await aggregateData("20240101", "20241231", 'desc', 1000, 2);
    console.log(map);

};

async function aggregateData(dateStart, dateEnd, order, limit, batches){

    for(let i = 0; i < batches; i++){
        let searchRange = `search=receivedate:[${dateStart}+TO+${dateEnd}]`;

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
        dateStart   = getDateAndWeekBefore(dateStart);
        dateEnd     = getDateAndWeekBefore(dateEnd);
    }
}

function getDateAndWeekBefore(dateInput) {
    const year = parseInt(dateInput.substring(0, 4), 10);
    const month = parseInt(dateInput.substring(4, 6), 10) - 1;
    const day = parseInt(dateInput.substring(6, 8), 10);
    
    const givenDate = new Date(year, month, day);
    const weekBefore = new Date(givenDate);
    
    weekBefore.setDate(givenDate.getDate() - 7);

    const formatDate = (date) => 
        date.getFullYear().toString() +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0');

    return formatDate(weekBefore);
    
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