var map = {};
var map2 = {};
var tempMap = {};
var tempMap2 = {};
var monthMap = {};
var monthMap2 = {};

window.onload = async function() {
    document.getElementById("startDate1").style.display = "none";
    document.getElementById("endDate1").style.display = "none";
    document.getElementById("search-input-1").style.display="none"
    document.getElementById("search-input-2").style.display="none";
    
    crazyRez("albuterol", "1", "2020", "US");
    
    //Single drug search bar
    document.getElementById("search-input-0").addEventListener('keydown', async function(event) {
        if(event.key == 'Enter'){
            removeAllButtons();
            const drugName = event.target.value;
    
            let country = document.getElementById("country0").value;
    
            let startDate = document.getElementById("startDate0").value;
            if(startDate){
                startDate += "1231";
            } else {
                startDate = "20101231";
            }
    
            let endDate = document.getElementById("endDate0").value;
            if(endDate){
                endDate += "1231";
            } else {
                endDate = "20241231";
            }
    
            if((+endDate) <= (+startDate)){
                alert("End date must be later than start date");
                return;
            }
    
            const batches = (+endDate.substring(0,4)) - (+startDate.substring(0,4)) + 1;
            if((await searchDrug(drugName, endDate, 'desc', 1, batches, "year", map, country)) == 1){
                alert("No data found for " + drugName);
                return;
            }
    
            const xVals = Object.keys(map);
            const yVals = Object.values(map);
    
            const initialData = [{
                x: xVals,
                y: new Array(yVals.length).fill(0),
                type: 'bar',
                marker: { color: 'green' }
            }];
    
            const layout = {
                title: "Adverse Drug Events for " + drugName + " in " + country,
                xaxis: { title: "Year" },
                yaxis: {
                    title: "Count",
                    range: [0, Math.max(...yVals) * 1.1]
                }
            };
    
            Plotly.newPlot('plot1', initialData, layout, {
                responsive: true
            }).then(() => {
                Plotly.animate('plot1', {
                    data: [{ y: yVals }],
                    traces: [0]
                }, {
                    transition: {
                        duration: 800,
                        easing: 'cubic-in-out'
                    },
                    frame: {
                        duration: 800
                    }
                });
    
                console.log("Boom graph made!");
    
                document.getElementById("plot1").on('plotly_click', function(data){
                    generateMonthGraph(drugName, data.points[0].x, 'plot1', country);
                    console.log(data.points[0].x);
                });
            }).catch(error => console.error("Plotly Error:", error));
        }
    });
    

    //Left drug search bar
    document.getElementById("search-input-1").addEventListener('keydown', async function(event) {
        if(event.key == 'Enter'){
            removeAllButtons();
            const drugName = event.target.value;

            let country = document.getElementById("country0").value;

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
            if((await searchDrug(drugName, endDate, 'desc', 1, batches, "year", map, country)) == 1){
                alert("No data found for " + drugName);
                return;
            }

            const xVals = Object.keys(map);
            const yVals = Object.values(map);
    
            const initialData = [{
                x: xVals,
                y: new Array(yVals.length).fill(0),
                type: 'bar',
                marker: { color: 'green' }
            }];
    
            const layout = {
                title: "Adverse Drug Events for " + drugName + " in " + country,
                xaxis: { title: "Year" },
                yaxis: {
                    title: "Count",
                    range: [0, Math.max(...yVals) * 1.1]
                }
            };
    
            Plotly.newPlot('plot1', initialData, layout, {
                responsive: true
            }).then(() => {
                Plotly.animate('plot1', {
                    data: [{ y: yVals }],
                    traces: [0]
                }, {
                    transition: {
                        duration: 800,
                        easing: 'cubic-in-out'
                    },
                    frame: {
                        duration: 800
                    }
                });
    
                // console.log("Boom graph made!");
    
                document.getElementById("plot1").on('plotly_click', function(data){
                    generateMonthGraph(drugName, data.points[0].x, 'plot1', country);
                    console.log(data.points[0].x);
                });
            }).catch(error => console.error("Plotly Error:", error));
        }
    });

    //Right drug search bar
    document.getElementById("search-input-2").addEventListener('keydown', async function(event) {
        if(event.key == 'Enter'){
            removeAllButtons();
            const drugName = event.target.value;

            let country = document.getElementById("country1").value;

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

            if((+endDate) <= (+startDate)){
                alert("End date must be later than start date");

                return;
            }

          const batches = (+endDate.substring(0,4)) - (+startDate.substring(0,4)) + 1;
          if((await searchDrug(drugName, endDate, 'desc', 1, batches, "year", map2, country)) == 1){
              alert("No data found for " + drugName);
              return;
          }
      
          const xVals = Object.keys(map2);
          const yVals = Object.values(map2);
  
          const initialData = [{
              x: xVals,
              y: new Array(yVals.length).fill(0),
              type: 'bar',
              marker: { color: 'blue' }
          }];
  
          const layout = {
              title: "Adverse Drug Events for " + drugName + " in " + country,
              xaxis: { title: "Year" },
              yaxis: {
                  title: "Count",
                  range: [0, Math.max(...yVals) * 1.1]
              }
          };
  
          Plotly.newPlot('plot2', initialData, layout, {
              responsive: true
          }).then(() => {
              Plotly.animate('plot2', {
                  data: [{ y: yVals }],
                  traces: [0]
              }, {
                  transition: {
                      duration: 800,
                      easing: 'cubic-in-out'
                  },
                  frame: {
                      duration: 800
                  }
              });
  
            //   console.log("Boom graph made!");
  
              document.getElementById("plot2").on('plotly_click', function(data){
                  generateMonthGraph(drugName, data.points[0].x, 'plot2', country);
                //   console.log(data.points[0].x);
              });
          }).catch(error => console.error("Plotly Error:", error));
        }
    });

    document.getElementById("toggleButton").addEventListener('click', async function(event){
        toggleSearchbarVisibility();
    });

};

