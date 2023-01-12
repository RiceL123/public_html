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
        { "source": 'Resume', "target": "LinkedIn"},
    ]
};

// getting the graph container
let container = d3.select('.graph-container');
var width = 1000;
var height = 500;
var radius = 10;

// Force simulation
const simulation = d3.forceSimulation(graph.nodes)
    .force("charge", d3.forceManyBody().strength(-300))
    .force("link", d3.forceLink(graph.links).id(function id(d) {return d.id;}).distance(70))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(radius + 1))
    .force("x", d3.forceX())    // prevent subgraphs from leaving viewport
    .force("y", d3.forceY())    // prevent subgraphs from leaving viewport
    .on("tick", ticked);

// Binding the force simulation to the data of links
var link = container.append("g")    // this "g" is a container for the svg
    .selectAll('line')
    .data(graph.links)
    .join('line')
    .attr('class', 'graph-link');

var nodeTextShow = function(d) {
    // Highlight hovered node
    d3.select(this)
        .transition()
        .duration(200)
        .style("fill", "red")
        
    // Find all links connected to hovered node
    var connectedLinks = link.filter(function(l) {
        return l.source.id == d.id || l.target.id == d.id;
    });

    // Highlight connected links
    connectedLinks
        .transition()
        .duration(200)
        .style("stroke", "red");
        
    // Find all connected nodes
    var connectedNodes = node.filter(function(n) {
        var source = connectedLinks.data().find(function(l) {
            return l.source.id == n.id;
        });
        var target = connectedLinks.data().find(function(l) {
            return l.target.id == n.id;
        });
        return source || target;
    });
    
    // Highlight connected nodes
    connectedNodes
        .transition()
        .duration(200)
        .style("fill", "red")
}

var nodeTexthide = function(d) {
    // Reset hovered node
    d3.select(this)
        .transition()
        .duration(200)
        .style("fill", "rgb(235, 162, 174)")
        
    // Find all links connected to hovered node
    var connectedLinks = link.filter(function(l) {
        return l.source.id == d.id || l.target.id == d.id;
    });

    // reset connected links
    connectedLinks
        .transition()
        .duration(200)
        .style("stroke", "black");
        
    // Find all connected nodes
    var connectedNodes = node.filter(function(n) {
        var source = connectedLinks.data().find(function(l) {
            return l.source.id == n.id;
        });
        var target = connectedLinks.data().find(function(l) {
            return l.target.id == n.id;
        });
        return source || target;
    });
    
    // reset connected nodes
    connectedNodes
        .transition()
        .duration(200)
        .style("fill", "rgb(235, 162, 174)")
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

// node will be attracted towards the center because of d3.forceX() and d3.forceY()
node
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);

// Function so that the nodes do not go out of the graph-container
// node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
//     .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
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

