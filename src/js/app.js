import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {createGraph} from './graph-generator';
import {colorGraph} from './graph-color';
import {buildGraph} from './graph-builder';
import {Module, render } from 'viz.js/full.render.js';
import Viz from 'viz.js';


$(document).ready(function () {
    $('#createGraphButton').click(() => {
        let parsedCode = parseCode($('#originCodeInput').val());
        let funcArgsInput =$('#funcArgsInput').val();
        let graphNodes = createGraph(parsedCode);
        let fillShapes = colorGraph(graphNodes, funcArgsInput, parsedCode);
        let ans = buildGraph(graphNodes, fillShapes);
        let viz = new Viz({Module, render });
        let graph = document.getElementById('graphResult');
        viz.renderSVGElement( ans).then(function (element) {
            graph.innerHTML ='';
            graph.append(element);
        });
    });
});