async function generateMonthGraph(drugName, year, plotID, country) {
    let plotNumber = plotID.substring(4, 5);
    // console.log(plotNumber);

    // Save existing map
    if (plotID === 'plot1') tempMap = { ...map };
    else if (plotID === 'plot2') tempMap2 = { ...map2 };

    Plotly.purge(plotID);

    let button = document.createElement("button");
    button.id = "backButton" + plotNumber;
    
    let img = document.createElement("img");
    img.src = "backArrow.png"; 
    img.alt = "Go Back";
    img.style.width = "30px";
    img.style.height = "30px";

    button.appendChild(img);


    button.addEventListener('click', async function () {
        Plotly.purge(plotID);

        if (plotID === 'plot1') map = tempMap;
        else if (plotID === 'plot2') map2 = tempMap2;

        const dataMap = plotNumber == 1 ? map : map2;
        const xVals = Object.keys(dataMap);
        const yVals = Object.values(dataMap);
        const color = plotNumber == 1 ? 'green' : 'blue';

        const initialData = [{
            x: xVals,
            y: new Array(yVals.length).fill(0),
            type: 'bar',
            marker: { color: color }
        }];

        const layout = {
            title: "Adverse Drug Events for " + drugName + " in " + country,
            xaxis: { title: "Year" },
            yaxis: {
                title: "Count",
                range: [0, Math.max(...yVals) * 1.1]
            }
        };

        Plotly.newPlot('plot' + plotNumber, initialData, layout, {
            responsive: true
        }).then(() => {
            Plotly.animate('plot' + plotNumber, {
                data: [{ y: yVals }],
                traces: [0]
            }, {
                transition: {
                    duration: 800,
                    easing: 'cubic-in-out'
                },
                frame: {
                    duration: 800
                }
            });

            // console.log("Boom graph made!");

            document.getElementById("plot" + plotNumber).on('plotly_click', function (data) {
                generateMonthGraph(drugName, data.points[0].x, 'plot' + plotNumber, country);
                // console.log(data.points[0].x);
            });
        }).catch(error => console.error("Plotly Error:", error));

        button.remove();
    });

    let endDate = year + '1231';
    await searchDrug(drugName, endDate, 'desc', 1, 12, "month", plotNumber == 1 ? map : map2, country);

    const dataMap = plotNumber == 1 ? map : map2;
    const xVals = Object.keys(dataMap);
    const yVals = Object.values(dataMap);
    const color = plotNumber == 1 ? 'green' : 'blue';

    const initialData = [{
        x: xVals,
        y: new Array(yVals.length).fill(0),
        type: 'bar',
        marker: { color: color }
    }];

    const layout = {
        title: "Adverse Drug Events for " + drugName + " in " + country,
        xaxis: { title: "Month" },
        yaxis: {
            title: "Count",
            range: [0, Math.max(...yVals) * 1.1]
        }
    };

    Plotly.newPlot('plot' + plotNumber, initialData, layout, {
        responsive: true
    }).then(() => {
        Plotly.animate('plot' + plotNumber, {
            data: [{ y: yVals }],
            traces: [0]
        }, {
            transition: {
                duration: 800,
                easing: 'cubic-in-out'
            },
            frame: {
                duration: 800
            }
        });
    });

    document.getElementById("plot" + plotNumber).on('plotly_click', function(data){
        button.remove();
        generateDayGraph(drugName, data.points[0].x, year, 'plot' + plotNumber, country);
        // console.log(data.points[0].x);
    });

    document.getElementById("divForBackButton" + plotNumber).appendChild(button);
}

