function createGraphRepresentation(g) {
  console.log(g);
  var repr = { nodes:[], edges:[] };
  var N = g.nodes.length;
  for (i in g.nodes) {
    var node = g.nodes[i];
    var newnode = {
        id: node.id,
        label: node.label,
        x: 100 * Math.cos(2 * i * Math.PI / N),
        y: 100 * Math.sin(2 * i * Math.PI / N),
        size: 2.0,
        color: node.color
      };
    repr.nodes[i] = newnode;
  }
  
  for (i in g.edges) {
    var edge = g.edges[i];
    var newedge = {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label
      };
    repr.edges[i] = newedge;
  }
  
  return repr;
}
