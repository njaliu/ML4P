function createGraphRepresentation(data) {
    console.log(data);
    var sel = {
        nodes: [],
        edges: []
    }, total = data.nodes.length;
    for (i in data.nodes) {
        var node = data.nodes[i], replacement = {
            id: node.id,
            label: node.label,
            x: 100 * Math.cos(2 * i * Math.PI / total),
            y: 100 * Math.sin(2 * i * Math.PI / total),
            size: 2,
            color: node.color
        };
        sel.nodes[i] = replacement;
    }
    for (i in data.edges) {
        var e = data.edges[i], r = {
            id: e.id,
            source: e.source,
            target: e.target,
            label: e.label
        };
        sel.edges[i] = r;
    }
    return sel;
}
