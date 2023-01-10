data = ['a', 'b', 'c', 'd', 'e', 'f']



d3.select(".graph-container")
    .append('circle')
    .attr('class', 'graph-node')
    .attr('cx', '50%')
    .attr('cy', '50%')
    .attr('r', 20);