async function generateDayGraph(drugName, month, year, plotID, country) {
    let plotNumber = plotID.substring(4, 5);
    // console.log(plotNumber);

    // Save existing map
    if (plotID === 'plot1') monthMap = { ...map };
    else if (plotID === 'plot2') monthMap2 = { ...map2 };

    Plotly.purge(plotID);

    let button = document.createElement("button");
    button.id = "backButton" + plotNumber;
    
    let img = document.createElement("img");
    img.src = "backArrow.png"; 
    img.alt = "Go Back";
    img.style.width = "30px";
    img.style.height = "30px";

    button.appendChild(img);

    //DAYS TO MONTHS
    button.addEventListener('click', async function () {
        Plotly.purge(plotID);
        
        //MONTHS TO YEARS BUTTON
        let button2 = document.createElement("button");
        button2.id = "backButton" + plotNumber;
        
        let img = document.createElement("img");
        img.src = "backArrow.png"; 
        img.alt = "Go Back";
        img.style.width = "30px";
        img.style.height = "30px";

        button2.appendChild(img);

        button2.addEventListener('click', async function () {
            Plotly.purge(plotID);

            if (plotID === 'plot1') map = tempMap;
            else if (plotID === 'plot2') map2 = tempMap2;

            const dataMap = plotNumber == 1 ? map : map2;
            const xVals = Object.keys(dataMap);
            const yVals = Object.values(dataMap);
            const color = plotNumber == 1 ? 'green' : 'blue';

            const initialData = [{
                x: xVals,
                y: new Array(yVals.length).fill(0),
                type: 'bar',
                marker: { color: color }
            }];

            const layout = {
                title: "Adverse Drug Events for " + drugName + " in " + country,
                xaxis: { title: "Year" },
                yaxis: {
                    title: "Count",
                    range: [0, Math.max(...yVals) * 1.1]
                }
            };

            Plotly.newPlot('plot' + plotNumber, initialData, layout, {
                responsive: true
            }).then(() => {
                Plotly.animate('plot' + plotNumber, {
                    data: [{ y: yVals }],
                    traces: [0]
                }, {
                    transition: {
                        duration: 800,
                        easing: 'cubic-in-out'
                    },
                    frame: {
                        duration: 800
                    }
                });

                // console.log("Boom graph made!");

                document.getElementById("plot" + plotNumber).on('plotly_click', function (data) {
                    generateMonthGraph(drugName, data.points[0].x, 'plot' + plotNumber, country);
                    // console.log(data.points[0].x);
                });
            }).catch(error => console.error("Plotly Error:", error));

            button2.remove();
        });

        document.getElementById("divForBackButton" + plotNumber).appendChild(button2);

        if (plotID === 'plot1') map = monthMap;
        else if (plotID === 'plot2') map2 = monthMap2;

        const dataMap = plotNumber == 1 ? map : map2;
        const xVals = Object.keys(dataMap);
        const yVals = Object.values(dataMap);
        const color = plotNumber == 1 ? 'green' : 'blue';

        const initialData = [{
            x: xVals,
            y: new Array(yVals.length).fill(0),
            type: 'bar',
            marker: { color: color }
        }];

        const layout = {
            title: "Adverse Drug Events for " + drugName + " in " + country,
            xaxis: { title: "Month" },
            yaxis: {
                title: "Count",
                range: [0, Math.max(...yVals) * 1.1]
            }
        };

        Plotly.newPlot('plot' + plotNumber, initialData, layout, {
            responsive: true
        }).then(() => {
            Plotly.animate('plot' + plotNumber, {
                data: [{ y: yVals }],
                traces: [0]
            }, {
                transition: {
                    duration: 800,
                    easing: 'cubic-in-out'
                },
                frame: {
                    duration: 800
                }
            });

            // console.log("Boom graph made!");

            document.getElementById("plot" + plotNumber).on('plotly_click', function (data) {
                generateMonthGraph(drugName, year, 'plot' + plotNumber, country);
            });
        }).catch(error => console.error("Plotly Error:", error));

        button.remove();
    });

    let daysInMonth = getDaysinMonth(month);
    let endDate = year + padMonth(month).toString() + padDay(daysInMonth).toString();
    // console.log("Day lcicked end date is ", endDate);
    // console.log("Day lcicked month is ", month);
    // console.log("Day lcicked year is ", year);
    // console.log("Day lcicked days is ", daysInMonth);

    await searchDrug(drugName, endDate, 'desc', 1, daysInMonth, "day", plotNumber == 1 ? map : map2, country);

    const dataMap = plotNumber == 1 ? map : map2;
    const xVals = Object.keys(dataMap);
    const yVals = Object.values(dataMap);
    const color = plotNumber == 1 ? 'green' : 'blue';

    const initialData = [{
        x: xVals,
        y: new Array(yVals.length).fill(0),
        type: 'bar',
        marker: { color: color }
    }];

    const layout = {
        title: "Adverse Drug Events for " + drugName + " in " + country,
        xaxis: { title: "Days" },
        yaxis: {
            title: "Count",
            range: [0, Math.max(...yVals) * 1.1]
        }
    };

    Plotly.newPlot('plot' + plotNumber, initialData, layout, {
        responsive: true
    }).then(() => {
        Plotly.animate('plot' + plotNumber, {
            data: [{ y: yVals }],
            traces: [0]
        }, {
            transition: {
                duration: 800,
                easing: 'cubic-in-out'
            },
            frame: {
                duration: 800
            }
        });
    });

    document.getElementById("divForBackButton" + plotNumber).appendChild(button);
}


