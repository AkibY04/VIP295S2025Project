var map = {};
window.onload = async function() {
    console.log("Script loaded!");

    let resp = await searchQuery(10, 1, 20240101, 20241231);
    resp = await resp.json();
    console.log(resp);

    console.log("=============TESTING=============\n\n\n\n\n\n\n\n\n");
    // await aggregateData("20240101", "20241231", 'desc', 1000, 2);
    await searchDrug("albuterol", "20140101", "20240101", 'desc', 1, 10);

    console.log(map);

};

async function aggregateData(dateStart, dateEnd, order, limit, batches){

    for(let i = 0; i < batches; i++){
        let searchRange = `search=receivedate:[${dateStart}+TO+${dateEnd}]`;
        let searchStr = `https://api.fda.gov/drug/event.json?${searchRange}&sort=receivedate:${order}&limit=${limit}`;
        let response = await fetch(searchStr);

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

// Retrieves the date before the given date in dateInput
// mode: 1 "week" / "month" / "year" / "day" before the given date
function getDateBefore(dateInput, mode) {
    const year = parseInt(dateInput.substring(0, 4), 10);
    const month = parseInt(dateInput.substring(4, 6), 10) - 1;
    const day = parseInt(dateInput.substring(6, 8), 10);
    
    const givenDate = new Date(year, month, day);
    const weekBefore = new Date(givenDate);
    
    if(mode === "week") weekBefore.setDate(givenDate.getDate() - 7);
    else if(mode === "month") weekBefore.setMonth(givenDate.getMonth() - 1);
    else if(mode === "year") weekBefore.setFullYear(givenDate.getFullYear() - 1);
    else if(mode === "day") weekBefore.setDate(givenDate.getDate() - 1);
    else return null;
    
    const formatDate = (date) => 
        date.getFullYear().toString() +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0');

    return formatDate(weekBefore);
    
}

async function searchDrug(searchTerm, dateStart, dateEnd, order, limit, batches){
    for(let i = 0; i < batches; i++){
        let searchRange = `search=patient.drug.openfda.brand_name:"${searchTerm}"+AND+occurcountry:US+AND+receivedate:[${dateStart}+TO+${dateStart}]`;
        let searchStr   = `https://api.fda.gov/drug/event.json?${searchRange}&sort=receivedate:${order}&limit=${limit}`;
        let response    = await fetch(searchStr);
        
        let json = await response.json();

        console.log(json.meta.results.total);

        // for(let i = 0; i < json.results.length; i++){
        //     //Access patient information
        //     x++;
        //     const patient = json.results[i].patient;
            
        //     //Access drug information
        //     patient.drug.forEach((drug, index) => {
        //         if (drug.medicinalproduct in map){
        //             map[drug.medicinalproduct] = map[drug.medicinalproduct]+1;
        //         }
        //         else {
        //             map[drug.medicinalproduct] = 1
        //         }
        //     });
        // }

        // update search query
        dateStart   = getDateBefore(dateStart, "year");
        dateEnd     = getDateBefore(dateEnd, "year");
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
