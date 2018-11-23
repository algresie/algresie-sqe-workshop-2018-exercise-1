import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';


describe('my parser',()=>{
    it('is parsing an empty program correctly',()=>{
        assert.deepEqual(parseCode(''),[]);
    });
    it('test else not if',()=>{
        assert.deepEqual(parseCode('function maya(a){\n' +
           'if(a==1)\n' +
           'return 1;\n' +
           'else\n' +
           'return -1;\n' +
           '}'),['1','function declaration','maya','\t','\t',
            '1',	'variable declaration',	'a','\t','\t',
            '2',	'if statement','\t','a	==	1','\t',
            '3','return statement','\t','\t','1',
            '5','return statement','\t','\t','-1']);
    });
    it('test empty function',()=>{
        assert.deepEqual(parseCode('function check(a){\n' +
           '\n' +
           '}'),['1','function declaration','check','\t','\t',
            '1','variable declaration','a','\t','\t']);
    });
    it('test let',()=>{
        assert.deepEqual(parseCode('let a=2;'),['1','variable declaration','a','\t','2']);
    });
    it('test empty for',()=>{
        let a=parseCode('for(let i=0;i< 100;i++)\n' +
            '{}');
        let b=['1','for statement','\t','i\t<\t100','\t',
            '1','variable declaration','i','\t','0',
            '1','assigment expression','i','\t','i++'];
        for (let i = 0; i < b.length; i++)
            assert.equal(a[i], b[i]);
    });
    it('test my test',()=>{
        assert.deepEqual(parseCode('function my(a){\n' +
            'if(a)\n' +
            'a=false;\n' +
            '}'),['1','function declaration','my','\t','\t',
            '1','variable declaration',	'a','\t','\t',
            '2','if statement','\t','a','\t',
            '3','assignment expression','a','\t',false]);
    });
    it('test for',()=>{

        assert.deepEqual(parseCode('function binarySearch(l){\n' +
            '    for(i=0;i<l.length;i++)\n' +
            '{\n' +
            'l[i]=0;\n' +
            '}\n' +
            '}'),
        ['1','function declaration','binarySearch','\t','\t',
            '1','variable declaration','l','\t','\t',
            '2','for statement','\t','i\t<\tl.length','\t',
            '2',	'assignment expression','i','\t','0',
            '2','assigment expression','i','\t','i++',
            '4','assignment expression','l[i]','\t','0']
        );});
    it('test if without else', ()=> {
        let a = parseCode('function check(a){\n' +
            'if(a)\n' +
            'return 10;\n' +
            'return 0;}');
        let b = ['1', 'function declaration', 'check', '\t', '\t',
            '1', 'variable declaration', 'a', '\t', '\t',
            '2', 'if statement', '\t', 'a', '\t',
            '3', 'return statement', '\t', '\t', '10',
            '4', 'return statement', '\t', '\t', '0'];
        for (let i = 0; i < b.length; i++)
            assert.equal(a[i], b[i]);
    });
    it('test if with else', ()=> {
        let a = parseCode('function check(a){\n' +
            'if(a)\n' +
            'return 10;\n' +
            'else\n'+
            'return 0;}');
        let b = ['1', 'function declaration', 'check', '\t', '\t',
            '1', 'variable declaration', 'a', '\t', '\t',
            '2', 'if statement', '\t', 'a', '\t',
            '3', 'return statement', '\t', '\t', '10',
            '5', 'return statement', '\t', '\t', '0'];
        for (let i = 0; i < b.length; i++)
            assert.equal(a[i], b[i]);
    });
    it('test empty while',()=>{
        assert.deepEqual(parseCode('while(a)\n' +
           '{\n' +
           '}'),['1','while statement','\t','a','\t']);
    });
    it('test while',()=>{
        assert.deepEqual(parseCode('function check(a){\n' +
            'while(a<2)\n' +
            '  a=a-10;\n' +
            '}'),['1','function declaration','check','\t','\t',
            '1','variable declaration','a','\t','\t',
            '2','while statement','\t','a\t<\t2','\t',
            '3','assignment expression','a','\t','a\t-\t10']);
    });
    it('another test to test',()=>{
        assert.deepEqual(parseCode(
            'function my(a){\n' +
            'let b,c,d;\n' +
            'b=0;\n' +
            'c=a;\n' +
            'd=1;\n' +
            '}'),['1','function declaration','my','\t','\t',
            '1','variable declaration','a','\t','\t',
            '2','variable declaration',	'b','\t','\t',
            '2','variable declaration','c','\t','\t',
            '2','variable declaration','d','\t','\t',
            '3','assignment expression','b','\t','0',
            '4','assignment expression','c','\t','a',
            '5','assignment expression','d','\t','1']
        );
    });
    it('is parsing code example',()=>{
        let a=parseCode('function binarySearch(X, V, n){\n' +
            '    let low, high, mid;\n' +
            '    low = 0;\n' +
            '    high = n - 1;\n' +
            '    while (low <= high) {\n' +
            '        mid = (low + high)/2;\n' +
            '        if (X < V[mid])\n' +
            '            high = mid - 1;\n' +
            '        else if (X > V[mid])\n' +
            '            low = mid + 1;\n' +
            '        else\n' +
            '            return mid;\n' +
            '    }\n' +
            '    return -1;\n' +
            '}');
        let b=['1','function declaration','binarySearch','\t','\t',
            '1','variable declaration','X','\t','\t',
            '1','variable declaration','V','\t','\t',
            '1','variable declaration','n','\t','\t',
            '2','variable declaration','low','\t','\t',
            '2','variable declaration','high','\t','\t',
            '2','variable declaration','mid','\t','\t',
            '3','assignment expression','low', '\t','0',
            '4','assignment expression','high','\t','n\t-\t1',
            '5',	'while statement','\t','low\t<=\thigh','\t',
            '6',	'assignment expression',	'mid','\t','low\t+\thigh\t/\t2',
            '7','if statement','\t','X\t<\tV[mid]','\t',
            '8','assignment expression','high','\t','mid\t-\t1',
            '9','else if statement','\t','X\t>\tV[mid]','\t',
            '10','assignment expression','low','\t','mid\t+\t1',
            '12','return statement','\t','\t','mid',
            '14','return statement','\t','\t','-1'];
        for(let i=0;i<b.length;i++)
            assert.equal(a[i],b[i]);

    });

});