function toggleSearchbarVisibility(){
    // SINGLE SEARCH BAR
    if(document.getElementById("search-input-0").style.display=="none"){
        Plotly.purge('plot1');
        Plotly.purge('plot2'); 
        document.getElementById("search-input-0").style.display="block";
        document.getElementById("search-input-0").value=""
        document.getElementById("search-input-1").value=""
        document.getElementById("search-input-2").value=""
        document.getElementById("search-input-1").style.display="none"
        document.getElementById("search-input-2").style.display="none";

        document.getElementById("singleDrugSearchDateInputs").style.display="none";

        document.getElementById("divForBackButton1").innerText="";
        document.getElementById("divForBackButton2").innerText="";
        // document.getElementById("divForBackButton1").style.display="none";
        // document.getElementById("divForBackButton2").style.display="none";

        document.getElementById("startDate0").value="2011";
        document.getElementById("startDate1").value="";
        document.getElementById("endDate0").value="2024";
        document.getElementById("endDate1").value="";
    }
    // DOUBLE SEARCH BAR
    else{
        Plotly.purge('plot1');
        Plotly.purge('plot2'); 
        document.getElementById("search-input-0").style.display="none";

        document.getElementById("search-input-1").style.display="block"
        document.getElementById("search-input-2").style.display="block";

        document.getElementById("search-input-0").value=""
        document.getElementById("search-input-1").value=""
        document.getElementById("search-input-2").value=""

        document.getElementById("singleDrugSearchDateInputs").style.display="flex";
        document.getElementById("divForBackButton1").innerText="";
        document.getElementById("divForBackButton2").innerText="";

        // document.getElementById("backButton1").remove();
        // document.getElementById("backButton2").remove();

        document.getElementById("startDate1").style.display = "block";
        document.getElementById("endDate1").style.display = "block";
        document.getElementById("startDate0").value="2011";
        document.getElementById("startDate1").value="2011";
        document.getElementById("endDate0").value="2024";
        document.getElementById("endDate1").value="2024";
    }

}


