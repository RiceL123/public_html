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

    function nodeTextShow(d) {
        // Highlight hovered node
        d3.select(this)
            .transition()
            .duration(200)
            .style("fill", "red");
        
        // edit the text
        d3.select(this.parentNode).select("text")
            .transition()
            .duration(200)
            .style("font-size", "30px")
            .style("fill", "red")
            .attr("transform", `translate(0, ${radius * 4})`)
    }

    function nodeTexthide(d) {
        // Reset hovered node
        d3.select(this)
            .transition()
            .duration(200)
            .style("fill", "rgb(235, 162, 174)");
        
        // Decrease font-size of text
        d3.select(this.parentNode).select("text")
            .transition()
            .duration(200)
            .style("font-size", "25px")
            .style("fill", "black")
            .attr("transform", `translate(0, ${radius * 3})`)
    }

    // on click the active link in the links div is going to be set
    function highlightNode(d) {
        console.log(d);
        console.log(d.id);

        const id = d.target.__data__.id;

        console.log(id);

        var element = document.getElementById(`${id}`);
        element.classList.add("active");
    }

    // nodeCaontainer to hold the node and the text
    var nodeContainer = container.append("g")
        .selectAll("g")
        .data(graph.nodes)
        .join("g")
        .call(drag(simulation));
    
    // node with functionality to call functions
    nodeContainer.append('circle')
        .attr('class', 'graph-node')
        .attr('r', radius)
        .attr('id', function(d) {return d.id})
        .on("mouseover", nodeTextShow)
        .on("mouseout", nodeTexthide)
        .on("click", highlightNode)
        .on("dblclick", function(d) {
            // console.log(this.href);
            window.location.href = d.toElement.__data__.href;
        });

    // appending the text to be aligned below the node
    nodeContainer.append('text')
        .attr("text-anchor", "middle")
        .attr("transform", `translate(0, ${radius * 3})`)
        .text(function(d) {return d.id;});

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        // nodeContainer which is <g></g> element only accepts transform and not d.x and d.y unfortunately
        nodeContainer
            .attr("transform", function(d) {
                return `translate(${d.x},${d.y})`;
            })
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

