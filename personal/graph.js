// parsing the graph.json data so that we have something to bind to
fetch('./graph.json')
    .then(response => response.json())
    .then(data => {
        // calling the object that was made parsing the json to be named graph
        let graph = data;
        // console.log(graph);
    
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
        .force("x", d3.forceX(width / 2).strength(0.1))    // prevent subgraphs from leaving viewport
        .force("y", d3.forceY(height / 2).strength(0.1))    // prevent subgraphs from leaving viewport
        .alphaTarget(0.1)  // makes decay slower
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

    function openLink(d) {
            console.log(d3.select(this));
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
        .on("click", openLink)
        .call(drag(simulation));

    // create text element for each node
    var nodeText = container.append("g")
        .selectAll("text")
        .data(graph.nodes)
        .enter()
        .append("text")
        .text(function(d) { return d.id; }) // set text to node's name
        .attr("x", function(d) { return d.x; }) // position text at node's x position
        .attr("y", function(d) { return d.y + radius + 5; }); // position text slightly below node's y position

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        // node will be attracted towards the center because of d3.forceX() and d3.forceY()
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)

        // Function so that the nodes do not go out of the graph-container
        // node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        //     .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
        
        nodeText
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y + radius + 5; });
    }

    // function for dragging nodes around
    function drag(simulation) {    
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.4).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0.1);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
});

