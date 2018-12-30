import {parseCode} from '../src/js/code-analyzer';
import {colorGraph} from '../src/js/graph-color';
import {buildGraph} from '../src/js/graph-builder';
import {createGraph} from '../src/js/graph-generator';
import assert from 'assert';


describe('CFG for simple function without if,', () => {
    it('without args', () => {
        let parsedCode = parseCode('function foo(){\nvar a;\nlet a = 2;\na = a * a;\nreturn a;\n}');
        let graphNodes = createGraph(parsedCode);
        let fillShapes = colorGraph(graphNodes, '', parsedCode);
        let ans = buildGraph(graphNodes, fillShapes);
        assert.deepEqual(ans, 'digraph cfg {' +
            'n0 [label="[1]\nvar a;" shape="box" fillcolor=green style=filled]\nn1 [label="[2]\nlet a=2;" shape="box" fillcolor=green style=filled]\nn2 [label="[3]\na=a*a" shape="box" fillcolor=green style=filled]\n' +
            'n3 [label="[4]\nreturn a;" shape="box" fillcolor=green style=filled]\nn0 -> n1 []\nn1 -> n2 []\nn2 -> n3 []\n }');});
    it('with args', () => {
        let parsedCode = parseCode('function foo(x){\nlet a = 2;\na = a * x;\nreturn a;\n}');
        let graphNodes = createGraph(parsedCode);
        let fillShapes = colorGraph(graphNodes, '1', parsedCode);
        let ans = buildGraph(graphNodes, fillShapes);
        assert.deepEqual(ans, 'digraph cfg {' +
            'n0 [label="[1]\nlet a=2;" shape="box" fillcolor=green style=filled]\nn1 [label="[2]\na=a*x" shape="box" fillcolor=green style=filled]\nn2 [label="[3]\nreturn a;" shape="box" fillcolor=green style=filled]\n' +
            'n0 -> n1 []\nn1 -> n2 []\n }');});});
describe('CFG for init arrays without if', ()=>{
    it('with array assignment', () => {
        let parsedCode = parseCode('function foo(x){\nlet a = 2;\nx[a] = 7;\nreturn a;\n}');
        let graphNodes = createGraph(parsedCode);
        let fillShapes = colorGraph(graphNodes, '[1,2,3]', parsedCode);
        let ans = buildGraph(graphNodes, fillShapes);
        assert.deepEqual(ans, 'digraph cfg {' +
            'n0 [label="[1]\nlet a=2;" shape="box" fillcolor=green style=filled]\nn1 [label="[2]\nx[a]=7" shape="box" fillcolor=green style=filled]\nn2 [label="[3]\nreturn a;" shape="box" fillcolor=green style=filled]\n' +
            'n0 -> n1 []\nn1 -> n2 []\n }');});
    it('with array assignment, no colors', () => {
        let parsedCode = parseCode('function foo(x, b){\nlet a = 2;\nx[b] = 7;\nreturn a;\n}');
        let graphNodes = createGraph(parsedCode);
        let fillShapes = colorGraph(graphNodes, '', parsedCode);
        let ans = buildGraph(graphNodes, fillShapes);
        assert.deepEqual(ans, 'digraph cfg {' +
            'n0 [label="[1]\nlet a=2;" shape="box"]\nn1 [label="[2]\nx[b]=7" shape="box"]\nn2 [label="[3]\nreturn a;" shape="box"]\n' +
            'n0 -> n1 []\nn1 -> n2 []\n }');});});

