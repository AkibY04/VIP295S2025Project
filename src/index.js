var map = {};
var map2 = {};
window.onload = async function() {
    //Single drug search bar
    document.getElementById("search-input-0").addEventListener('keydown', async function(event) {
        if(event.key == 'Enter'){
            const drugName = event.target.value;

            let startDate = document.getElementById("startDate0").value;
            if(startDate){
                startDate += "1231"
                //console.log("Start Date: ", startDate);
            }
            else{
                //console.log("No start date provided");
                startDate = "20101231";
            }

            let endDate = document.getElementById("endDate0").value;
            if(endDate){
                endDate += "1231"
                //console.log("End Date: ", endDate);
            }
            else{
                //console.log("No end date provided");
                endDate = "20241231";
            }

            // console.log("EndDate: ", endDate);
            // console.log("StartDate: ", startDate)
            if((+endDate) <= (+startDate)){
                alert("End date must be later than start date");
                return;
            }

            const batches = (+endDate.substring(0,4)) - (+startDate.substring(0,4)) + 1;
            if((await searchDrug(drugName, startDate, endDate, 'desc', 1, batches, "year", map)) == 1){
                alert("No data found for " + drugName);
                return;
            }

            const data = [{
                x: Object.keys(map),
                y: Object.values(map),
                type: 'bar',
                marker: {color: 'green'}
            }]

            const layout = {
                title: "Adverse Drug Events for " + drugName,
                xaxis: {title: "Year"},
                yaxis: {title: "Count"}
            }

            Plotly.newPlot('plot1', data, layout, 
            {responsive: true}
            );
        }
    });

    //Left drug search bar
    document.getElementById("search-input-1").addEventListener('keydown', async function(event) {
        if(event.key == 'Enter'){
            const drugName = event.target.value;

            let startDate = document.getElementById("startDate1").value;
            if(startDate){
                startDate += "1231"
                //console.log("Start Date: ", startDate);
            }
            else{
                //console.log("No start date provided");
                startDate = "20101231";
            }

            let endDate = document.getElementById("endDate1").value;
            if(endDate){
                endDate += "1231"
                //console.log("End Date: ", endDate);
            }
            else{
                //console.log("No end date provided");
                endDate = "20241231";
            }

            // console.log("EndDate: ", endDate);
            // console.log("StartDate: ", startDate)
            if((+endDate) <= (+startDate)){
                alert("End date must be later than start date");
                return;
            }

            const batches = (+endDate.substring(0,4)) - (+startDate.substring(0,4)) + 1;
            if((await searchDrug(drugName, startDate, endDate, 'desc', 1, batches, "year", map)) == 1){
                alert("No data found for " + drugName);
                return;
            }

            const data = [{
                x: Object.keys(map),
                y: Object.values(map),
                type: 'bar',
                marker: {color: 'green'}
            }]

            const layout = {
                width: 600,
                title: "Adverse Drug Events for " + drugName,
                xaxis: {title: "Year"},
                yaxis: {title: "Count"}
            }

            Plotly.newPlot('plot1', data, layout, 
            {
                responsive: true,
                autosize:true
            }
            );
        }
    });

    //Right drug search bar
    document.getElementById("search-input-2").addEventListener('keydown', async function(event) {
        if(event.key == 'Enter'){
            const drugName = event.target.value;

            let startDate = document.getElementById("startDate0").value;
            if(startDate){
            startDate += "1231"
            //console.log("Start Date: ", startDate);
            }
            else{
                //console.log("No start date provided");
                startDate = "20101231";
            }

            let endDate = document.getElementById("endDate0").value;
            if(endDate){
                endDate += "1231"
                //console.log("End Date: ", endDate);
            }
            else{
                //console.log("No end date provided");
                endDate = "20241231";
            }

            if((+endDate) <= (+startDate)){
                alert("End date must be later than start date");

                return;
            }

          const batches = (+endDate.substring(0,4)) - (+startDate.substring(0,4)) + 1;
          if((await searchDrug(drugName, startDate, endDate, 'desc', 1, batches, "year", map2)) == 1){
              alert("No data found for " + drugName);
              return;
          }
      
          const data = [{
              x: Object.keys(map2),
              y: Object.values(map2),
              type: 'bar',
              marker: {color: 'green'}
          }]
      
          const layout = {
              width: 600,

              title: "Adverse Drug Events for " + drugName,
              xaxis: {title: "Year"},
              yaxis: {title: "Count"}
          }
      
          Plotly.newPlot('plot2', data, layout, 
            {
                responsive: true, 
                autosize:true
            }
          );
        }
    });

    document.getElementById("toggleButton").addEventListener('click', async function(event){
        toggleSearchbarVisibility();
    });

};

function toggleSearchbarVisibility(){
    // SINGLE SEARCH BAR
    if(document.getElementById("search-input-0").style.display=="none"){
        Plotly.purge('plot1');
        Plotly.purge('plot2'); 
        document.getElementById("search-input-0").style.display="block";
        document.getElementById("search-input-1").innerHTML="none"
        document.getElementById("search-input-1").style.display="none"
        document.getElementById("search-input-2").innerHTML="none"
        document.getElementById("search-input-2").style.display="none";
        document.getElementById("singleDrugSearchDateInputs").style.display="none";
        document.getElementById("startDate0").value="2011";
        document.getElementById("startDate1").value="";
        document.getElementById("endDate0").value="2024";
        document.getElementById("endDate1").value="";
    }
    // DOUBLE SEARCH BAR
    else{
        Plotly.purge('plot1');
        Plotly.purge('plot2'); 
        document.getElementById("search-input-0").innerHTML="none";
        document.getElementById("search-input-0").style.display="none";
        document.getElementById("search-input-1").style.display="block"
        document.getElementById("search-input-2").style.display="block";
        document.getElementById("singleDrugSearchDateInputs").style.display="block";
        document.getElementById("startDate0").value="2011";
        document.getElementById("startDate1").value="2011";
        document.getElementById("endDate0").value="2024";
        document.getElementById("endDate1").value="2024";

    }

}

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

// Reports the # of adverse events of a specific drug between two dates
// searchTerm: the drug name
// dateStart: the starting date
// dateEnd: the ending date
// order: the order of the search
// limit: the number of results
// batches: the number of batches
// dateFrequency: the date frequency between each batch (week, month, year, or day)
async function searchDrug(searchTerm, dateStart, dateEnd, order, limit, batches, dateFrequency, mapVar){
    Object.keys(mapVar).forEach(key => delete mapVar[key]);
    let newStart    = dateStart = getDateBefore(dateEnd, dateFrequency);
    let curYear     = dateEnd.substring(0,4);
    curYear = Number(curYear); 
    for(let i = 0; i < batches; i++){
        let searchRange = `search=patient.drug.openfda.brand_name:"${searchTerm}"+AND+occurcountry:US+AND+receivedate:[${newStart}+TO+${dateEnd}]`;
        let searchStr   = `https://api.fda.gov/drug/event.json?${searchRange}&sort=receivedate:${order}&limit=${limit}`;
        let response    = await fetch(searchStr);
        
        let json = await response.json();

        if (!json.meta?.results) {
            console.log("No data found");
            return 1;
        }

        mapVar[curYear--] = json.meta.results.total;

        // update search query
        newStart   = getDateBefore(newStart, dateFrequency);
        dateEnd     = getDateBefore(dateEnd, dateFrequency);

        console.log(searchStr);
        console.log(json.meta.results.total);
        // console.log(newStart , " + ", dateEnd);
    }
    // console.log(Object.keys(map));

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
