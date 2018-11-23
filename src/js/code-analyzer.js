/* eslint-disable no-console,complexity,null */
import * as esprima from 'esprima';
const flattenDeep=(arr1)=> {
    return arr1.reduce((acc, val) => {
        if(Array.isArray(val))
            return acc.concat(flattenDeep(val));
        else return acc.concat(val);}, []);
};



const checkType=(parsed)=>{
    if(parsed==undefined)
        return '\t';
    switch (parsed.type) {
    case 'Program':
        return blockStatment(parsed);
    case 'FunctionDeclaration':
        return functionDecl(parsed);
    case 'AssignmentExpression':
        return functionAssignment(parsed);
    case 'ExpressionStatement':
        return checkType(parsed.expression);
    case 'VariableDeclaration':
        return parsed.declarations.map(checkType);
    default:
        return otherTypes(parsed);
    }
};
const otherTypes=(parsed)=>{
    switch (parsed.type) {
    case 'MemberExpression':
        return member(parsed);
    case 'UnaryExpression':
        return parsed.operator + checkType(parsed.argument);
    case 'BinaryExpression':
        return checkType(parsed.left) + '\t' + parsed.operator + '\t' + checkType(parsed.right);
    case 'Identifier':
        return parsed.name;
    case 'WhileStatement':
        return whileStatment(parsed);
    case 'BlockStatement':
        return blockStatment(parsed);
    default:
        return another(parsed);
    }

};
const another=(parsed)=>{
    switch (parsed.type) {
    case 'ReturnStatement':
        return returnStatement(parsed);
    case 'Literal':
        return parsed.value;
    case 'IfStatement':
        return ifStatemenet(parsed);
    case 'ForStatement':
        return forStatement(parsed);
    case 'UpdateExpression':
        return updateExpression(parsed);
    case 'VariableDeclarator':
        return functionVarDecl(parsed);
    }
};
const member=(parsed)=>{
    if(parsed.computed==true)
        return checkType(parsed.object)+'['+checkType(parsed.property)+']';
    else
        return checkType(parsed.object)+'.'+checkType(parsed.property);
};
const updateExpression=(parsed)=>{
    let line=parsed.line;
    let type='assigment expression';
    let name=checkType(parsed.argument);
    let condition='\t';
    let value=name+parsed.operator;
    return [line,type,name,condition,value];
};
const forStatement=(parsed)=>{
    let line=parsed.loc.start.line;
    let type='for statement';
    let name='\t';
    let condition=checkType(parsed.test);
    let value='\t';
    let next=[line,type,name,condition,value];
    let update=checkType(parsed.update);
    update[0]=line;
    return [next].concat(checkType(parsed.init),update,checkType(parsed.body));
};
const ifStatemenet= (parsed)=>{
    let line=parsed.loc.start.line;
    let type='if statement';
    let condition=checkType(parsed.test);
    let next=[line,type,'\t',condition,'\t'];
    if(parsed.alternate==null)
        return [next].concat(checkType(parsed.consequent));
    let alt=flattenDeep(checkType(parsed.alternate));
    if(alt[1]=='if statement')
        alt[1]='else if statement';
    return [next].concat(checkType(parsed.consequent),alt);
};
const returnStatement=(parsed)=>{
    let line=parsed.loc.start.line;
    let type='return statement';
    let name='\t';
    let condition='\t';
    let value=checkType(parsed.argument);
    return [line,type,name,condition,value];
};

const blockStatment=(parsed)=>{
    let res=[];
    let i;
    for (i=0;i<parsed.body.length;i++)
    {
        let line=checkType(parsed.body[i]);
        res.push(line);
    }
    return res;
};
const whileStatment=(parsed)=>{
    let line=parsed.loc.start.line;
    let type='while statement';
    let name='\t';
    let condition=checkType(parsed.test);
    let value= '\t';
    let next=[line,type,name,condition,value];
    return [next].concat(checkType(parsed.body));
};
const functionAssignment=(parsed)=>{
    let line=parsed.left.loc.start.line;
    let type='assignment expression';
    let name=checkType(parsed.left);
    let condition='\t';
    let value=checkType(parsed.right);
    return [line,type,name,condition,value];
};
const functionVarDecl=(codeToParse)=>{
    let line=codeToParse.id.loc.start.line;
    let type='variable declaration';
    let name=codeToParse.id.name;
    let condition='\t';
    let value=checkType(codeToParse.init);
    return [line,type,name,condition,value];

};
const functionParams=(codeToParse)=>{
    let res=[];
    let i;
    for (i=0;i<codeToParse.params.length;i++)
    {
        let line=[codeToParse.params[i].loc.start.line,'variable declaration',codeToParse.params[i].name,'\t','\t'];
        res.push(line);
    }
    return res;
};
const functionDecl=(codeToParse)=>{
    let line=codeToParse.id.loc.start.line;
    let type='function declaration';
    let name=codeToParse.id.name;
    let condition='\t';
    let value='\t';
    let tableLine=[line,type,name,condition,value];
    let param=functionParams(codeToParse);
    let AllLines=checkType(codeToParse.body);/*to complete*/
    return [tableLine].concat(param,AllLines);
};
export const parseCode = (codeToParse) => {
    let jh=esprima.parseScript(codeToParse, {loc: true});
    let parsedCode=flattenDeep(checkType(jh));
    return parsedCode;
};