describe('CFG for simple function with if', () => {
    it('without args', () => {
        let parsedCode = parseCode('function foo(){\nvar a;\nlet a = 2;\nif(a < 3){\na = a * a;\n}\nelse{\na = a + a;\n}\nreturn a;\n}');
        let graphNodes = createGraph(parsedCode);
        let fillShapes = colorGraph(graphNodes, '', parsedCode);
        let ans = buildGraph(graphNodes, fillShapes);
        assert.deepEqual(ans, 'digraph cfg {' +
            'n0 [label="[1]\nvar a;" shape="box" fillcolor=green style=filled]\nn1 [label="[2]\nlet a=2;" shape="box" fillcolor=green style=filled]\nn2 [label="[3]\na<3" shape="diamond" fillcolor=green style=filled]\n' +
            'n3 [label="[4]\na=a*a" shape="box" fillcolor=green style=filled]\nn4 [label="[5]\nreturn a;" shape="box" fillcolor=green style=filled]\nn5 [label="[6]\na=a+a" shape="box"]\n' +
            'n0 -> n1 []\nn1 -> n2 []\nn2 -> n3 [label="T"]\nn2 -> n5 [label="F"]\nn3 -> n4 []\nn5 -> n4 []\n }');});
    it('with args', () => {
        let parsedCode = parseCode('function foo(x,y){\nlet z = 2;\nif(x > y){\nz = z * z;\n}\nelse{\nz = z + z;\n}\nreturn z;\n}');
        let graphNodes = createGraph(parsedCode);
        let fillShapes = colorGraph(graphNodes, '1,2', parsedCode);
        let ans = buildGraph(graphNodes, fillShapes);
        assert.deepEqual(ans, 'digraph cfg {' +
            'n0 [label="[1]\nlet z=2;" shape="box" fillcolor=green style=filled]\nn1 [label="[2]\nx>y" shape="diamond" fillcolor=green style=filled]\nn2 [label="[3]\nz=z*z" shape="box"]\n' +
            'n3 [label="[4]\nreturn z;" shape="box" fillcolor=green style=filled]\nn4 [label="[5]\nz=z+z" shape="box" fillcolor=green style=filled]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n4 [label="F"]\nn2 -> n3 []\nn4 -> n3 []\n }');});});

describe('CFG for simple function with while,', () => {
    it('without args', () => {
        let parsedCode = parseCode('function foo(){\nlet a = 2;\nwhile(a < 3){\na++;\n}\nreturn a;\n}');
        let graphNodes = createGraph(parsedCode);
        let fillShapes = colorGraph(graphNodes, '', parsedCode);
        let ans = buildGraph(graphNodes, fillShapes);
        assert.deepEqual(ans, 'digraph cfg {' +
            'n0 [label="[1]\nlet a=2;" shape="box" fillcolor=green style=filled]\nn1 [label="[2]\na<3" shape="diamond" fillcolor=green style=filled]\nn2 [label="[3]\na++" shape="box" fillcolor=green style=filled]\n' +
            'n3 [label="[4]\nreturn a;" shape="box" fillcolor=green style=filled]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n3 [label="F"]\nn2 -> n1 []\n }');});
    it('with args', () => {
        let parsedCode = parseCode('function foo(x){\nlet a =0;\nwhile(x[2] > a){\na = a + 2;\n}\nreturn a;\n}');
        let graphNodes = createGraph(parsedCode);
        let fillShapes = colorGraph(graphNodes, '[1,2,3]', parsedCode);
        let ans = buildGraph(graphNodes, fillShapes);
        assert.deepEqual(ans, 'digraph cfg {' +
            'n0 [label="[1]\nlet a=0;" shape="box" fillcolor=green style=filled]\nn1 [label="[2]\nx[2]>a" shape="diamond" fillcolor=green style=filled]\nn2 [label="[3]\na=a+2" shape="box" fillcolor=green style=filled]\n' +
            'n3 [label="[4]\nreturn a;" shape="box" fillcolor=green style=filled]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n3 [label="F"]\nn2 -> n1 []\n }');});
});
describe('CFG for complex function with while,', () => {
    it('with args and with array as argument', () => {
        let parsedCode = parseCode('function foo(x){\nlet a = 1;\nwhile(x[a] < 3){\nx[a]++;\nx[0]++;\n}\nreturn x[a];\n}');
        let graphNodes = createGraph(parsedCode);
        let fillShapes = colorGraph(graphNodes, '[1,2,3]', parsedCode);
        let ans = buildGraph(graphNodes, fillShapes);
        assert.deepEqual(ans, 'digraph cfg {' +
            'n0 [label="[1]\nlet a=1;" shape="box" fillcolor=green style=filled]\nn1 [label="[2]\nx[a]<3" shape="diamond" fillcolor=green style=filled]\nn2 [label="[3]\nx[a]++" shape="box" fillcolor=green style=filled]\nn3 [label="[4]\nx[0]++" shape="box" fillcolor=green style=filled]\n' +
            'n4 [label="[5]\nreturn x[a];" shape="box" fillcolor=green style=filled]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n4 [label="F"]\nn2 -> n3 []\nn3 -> n1 []\n }');});
    it('with args and with array as variable', () => {
        let parsedCode = parseCode('function foo(){\nlet a = [1,2,3];\nwhile(a[1] < 3){\na[1]++;\na[2]++;\n}\nreturn a[2];\n}');
        let graphNodes = createGraph(parsedCode);
        let fillShapes = colorGraph(graphNodes, '', parsedCode);
        let ans = buildGraph(graphNodes, fillShapes);
        assert.deepEqual(ans, 'digraph cfg {' +
            'n0 [label="[1]\nlet a=[1,2,3];" shape="box" fillcolor=green style=filled]\nn1 [label="[2]\na[1]<3" shape="diamond" fillcolor=green style=filled]\nn2 [label="[3]\na[1]++" shape="box" fillcolor=green style=filled]\nn3 [label="[4]\na[2]++" shape="box" fillcolor=green style=filled]\n' +
            'n4 [label="[5]\nreturn a[2];" shape="box" fillcolor=green style=filled]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n4 [label="F"]\nn2 -> n3 []\nn3 -> n1 []\n }');});
});
describe('CFG for complex function without colors,', () => {
    it('', () => {
        let parsedCode = parseCode('function foo(x){\nlet a = 1;\nwhile(x[a] < 3){\nx[a]++;\nx[0] = x[a] * 2;\n}\nreturn x[a];\n}');
        let graphNodes = createGraph(parsedCode);
        let fillShapes = colorGraph(graphNodes, '', parsedCode);
        let ans = buildGraph(graphNodes, fillShapes);
        assert.deepEqual(ans, 'digraph cfg {' +
            'n0 [label="[1]\nlet a=1;" shape="box"]\nn1 [label="[2]\nx[a]<3" shape="diamond"]\nn2 [label="[3]\nx[a]++" shape="box"]\nn3 [label="[4]\nx[0]=x[a]*2" shape="box"]\n' +
            'n4 [label="[5]\nreturn x[a];" shape="box"]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n4 [label="F"]\nn2 -> n3 []\nn3 -> n1 []\n }');});});
