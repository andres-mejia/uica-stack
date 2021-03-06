var _ = require("lodash")

module.exports = (function () {
    var protosQuery = "//ObjectExpression //Property [ //Identifier [ @name == 'protos' ]] "
    var registerBindingsQuery = "/ObjectExpression //Property [ //Identifier [ @name == 'registerDataBindings' ]] " +
        "//CallExpression [ //MemberExpression //Identifier [ @name == 'observeParentModel' | @name == 'observeOwnModel' ] &&" +
        "/Literal [ @value !~ '^(global:data:|data:)' ]]"

    return function (options, tools) {
        var result = [];
        tools.astJS.findAndLoopAstList(options.root, options.viewFiles || "**/*-view.js", options.excludedFiles, function (ast, file) {
            var protos = tools.astJS.astq.query(ast, protosQuery);
            _.forEach(protos, function (proto) {
                result = result.concat(tools.astJS.findViolations(proto, file, registerBindingsQuery))
            })
        })
        return result;
    }

}());