import { ForceGraph } from "./force-graph.js";

const myData = {
    nodes: [{id: "a"}, {id: "b"}, {id: "c"}],
    links: [{source: "a", target: "b"}, {source: "b", target: "c"}]
};
  
const options = {
    nodeTitle: d => d.id,
    nodeFill: "blue",
    linkStroke: "red",
    width: 640,
    height: 480
};

document.addEventListener("DOMContentLoaded", function(event) { 
    const container = d3.select("#graph-container");
    console.log(d3);
    const myGraph = ForceGraph(myData, options);
    container.append(myGraph._groups[0][0]);
});
