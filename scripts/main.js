// Our bundler automatically creates styling when imported in the main JS file!
import '../styles/style.scss'

// We can use node_modules directely in the browser!
import * as d3 from 'd3';
import { style } from 'd3';
import gsap from "gsap";
const KEY = import.meta.env.VITE_API_KEY

console.log('main.js is linked');

// ----------------------------------------
// ANIMATION
// ----------------------------------------

const tlY = gsap.timeline({repeat: 2, repeatDelay: 1});

tlY.to(".swipeY", {
    opacity: 0, 
    y: 200, 
    duration: 2
});

const tlX = gsap.timeline({repeat: 5, repeatDelay: 1});

tlX.to(".swipeX", {
    opacity: 0, 
    x: 200, 
    duration: 2
});

const svgPa = document.querySelector("#menuitem");

const tlP = gsap.timeline({ 
  defaults: { ease: "power1.in" }, 
  paused: true 
})

tlP.to(".pa-2", {y: -70, fill:"#8a1538", scale: 7.5, duration: 0.25})
tlP.to(".pa-1", {stroke:"#eeeee4", duration: 0.25})

svgPa.addEventListener("mouseenter", (e) => tlP.play());
svgPa.addEventListener("mouseleave", (e) => tlP.reverse());

const svgPo = document.querySelector("#menuitem2");

const tlP2 = gsap.timeline({ 
  defaults: { ease: "power1.in" }, 
  paused: true 
})

tlP2.to(".po-2", {y: -70, fill:"#8a1538", scale: 7.5, duration: 0.25})
tlP2.to(".po-1", {stroke:"#eeeee4", duration: 0.25})

svgPo.addEventListener("mouseenter", (e) => tlP2.play());
svgPo.addEventListener("mouseleave", (e) => tlP2.reverse());

const svgBr = document.querySelector("#menuitem3");

const tlBr = gsap.timeline({ 
  defaults: { ease: "power1.in" }, 
  paused: true 
})

tlBr.to(".br-2", {y: -70, fill:"#8a1538", scale: 7.5, duration: 0.25})
tlBr.to(".br-1", {stroke:"#eeeee4", duration: 0.25})

svgBr.addEventListener("mouseenter", (e) => tlBr.play());
svgBr.addEventListener("mouseleave", (e) => tlBr.reverse());

// const options = {
//         method: 'GET',
//         headers: {
//             'X-RapidAPI-Key': KEY,
//             'X-RapidAPI-Host': 'football98.p.rapidapi.com'
//         }
//     };
    
// fetch('https://football98.p.rapidapi.com/fifaworldcup/table', options)
//     .then(response => response.json())
//     .then(groups => {

