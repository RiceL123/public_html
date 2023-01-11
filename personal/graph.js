// graph data
graph = {
    nodes: [
        { "id": 'Home' },
        { "id": 'Personal' },
        { "id": 'Blog' },
        { "id": 'LinkedIn' },
        { "id": 'GitHub' },
        { "id": 'Resume' },
        { "id": 'Youtube' },
        { "id": 'Twitch' },
        { "id": 'Instagram' },
        { "id": 'Twitter' },
        { "id": 'Reddit' },
        { "id": 'MyAnimeList' },
        { "id": 'Tetrio' },
        { "id": 'Jstris' },
        { "id": 'Osu' },
    ],
    links: [
        { "source": 'Home', "target": 'Personal' },
        { "source": 'Home', "target": 'Blog' },
        { "source": 'Home', "target": 'LinkedIn' },
        { "source": 'Personal', "target": 'Youtube' },
        { "source": 'Personal', "target": 'Twitch' },
    ]
};

// getting the graph container
var conatiner = d3.select('.graph-container')
var width = conatiner.attr("width");
var height = conatiner.attr("height");

// Force simulation
const simulation = d3.forceSimulation(graph.nodes)
    .force("charge", d3.forceManyBody().strength(-30))
    .force("link", d3.forceLink(graph.links).id(function id(d) {return d.id;}).links(graph.links))
    .force("center", d3.forceCenter(500, 250))
    .on("tick", ticked);

// Binding the force simulation to the data of links
var link = conatiner.append("g")    // this "g" is a container for the svg
    .selectAll('line')
    .data(graph.links)
    .join('line')
    .attr('class', 'graph-link');

// Bind the force simulation to the data of nodes
var node = conatiner.append("g")
    .selectAll('circle')
    .data(graph.nodes)
    .join('circle')
    .attr('class', 'graph-node')
    .call(drag(simulation));

function ticked() {
link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

node
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);
}

function drag(simulation) {    
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.2).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}
// d3.select(".graph-container")
//     .selectAll('circle')   // 0 div's in graph-conatiner
//     .data(graph.nodes)     // 6 divs in data
//     .enter()        // an enter node is creating for the missing data 6 - 0 = 6
//     .append('circle')  // appends 6 of the missing data
//     .attr('class', 'graph-node')    // gives an attribute 
//     .attr('r', 20)
//     .attr('cx', '50%')
//     .attr('cy', '50%')
//     .text(d => d.id);  // displays the text -> can also display the index with (d, i) => i


