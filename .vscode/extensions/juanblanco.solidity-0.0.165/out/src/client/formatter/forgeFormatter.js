"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDocument = void 0;
const vscode = require("vscode");
const cp = require("child_process");
const workspaceUtil = require("../workspaceUtil");
function formatDocument(document, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const firstLine = document.lineAt(0);
        const lastLine = document.lineAt(document.lineCount - 1);
        const fullTextRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
        const rootPath = workspaceUtil.getCurrentProjectInWorkspaceRootFsPath();
        const formatted = yield formatDocumentInternal(document.getText(), rootPath);
        return [vscode.TextEdit.replace(fullTextRange, formatted)];
    });
}
exports.formatDocument = formatDocument;
function formatDocumentInternal(documentText, rootPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => {
            var _a, _b;
            const forge = cp.execFile('forge', ['fmt', '--raw', '-'], { cwd: rootPath }, (err, stdout) => {
                if (err !== null) {
                    console.error(err);
                    return reject(err);
                }
                resolve(stdout);
            });
            (_a = forge.stdin) === null || _a === void 0 ? void 0 : _a.write(documentText);
            (_b = forge.stdin) === null || _b === void 0 ? void 0 : _b.end();
        });
    });
}
//# sourceMappingURL=forgeFormatter.js.map