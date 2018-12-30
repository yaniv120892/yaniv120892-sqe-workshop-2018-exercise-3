let fillShapes = false;

function buildNode(node, index) {
    let ans = '';
    ans += 'n'+index +' [label="['+(index+1)+']\n' + node.label +'"';
    let shape = 'box';
    if (node.true != null || node.false != null)
        shape = 'diamond';
    ans += ' shape="'+ shape+'"';
    if (fillShapes && node.green === true)
        ans +=' fillcolor=green style=filled';
    return ans+']\n';

}


function buildNodes(graphNodes){
    let ans = '';
    for (let [i, node] of graphNodes.entries())
        ans = ans + buildNode(node, i);
    return ans;
}

function buildConnections(graphNodes){
    let ans = '';
    for (const [i, node] of graphNodes.entries()) {
        if(node['normal']) ans = ans + buildNormalConn(graphNodes,node['normal'] , i);
        if(node['true']) ans = ans + buildTrueConn(graphNodes,node['true'], i);
        if(node['false']) ans = ans + buildFalseConn(graphNodes, node['false'], i);
    }
    return ans;
}

function buildNormalConn(graphNodes,nextNode, i){
    return 'n'+i+' -> n'+graphNodes.indexOf(nextNode)+' []\n';
}

function buildTrueConn (graphNodes, nextNode, i){
    return 'n'+i+' -> n'+graphNodes.indexOf(nextNode)+' [label="T"]\n';
}

function buildFalseConn (graphNodes, nextNode, i){
    return 'n'+i+' -> n'+graphNodes.indexOf(nextNode)+' [label="F"]\n';

}

const buildGraph = (graphNodes, argsEqParam) => {
    fillShapes = argsEqParam;
    let ans = 'digraph cfg {';
    ans = ans  + buildNodes(graphNodes) + buildConnections(graphNodes);
    ans = ans + ' }';
    return ans;
};


export {buildGraph};