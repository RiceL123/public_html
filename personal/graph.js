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
        { "source": 'Personal', "target": 'Instagram' },
        { "source": 'Twitter', "target": 'MyAnimeList' },
        { "source": 'Tetrio', "target": 'Jstris' },
    ]
};

// getting the graph container
let container = d3.select('.graph-container');
var width = 1000;
var height = 500;
var radius = 10;

// Force simulation
const simulation = d3.forceSimulation(graph.nodes)
    .force("gravity", d3.forceManyBody().strength(1))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("link", d3.forceLink(graph.links).id(function id(d) {return d.id;}).distance(70))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

// Binding the force simulation to the data of links
var link = container.append("g")    // this "g" is a container for the svg
    .selectAll('line')
    .data(graph.links)
    .join('line')
    .attr('class', 'graph-link');

var nodeTextShow = function(d) {
    d3.select(this)
        .style("stroke", "black")
}

var nodeTexthide = function(d) {
    d3.select(this)
      .style("stroke", "none")
}

// Binding the force simulation to the data of nodes
var node = container.append("g")
    .selectAll('circle')
    .data(graph.nodes)
    .join('circle')
    .attr('class', 'graph-node')
    .attr('r', radius)
    .on("mouseover", nodeTextShow)
    .on("mouseout", nodeTexthide)
    .call(drag(simulation));

    

function ticked() {
link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

// node
//     .attr("cx", d => d.x)
//     .attr("cy", d => d.y);

// Function so that the nodes do not go out of the graph-container
node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
    .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
}

// function for dragging nodes around
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