fetch('./groups.json')
    .then((response) => response.json())
    .then(groups => {

        // ----------------------------------------
        // DATA
        // ----------------------------------------
                            
        const cleanData = groups.map(item => {
            let newItem = {
                Place: parseInt (item["Position"]),
                Flag: item["SquadLogo"],
                Nation: item["Name"],
                G: parseInt (item["Played"]),
                W: parseInt (item["Winned"]),
                L: parseInt (item["Loosed"]),
                T: parseInt (item["Tie"]),
                P: parseInt (item["Points"]),
                GD: parseInt (item["Goal Difference"])
            }
				
            return newItem
        })
        
        // fetch('https://football98.p.rapidapi.com/fifaworldcup/results', options)
        // .then(response => response.json())
        // .then(results => {

        fetch('./results.json')
        .then((response) => response.json())
        .then(results => {

            const resultsData = []
            results.forEach(data => {
                resultsData.push(data)
            })

        // ----------------------------------------
        // MAP
        // ----------------------------------------

        const mapData = [];
            
        cleanData.forEach(item => {
            mapData.push(item["Nation"])
        })

        const width = 780
        const height = 600   

        const svg = d3.select("#map").attr('width', width).attr('height', height)

        const projection = d3.geoMercator().scale(125).translate([width / 2.10, height / 1.40]);

        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {

            const Tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("opacity", 0)
            
            function mouseOver(e,d) {

                if(mapData.includes(d.properties.name)) {
                        Tooltip.style("opacity", 1)
                        d3.select(this)
                            .style("fill", "#00cfb7")
                        d3.select(".tooltip")
                        .html(d.properties.name)
                    } else {
                        console.log("fout")
                    }}

            function mouseMove (e) {
                d3.select(".tooltip")
                .style("left", e.pageX + 15 + "px")
                .style("top", e.pageY + 15 + "px")
            }

            function mouseOut (e, d) {
                if(mapData.includes(d.properties.name)) {
                    d3.select(this)
                        .style("fill", "#8a1538")
                }
                d3.select(".tooltip")
                .style("opacity", 0)
            }

            function handleZoom(e) {
                d3.select('#map g')
                  .attr('transform', e.transform);
              }
              
            let zoom = d3.zoom()
                .on('zoom', handleZoom)
                .scaleExtent([1, 3])
                .translateExtent([[0, 0], [width, height]]);

            svg.append("g")
                .selectAll("path")
                .data(data.features)
                .join("path")
                    .attr("d", d3.geoPath()
                    .projection(projection)
                    )
                    .style("stroke", function (d) {
                        if(mapData.includes(d.properties.name)) {
                        return "#eeeee4"
                        } else {
                            return "#8a1538"
                        }
                    })
                    .style("stroke-width", 0.5)
                    .attr("fill", function (d) {
                        if(mapData.includes(d.properties.name)) {
                        return "#8a1538"
                        } else {
                            return "#eeeee4"
                        }
                    }
                )
                .on("mouseover touchstart", mouseOver )
                .on("mousemove", mouseMove)
                .on("mouseout", mouseOut)
                d3.select('#map')
                .call(zoom)
                .attr("viewBox", "0 0 " + width + " " + height )
                .attr("preserveAspectRatio", "xMinYMin");
                
        })

        // ----------------------------------------
        // GROUPS
        // ----------------------------------------

        const tableData = [];
            
        cleanData.forEach(groups => {
            tableData.push(groups)
        })

        const groupA = tableData.splice(0,4)
        const groupB = tableData.splice(0,4)
        const groupC = tableData.splice(0,4)
        const groupD = tableData.splice(0,4)
        const groupE = tableData.splice(0,4)
        const groupF = tableData.splice(0,4)
        const groupG = tableData.splice(0,4)
        const groupH = tableData.splice(0,4)

        groupA.sort((a, b) => a.Place - b.Place);
        groupB.sort((a, b) => a.Place - b.Place);
        groupC.sort((a, b) => a.Place - b.Place);
        groupD.sort((a, b) => a.Place - b.Place);
        groupE.sort((a, b) => a.Place - b.Place);
        groupF.sort((a, b) => a.Place - b.Place);
        groupG.sort((a, b) => a.Place - b.Place);
        groupH.sort((a, b) => a.Place - b.Place);
        
        function generateTableA() {
        
            let table = document.querySelector('table'); 
            let theading = document.querySelector('thead tr');
            let tbody = document.querySelector('tbody')
        
            Object.keys(groupA[0]).forEach(key => {
                let newElement = document.createElement('th');
                newElement.textContent = key;
                theading.appendChild(newElement);
            })
        
            groupA.forEach(obj => {
        
                let tr = document.createElement('tr');
                tbody.appendChild(tr);
        
                for (const [key, value] of Object.entries(obj)) {

                    let td = document.createElement('td');

                    if (key == "Flag"){
                        // console.log(value)
                        let imageEl = document.createElement('img');
                        imageEl.src = value;
                        td.appendChild(imageEl);
                    }
                    else {
                        td.textContent = value; 
                    }
                    tr.appendChild(td)
                }
            })
        }
        generateTableA();

        function generateTableB() {
        
            let table = document.querySelector('table'); 
            let theading = document.querySelector('#Bth #Btr');
            let tbody = document.querySelector('#Btb')
        
            Object.keys(groupB[0]).forEach(key => {
                let newElement = document.createElement('th');
                newElement.textContent = key;
                theading.appendChild(newElement);
            })
        
            groupB.forEach(obj => {

                let tr = document.createElement('tr');
                tbody.appendChild(tr);

                for (const [key, value] of Object.entries(obj)) {
                    let td = document.createElement('td');
                    if (key == "Flag"){
                        // console.log(value)
                        let imageEl = document.createElement('img');
                        imageEl.src = value;
                        td.appendChild(imageEl);
                    }
                    else {
                        td.textContent = value; 
                    }
                    tr.appendChild(td)
                }
            })
        }
        generateTableB();
        
        function generateTableC() {
        
            let table = document.querySelector('table'); 
            let theading = document.querySelector('#Cth #Ctr');
            let tbody = document.querySelector('#Ctb')
        
            Object.keys(groupC[0]).forEach(key => {
                let newElement = document.createElement('th');
                newElement.textContent = key;
                theading.appendChild(newElement);
            })
        
            groupC.forEach(obj => {

                let tr = document.createElement('tr');
                tbody.appendChild(tr);

                for (const [key, value] of Object.entries(obj)) {
                    let td = document.createElement('td');
                    if (key == "Flag"){
                        // console.log(value)
                        let imageEl = document.createElement('img');
                        imageEl.src = value;
                        td.appendChild(imageEl);
                    }
                    else {
                        td.textContent = value; 
                    }
                    tr.appendChild(td)
                }
            })
        }
        generateTableC();

        function generateTableD() {
        
            let table = document.querySelector('table'); 
            let theading = document.querySelector('#Dth #Dtr');
            let tbody = document.querySelector('#Dtb')
        
            Object.keys(groupD[0]).forEach(key => {
                let newElement = document.createElement('th');
                newElement.textContent = key;
                theading.appendChild(newElement);
            })
        
            groupD.forEach(obj => {

                let tr = document.createElement('tr');
                tbody.appendChild(tr);

                for (const [key, value] of Object.entries(obj)) {
                    let td = document.createElement('td');
                    if (key == "Flag"){
                        // console.log(value)
                        let imageEl = document.createElement('img');
                        imageEl.src = value;
                        td.appendChild(imageEl);
                    }
                    else {
                        td.textContent = value; 
                    }
                    tr.appendChild(td)
                }
            })
        }
        generateTableD();

        function generateTableE() {
        
            let table = document.querySelector('table'); 

            // table.querySelector('th');

            let theading = document.querySelector('#Eth #Etr');
            let tbody = document.querySelector('#Etb')
        
            Object.keys(groupE[0]).forEach(key => {
                let newElement = document.createElement('th');
                newElement.textContent = key;
                theading.appendChild(newElement);
            })
        
            groupE.forEach(obj => {

                let tr = document.createElement('tr');
                tbody.appendChild(tr);

                for (const [key, value] of Object.entries(obj)) {
                    let td = document.createElement('td');
                    if (key == "Flag"){
                        // console.log(value)
                        let imageEl = document.createElement('img');
                        imageEl.src = value;
                        td.appendChild(imageEl);
                    }
                    else {
                        td.textContent = value; 
                    }
                    tr.appendChild(td)
                }
            })
        }
        generateTableE();

        function generateTableF() {
        
            let table = document.querySelector('table'); 
            let theading = document.querySelector('#Fth #Ftr');
            let tbody = document.querySelector('#Ftb')
        
            Object.keys(groupF[0]).forEach(key => {
                let newElement = document.createElement('th');
                newElement.textContent = key;
                theading.appendChild(newElement);
            })
        
            groupF.forEach(obj => {

                let tr = document.createElement('tr');
                tbody.appendChild(tr);

                for (const [key, value] of Object.entries(obj)) {
                    let td = document.createElement('td');
                    if (key == "Flag"){
                        // console.log(value)
                        let imageEl = document.createElement('img');
                        imageEl.src = value;
                        td.appendChild(imageEl);
                    }
                    else {
                        td.textContent = value; 
                    }
                    tr.appendChild(td)
                }
            })
        }
        generateTableF();

        function generateTableG() {
        
            let table = document.querySelector('table'); 
            let theading = document.querySelector('#Gth #Gtr');
            let tbody = document.querySelector('#Gtb')
        
            Object.keys(groupG[0]).forEach(key => {
                let newElement = document.createElement('th');
                newElement.textContent = key;
                theading.appendChild(newElement);
            })
        
            groupG.forEach(obj => {

                let tr = document.createElement('tr');
                tbody.appendChild(tr);

                for (const [key, value] of Object.entries(obj)) {
                    let td = document.createElement('td');
                    if (key == "Flag"){
                        // console.log(value)
                        let imageEl = document.createElement('img');
                        imageEl.src = value;
                        td.appendChild(imageEl);
                    }
                    else {
                        td.textContent = value; 
                    }
                    tr.appendChild(td)
                }
            })
        }
        generateTableG();

        function generateTableH() {
        
            let table = document.querySelector('table'); 
            let theading = document.querySelector('#Hth #Htr');
            let tbody = document.querySelector('#Htb')
        
            Object.keys(groupH[0]).forEach(key => {
                let newElement = document.createElement('th');
                newElement.textContent = key;
                theading.appendChild(newElement);
            })
        
            groupH.forEach(obj => {

                let tr = document.createElement('tr');
                tbody.appendChild(tr);

                for (const [key, value] of Object.entries(obj)) {
                    let td = document.createElement('td');
                    if (key == "Flag"){
                        // console.log(value)
                        let imageEl = document.createElement('img');
                        imageEl.src = value;
                        td.appendChild(imageEl);
                    }
                    else {
                        td.textContent = value; 
                    }
                    tr.appendChild(td)
                }
            })
        }
        generateTableH();

        // ----------------------------------------
        // KNOCKOUT
        // ----------------------------------------
        
        const groupA1 = groupA.slice(0, 1)
        const seedA1 = []
        groupA1.forEach(item => {
            seedA1.push(item["Nation"])
        })
        document.getElementById('A1').innerHTML = seedA1;

        const groupA2 = groupA.slice(1, 2)
        const seedA2 = []
        groupA2.forEach(item => {
            seedA2.push(item["Nation"])
        })
        document.getElementById('A2').innerHTML = seedA2;

        const groupB1 = groupB.slice(0, 1)
        const seedB1 = []
        groupB1.forEach(item => {
            seedB1.push(item["Nation"])
        })
        document.getElementById('B1').innerHTML = seedB1;

        const groupB2 = groupB.slice(1, 2)
        const seedB2 = []
        groupB2.forEach(item => {
            seedB2.push(item["Nation"])
        })
        document.getElementById('B2').innerHTML = seedB2;
        
        const groupC1 = groupC.slice(0, 1)
        const seedC1 = []
        groupC1.forEach(item => {
            seedC1.push(item["Nation"])
        })
        document.getElementById('C1').innerHTML = seedC1;

        const groupC2 = groupB.slice(1, 2)
        const seedC2 = []
        groupC2.forEach(item => {
            seedC2.push(item["Nation"])
        })
        document.getElementById('C2').innerHTML = seedC2;

        const groupD1 = groupD.slice(0, 1)
        const seedD1 = []
        groupD1.forEach(item => {
            seedD1.push(item["Nation"])
        })
        document.getElementById('D1').innerHTML = seedD1;
        
        const groupD2 = groupD.slice(1, 2)
        const seedD2 = []
        groupD2.forEach(item => {
            seedD2.push(item["Nation"])
        })
        document.getElementById('D2').innerHTML = seedD2;

        const groupE1 = groupE.slice(0, 1)
        const seedE1 = []
        groupE1.forEach(item => {
            seedE1.push(item["Nation"])
        })
        document.getElementById('E1').innerHTML = seedE1;

        const groupE2 = groupE.slice(1, 2)
        const seedE2 = []
        groupE2.forEach(item => {
            seedE2.push(item["Nation"])
        })
        document.getElementById('E2').innerHTML = seedE2;

        const groupF1 = groupF.slice(0, 1)
        const seedF1 = []
        groupF1.forEach(item => {
            seedF1.push(item["Nation"])
        })
        document.getElementById('F1').innerHTML = seedF1;

        const groupF2 = groupF.slice(1, 2)
        const seedF2 = []
        groupF2.forEach(item => {
            seedF2.push(item["Nation"])
        })
        document.getElementById('F2').innerHTML = seedF2;

        const groupG1 = groupG.slice(0, 1)
        const seedG1 = []
        groupG1.forEach(item => {
            seedG1.push(item["Nation"])
        })
        document.getElementById('G1').innerHTML = seedG1;

        const groupG2 = groupG.slice(1, 2)
        const seedG2 = []
        groupG2.forEach(item => {
            seedG2.push(item["Nation"])
        })
        document.getElementById('G2').innerHTML = seedG2;

        const groupH1 = groupH.slice(0, 1)
        const seedH1 = []
        groupH1.forEach(item => {
            seedH1.push(item["Nation"])
        })
        document.getElementById('H1').innerHTML = seedH1;

        const groupH2 = groupH.slice(1, 2)
        const seedH2 = []
        groupH2.forEach(item => {
            seedH2.push(item["Nation"])
        })
        document.getElementById('H2').innerHTML = seedH2;

        // function make() {
        //     const imageLink = 'https://oneftbl-cms.imgix.net/https%3A%2F%2Fimages.onefootball.com%2Ficons%2Fteams%2F164%2F38.png?auto=format%2Ccompress&crop=faces&dpr=2&fit=crop&h=22&q=25&w=22&s=34337e6ebce324335ee389617508f129'
        //     let createImg = document.createElement('img');
        //     let match = document.querySelector('.left')
        //                 createImg.src = imageLink;
        //                 match.appendChild(createImg);
        // }
        // make();

            const resultsQuarter = []

            resultsData.forEach(item => {
                resultsQuarter.push(item[" Quarter-finals "])
            })

            const quarterInside = resultsQuarter[0]
            const quarterCountrys = []
            quarterInside.forEach(item => {
                quarterCountrys.push(item["awayTeam"], item["homeTeam"])
            })

            const quarterSort = [...quarterCountrys].reverse();

            const quarter1 = quarterSort.splice(0,1)
            document.getElementById('quarter1').innerHTML = quarter1;

            const quarter2 = quarterSort.splice(0,1)
            document.getElementById('quarter2').innerHTML = quarter2;

            const quarter3 = quarterSort.splice(0,1)
            document.getElementById('quarter3').innerHTML = quarter3;

            const quarter4 = quarterSort.splice(0,1)
            document.getElementById('quarter4').innerHTML = quarter4;

            const quarter5 = quarterSort.splice(0,1)
            document.getElementById('quarter5').innerHTML = quarter5;

            const quarter6 = quarterSort.splice(0,1)
            document.getElementById('quarter6').innerHTML = quarter6;

            const quarter7 = quarterSort.splice(0,1)
            document.getElementById('quarter7').innerHTML = quarter7;

            const quarter8 = quarterSort.splice(0,1)
            document.getElementById('quarter8').innerHTML = quarter8;

            const resultsSemis = []
            resultsData.forEach(item => {
                resultsSemis.push(item[" Semi-finals "])
            })

            const semisInside = resultsSemis[0]
            const semisCountrys = []
            semisInside.forEach(item => {
                semisCountrys.push(item["awayTeam"], item["homeTeam"])
            })

            const semisSort = [...semisCountrys].reverse();

            const semis1 = semisSort.splice(0,1)
            document.getElementById('semis1').innerHTML = semis1;

            const semis2 = semisSort.splice(0,1)
            document.getElementById('semis2').innerHTML = semis2;

            const semis3 = semisSort.splice(0,1)
            document.getElementById('semis3').innerHTML = semis3;

            const semis4 = semisSort.splice(0,1)
            document.getElementById('semis4').innerHTML = semis4;

            const resultsFinal = []
            resultsData.forEach(item => {
                resultsFinal.push(item[" Final "])
            })

            const finalInside = resultsFinal[0]
            const finalCountrys = []
            finalInside.forEach(item => {
                finalCountrys.push(item["awayTeam"], item["homeTeam"])
            })

            const finalSort = [...finalCountrys].reverse();

            const final1 = finalSort.splice(0,1)
            document.getElementById('final1').innerHTML = final1;

            const final2 = finalSort.splice(0,1)
            document.getElementById('final2').innerHTML = final2;
    });

    });