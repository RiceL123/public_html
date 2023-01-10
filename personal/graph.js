data = ['a', 'b', 'c', 'd', 'e', 'f']

d3.select(".graph-container")
    .selectAll('div')   // 0 div's in graph-conatiner
    .data(data)     // 6 divs in data
    .enter()        // an enter node is creating for the missing data 6 - 0 = 6
    .append('div')  // appends 6 of the missing data
    .attr('class', 'graph-node')    // gives an attribute 
    .text(d => d);  // displays the text -> can also display the index with (d, i) => i


