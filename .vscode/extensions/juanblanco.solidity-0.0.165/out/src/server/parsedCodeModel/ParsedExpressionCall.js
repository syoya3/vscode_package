"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedExpressionCall = void 0;
const parsedCode_1 = require("./parsedCode");
const ParsedExpression_1 = require("./ParsedExpression");
class ParsedExpressionCall extends ParsedExpression_1.ParsedExpression {
    // tslint:disable-next-line:member-ordering
    initialise(element, document, contract, child, expressionContainer) {
        this.element = element;
        this.child = child;
        this.document = document;
        this.contract = contract;
        this.expressionObjectType = ParsedExpression_1.ExpressionType.Call;
        this.expressionContainer = expressionContainer;
        if (this.element.callee.type === 'Identifier') {
            this.name = this.element.callee.name;
        }
        if (this.element.callee.type === 'MemberExpression') {
            if (this.element.callee.property.type === 'Identifier') {
                this.name = this.element.callee.property.name;
            }
            this.initialiseVariablesMembersEtc(this.element.callee.object, this.element);
        }
        if (this.element.arguments !== undefined && this.element.arguments !== null) {
            this.element.arguments.forEach(arg => {
                this.expressionContainer.initialiseVariablesMembersEtc(arg, this.element, null);
            });
        }
    }
    getInnerMembers() {
        this.initReference();
        this.initExpressionType();
        if (this.expressionType !== null) {
            return this.expressionType.getInnerMembers();
        }
        return [];
    }
    getInnerMethodCalls() {
        this.initReference();
        this.initExpressionType();
        if (this.expressionType !== null) {
            return this.expressionType.getInnerMethodCalls();
        }
        return [];
    }
    initReference() {
        if (this.reference == null) {
            if (this.parent === null) {
                const foundResults = this.findMethodsInScope(this.name);
                if (foundResults.length > 0) {
                    this.reference = foundResults[0];
                }
            }
            else {
                const foundResults = this.parent.getInnerMethodCalls().filter(x => x.name === this.name);
                if (foundResults.length > 0) {
                    this.reference = foundResults[0];
                }
            }
        }
    }
    initExpressionType() {
        if (this.expressionType === null) {
            if (this.reference !== null) {
                const functionReference = this.reference;
                if (functionReference.output !== undefined && functionReference.output.length > 0) {
                    this.expressionType = functionReference.output[0].type;
                }
            }
        }
    }
    getSelectedTypeReferenceLocation(offset) {
        this.initReference();
        this.initExpressionType();
        if (this.isCurrentElementedSelected(offset)) {
            if (this.isElementedSelected(this.element.callee, offset)) {
                if (this.parent !== null) {
                    if (this.parent.isCurrentElementedSelected(offset)) {
                        return this.parent.getSelectedTypeReferenceLocation(offset);
                    }
                }
                if (this.reference !== null) {
                    return parsedCode_1.FindTypeReferenceLocationResult.create(true, this.reference.getLocation());
                }
                return parsedCode_1.FindTypeReferenceLocationResult.create(true);
            }
        }
        return parsedCode_1.FindTypeReferenceLocationResult.create(false);
    }
}
exports.ParsedExpressionCall = ParsedExpressionCall;
//# sourceMappingURL=ParsedExpressionCall.js.map