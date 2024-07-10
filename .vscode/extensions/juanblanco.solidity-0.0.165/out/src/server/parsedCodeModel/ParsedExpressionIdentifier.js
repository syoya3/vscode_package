"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedExpressionIdentifier = void 0;
const parsedCode_1 = require("./parsedCode");
const ParsedExpression_1 = require("./ParsedExpression");
class ParsedExpressionIdentifier extends ParsedExpression_1.ParsedExpression {
    // tslint:disable-next-line:member-ordering
    initialise(element, document, contract, child, expressionContainer) {
        this.element = element;
        this.child = child;
        this.document = document;
        this.contract = contract;
        this.expressionObjectType = ParsedExpression_1.ExpressionType.Identifier;
        this.expressionContainer = expressionContainer;
        this.name = this.element.name;
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
                const foundResults = this.expressionContainer.findMembersInScope(this.name);
                if (foundResults.length > 0) {
                    this.reference = foundResults[0];
                }
            }
            else {
                const foundResults = this.parent.getInnerMembers().filter(x => x.name === this.name);
                if (foundResults.length > 0) {
                    this.reference = foundResults[0];
                }
            }
        }
    }
    initExpressionType() {
        if (this.expressionType === null) {
            if (this.reference !== null) {
                const variable = this.reference;
                if (variable.type !== undefined) {
                    this.expressionType = variable.type;
                }
            }
        }
    }
    getSelectedTypeReferenceLocation(offset) {
        try {
            this.initReference();
            this.initExpressionType();
            if (this.isCurrentElementedSelected(offset)) {
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
            else { // in case the parent is a member and not part of the element
                if (this.parent !== null) {
                    if (this.parent.isCurrentElementedSelected(offset)) {
                        return this.parent.getSelectedTypeReferenceLocation(offset);
                    }
                }
            }
            return parsedCode_1.FindTypeReferenceLocationResult.create(false);
        }
        catch (error) {
            return parsedCode_1.FindTypeReferenceLocationResult.create(false);
        }
    }
}
exports.ParsedExpressionIdentifier = ParsedExpressionIdentifier;
//# sourceMappingURL=ParsedExpressionIdentifier.js.map