describe('CFG for simple function with if', () => {
    it('without args and with return in middle', () => {
        let parsedCode = parseCode('function foo(){\nlet a = 2;\nif(a < 3){\nreturn a * a;\n}\nelse{\nreturn a + a;\n}}');
        let graphNodes = createGraph(parsedCode);
        let fillShapes = colorGraph(graphNodes, '', parsedCode);
        let ans = buildGraph(graphNodes, fillShapes);
        assert.deepEqual(ans, 'digraph cfg {' +
            'n0 [label="[1]\nlet a=2;" shape="box" fillcolor=green style=filled]\nn1 [label="[2]\na<3" shape="diamond" fillcolor=green style=filled]\n' +
            'n2 [label="[3]\nreturn a*a;" shape="box" fillcolor=green style=filled]\nn3 [label="[4]\nreturn a+a;" shape="box"]\n' +
            'n0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n3 [label="F"]\n }');});});
describe('CFG for simple function with if', () => {
    it('without args and with return in middle', () => {
        let parsedCode = parseCode('function foo(a){\nlet arr = [1,2,3]\nif(arr[a] < 3){\nreturn a * a;\n}\nelse{\nreturn a + a;\n}}');
        let graphNodes = createGraph(parsedCode);
        let fillShapes = colorGraph(graphNodes, '', parsedCode);
        let ans = buildGraph(graphNodes, fillShapes);
        assert.deepEqual(ans, 'digraph cfg {' +
            'n0 [label="[1]\nlet arr=[1,2,3];" shape="box"]\nn1 [label="[2]\narr[a]<3" shape="diamond"]\n' +
            'n2 [label="[3]\nreturn a*a;" shape="box"]\nn3 [label="[4]\nreturn a+a;" shape="box"]\n' +
            'n0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n3 [label="F"]\n }');});});