// Retrieves the date before the given date in dateInput
// mode: 1 "week" / "month" / "year" / "day" before the given date
function getDateBefore(dateInput, mode) {
    // console.log("Date: ", dateInput);
    // console.log("Mode: ", mode);

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
async function searchDrug(searchTerm, dateEnd, order, limit, batches, dateFrequency, mapVar, country){
    Object.keys(mapVar).forEach(key => delete mapVar[key]);
    let newStart    = getDateBefore(dateEnd, dateFrequency);
    // console.log(newStart);

    let mapIndex;
    if (dateFrequency == 'month') {
        let currMonth = dateEnd.substring(4,6);
        mapIndex = Number(currMonth);

    }
    else if (dateFrequency == 'day') {
        let currDay = dateEnd.substring(6,8);
        mapIndex = Number(currDay);
    }
    else {
        let curYear = dateEnd.substring(0,4);
        mapIndex = Number(curYear);
    }

    for(let i = 0; i < batches; i++){
        let searchRange = `search=patient.drug.openfda.brand_name:"${searchTerm}"+AND+occurcountry:${country}+AND+receivedate:[${newStart}+TO+${dateEnd}]`;
        let searchStr   = `https://api.fda.gov/drug/event.json?${searchRange}&sort=receivedate:${order}&limit=${limit}`;
        let response    = await fetch(searchStr);
        
        let json = await response.json();

        if (!json.meta?.results) {
            console.log("No data found");
            return 1;
        }

        mapVar[mapIndex--] = json.meta.results.total;

        // update search query
        newStart = getDateBefore(newStart, dateFrequency);
        dateEnd  = getDateBefore(dateEnd, dateFrequency);

        // console.log(searchStr);
        // console.log(json.meta.results.total);
    }

}

function getDaysInMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
}
  
function getStartOfMonth(month, year){
    return new Date(year, month-1, 1);
}

function getEndOfMonth(month, year){
    let days = getDaysInMonth(new Date(year, month-1, 1));
    return new Date(year, month-1, days);
}

// given a date object, return it's formatted version suitable for openFDA API
function dateFormatertoAPI(date){
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();

    return year + "" + (month>9?month:("0"+month)) + ""+ (day>9?day:("0"+day));
}

async function crazyRez(searchTerm, month, year, country){
    let startDate = dateFormatertoAPI(getStartOfMonth(month, year));
    let endDate = dateFormatertoAPI(getEndOfMonth(month, year));
    let numDays = endDate.substring(6);

    console.log("Start: ", startDate);
    console.log("End: ", endDate);
    console.log("Num Day: ", numDays);

    let results = [];
    let order = "desc";

    let dayBefore = Number(numDays);
    let newDate = dateFormatertoAPI(new Date(year, month, dayBefore));   

    while(startDate != newDate){
        dayBefore--;
        newDate = dateFormatertoAPI(new Date(year, month, dayBefore));   
        console.log("new: " , newDate);
        let searchRange = `search=patient.drug.openfda.brand_name:"${searchTerm}"+AND+occurcountry:${country}+AND+receivedate:[${newDate}+TO+${endDate}]`;
        let searchStr   = `https://api.fda.gov/drug/event.json?${searchRange}&sort=receivedate:${order}&limit=${100}`;
        let response;
        try{
            response = await fetch(searchStr);
            if(!response.ok) continue;
            let json = await response.json();
            if(json.results) results.push(json.results);
        } catch{error => "not ok respo"}

    }

    console.log("RESULTS: ");
    console.log(results);
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

function getDaysinMonth(month){
    let daysInMonth = 0;
    if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12){
        daysInMonth = 31;
    }
    else if(month == 4 || month == 6 || month == 9 || month == 11){
        daysInMonth = 30;
    }
    else if(month == 2){
        daysInMonth = 28;
    }
    return daysInMonth;
}

function padMonth(month) {
    return month < 10 ? '0' + month : month;
}

function padDay(day) {
    return day < 10 ? '0' + day : day;
}

function removeAllButtons(){
    let button = document.getElementById("backButton1");
    if(button) button.remove();
    let button2 = document.getElementById("backButton2");
    if(button2) button2.remove();
}