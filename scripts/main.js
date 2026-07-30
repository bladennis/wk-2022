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

        const groups = Array.from({ length: 8 }, () => tableData.splice(0, 4));
        const [groupA, groupB, groupC, groupD, groupE, groupF, groupG, groupH] = groups;

        groups.forEach(group => group.sort((a, b) => a.Place - b.Place));

        const tablesContainer = document.getElementById('tables');

        function generateTable(group, label) {
            const table = document.createElement('table');
            const caption = document.createElement('caption');
            caption.textContent = `Poule ${label}`;
            table.appendChild(caption);

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');

            Object.keys(group[0]).forEach(key => {
                const newElement = document.createElement('th');
                newElement.textContent = key;
                headerRow.appendChild(newElement);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');

            group.forEach(obj => {
                const tr = document.createElement('tr');

                Object.entries(obj).forEach(([key, value]) => {
                    const td = document.createElement('td');

                    if (key === 'Flag') {
                        const imageEl = document.createElement('img');
                        imageEl.src = value;
                        td.appendChild(imageEl);
                    } else {
                        td.textContent = value;
                    }

                    tr.appendChild(td);
                });

                tbody.appendChild(tr);
            });

            table.appendChild(tbody);
            tablesContainer.appendChild(table);
        }

        [
            { group: groupA, label: 'A' },
            { group: groupB, label: 'B' },
            { group: groupC, label: 'C' },
            { group: groupD, label: 'D' },
            { group: groupE, label: 'E' },
            { group: groupF, label: 'F' },
            { group: groupG, label: 'G' },
            { group: groupH, label: 'H' }
        ].forEach(({ group, label }) => generateTable(group, label));

        // ----------------------------------------
        // KNOCKOUT
        // ----------------------------------------
        
        const seedGroups = [
            { ids: ['A1', 'A2'], group: groupA },
            { ids: ['B1', 'B2'], group: groupB },
            { ids: ['C1', 'C2'], group: groupC },
            { ids: ['D1', 'D2'], group: groupD },
            { ids: ['E1', 'E2'], group: groupE },
            { ids: ['F1', 'F2'], group: groupF },
            { ids: ['G1', 'G2'], group: groupG },
            { ids: ['H1', 'H2'], group: groupH }
        ];

        seedGroups.forEach(({ ids, group }) => {
            ids.forEach((id, index) => {
                document.getElementById(id).innerHTML = group[index]?.Nation ?? '';
            });
        });

        // function make() {
        //     const imageLink = 'https://oneftbl-cms.imgix.net/https%3A%2F%2Fimages.onefootball.com%2Ficons%2Fteams%2F164%2F38.png?auto=format%2Ccompress&crop=faces&dpr=2&fit=crop&h=22&q=25&w=22&s=34337e6ebce324335ee389617508f129'
        //     let createImg = document.createElement('img');
        //     let match = document.querySelector('.left')
        //                 createImg.src = imageLink;
        //                 match.appendChild(createImg);
        // }
        // make();

            const roundConfigs = [
                { key: ' Quarter-finals ', ids: ['quarter1', 'quarter2', 'quarter3', 'quarter4', 'quarter5', 'quarter6', 'quarter7', 'quarter8'] },
                { key: ' Semi-finals ', ids: ['semis1', 'semis2', 'semis3', 'semis4'] },
                { key: ' Final ', ids: ['final1', 'final2'] }
            ];

            roundConfigs.forEach(({ key, ids }) => {
                const matches = resultsData[0]?.[key] ?? [];
                const countries = matches.flatMap(match => [match.homeTeam, match.awayTeam]).reverse();

                ids.forEach((id, index) => {
                    document.getElementById(id).innerHTML = countries[index] ?? '';
                });
            });
    });

    });