import * as escodegem from 'escodegen';
import * as esgraph  from 'esgraph';




function fixReturnNodes(graphNodes) {
    for(let i = 0; i < graphNodes.length; i++){
        if(graphNodes[i].astNode.type === 'ReturnStatement')
        {
            graphNodes[i].next=[]; delete graphNodes[i].normal;
        }
    }
}


function setLabelForNodes(graphNodes) {
    graphNodes.forEach(node => node.label = escodegem.generate(node.astNode, {format: {compact: true}}));
}

function cleanGraph(graphNodes) {
    graphNodes[0].prev = [];
    fixReturnNodes(graphNodes);
    setLabelForNodes(graphNodes);
    //concatNodes(graphNodes);
}

const createGraph = (parsedCode) => {
    let esgraphRes = esgraph(parsedCode.body[0].body)[2];
    let graphNodes =  esgraphRes.slice(1, esgraphRes.length - 1);
    cleanGraph(graphNodes);
    return graphNodes;
};


export {createGraph};