import {parseCode} from './code-analyzer';

let dicFunc = {
    'Identifier': sub_identifier,
    'BinaryExpression': sub_binary_exp,
    'MemberExpression': sub_member_exp ,
    'VariableDeclarator': sub_variable_declarator ,
    'AssignmentExpression': sub_assign_exp ,
    'UpdateExpression': sub_update_exp,
    'VariableDeclaration': sub_variable_declaration ,
};

function deepCopyDict(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = new obj.constructor();
    for(var key in obj)
        temp[key] = deepCopyDict(obj[key]);

    return temp;
}

function getListParsedArgs(args) {
    if(args === ''){
        return [];
    }
    let parsedArgs = parseCode(args);
    parsedArgs = parsedArgs.body[0].expression;
    if(parsedArgs.expressions !== undefined){
        return parsedArgs.expressions;
    }
    return [parsedArgs];

}


function sub_literal(jsonObj) {
    return jsonObj;
}
function sub_identifier(jsonObj, env) {
    let ans = jsonObj;
    if (jsonObj.name in env) {
        ans = env[jsonObj.name];
    }

    return ans;
}

function eval_expression(jsonObj, env) {
    jsonObj = sub(jsonObj, env);
    return jsonObj.value;
}

function sub_binary_exp(jsonObj, env) {
    jsonObj.right = sub(jsonObj.right, env);
    jsonObj.left = sub(jsonObj.left, env);
    let value = eval(jsonObj.left.raw + jsonObj.operator + jsonObj.right.raw);
    jsonObj = {'type': 'Literal', 'value': value, 'raw': value+'', loc:jsonObj.loc} ;
    return jsonObj;
}
function sub_member_exp(jsonObj, env) {
    jsonObj.property = sub(jsonObj.property, env);
    let key = '';
    key = jsonObj.object.name+'['+jsonObj.property.raw+']';
    if(key in env)
        return env[key];
    return jsonObj;
}
function sub_update_exp(jsonObj, env) {
    let operator = jsonObj.operator[0];
    let argumentName = '';
    if (jsonObj.argument.type === 'MemberExpression'){argumentName = jsonObj.argument.object.name;}
    else{argumentName = jsonObj.argument.name;}
    let envKey = createEnvKey(jsonObj.argument, argumentName, env);
    let evaluated = eval(env[envKey].value+operator+1);
    env[envKey] = {
        'type': 'Literal',
        'value': evaluated,
        'raw': evaluated + '',
    };
    return jsonObj;
}
function createEnvKey(jsonObj, name, env) {
    let envKey = name;
    if (jsonObj.type === 'MemberExpression'){
        let itemIndex = '';
        let itemIndexJsonObj = sub(jsonObj.property, env);
        if(itemIndexJsonObj.type === 'Literal'){
            itemIndex = itemIndexJsonObj.raw;
        }
        envKey = jsonObj.object.name+'['+itemIndex+']';
    }
    return envKey;
}
function sub_assign_exp(jsonObj, env) {
    let leftName = '';
    if (jsonObj.left.type === 'MemberExpression'){leftName = jsonObj.left.object.name;}
    else{leftName = jsonObj.left.name;}
    jsonObj.right = sub(jsonObj.right, env);
    let envKey = createEnvKey(jsonObj.left, leftName, env);
    env[envKey] = jsonObj.right;

    return jsonObj;
}

function sub_variable_declarator(jsonObj, env) {
    if(jsonObj.init != null){
        jsonObj.init = sub(jsonObj.init, env);
        if(jsonObj.init.type === 'ArrayExpression'){
            for(let i = 0; i < jsonObj.init.elements.length; i++){
                env[jsonObj.id.name+'['+i+']'] = jsonObj.init.elements[i];
            }
            return jsonObj;
        }
    }
    env[jsonObj.id.name] = jsonObj.init;
    return jsonObj;
}
function sub_variable_declaration(jsonObj, env) {
    for (let i = 0; i < jsonObj.declarations.length; i++) {
        jsonObj.declarations[i] = sub(jsonObj.declarations[i], env);
    }
    return jsonObj;
}

function sub(jsonObj, env) {
    try {
        if (jsonObj.type === 'Literal')
            return sub_literal(jsonObj);

        return dicFunc[jsonObj.type](jsonObj, env);
    }
    catch (e) {
        return jsonObj;
    }
}




function createEnv(params, funcArgs) {
    let env = [];
    for (let i = 0; i < funcArgs.length; i++) {
        if (funcArgs[i].type === 'ArrayExpression') {
            for (let itemIndex = 0; itemIndex < funcArgs[i].elements.length; itemIndex++) {
                env[params[i].name + '[' + itemIndex + ']'] = funcArgs[i].elements[itemIndex];
            }
        } else {
            env[params[i].name] = funcArgs[i];
        }
    }
    return env;
}


const colorGraph = (graphNodes, funcArgs, jsonObj) => {
    let params = jsonObj.body[0].params;
    let parsedArgs = getListParsedArgs(funcArgs);
    let addColors = parsedArgs.length === params.length;
    let env = createEnv(params, parsedArgs);
    let currentNode = graphNodes[0];
    while (currentNode.next.length !== 0) {
        currentNode.green = true;
        if (currentNode.normal) {
            sub(deepCopyDict(currentNode.astNode),env);
            currentNode = currentNode.normal;}
        else {
            if (eval_expression(deepCopyDict(currentNode.astNode), env) === true) currentNode = currentNode.true;
            else currentNode = currentNode.false;
        }
    }
    currentNode.green = true;
    return addColors;
};

export {colorGraph};