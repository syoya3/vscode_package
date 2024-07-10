'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceDocument = void 0;
const path = require("path");
const util_1 = require("../util");
class SourceDocument {
    static getAllLibraryImports(code) {
        const importRegEx = /^\s?import\s+[^'"]*['"](.*)['"]\s*/gm;
        const imports = [];
        let foundImport = importRegEx.exec(code);
        while (foundImport != null) {
            const importPath = foundImport[1];
            if (!this.isImportLocal(importPath)) {
                imports.push(importPath);
            }
            foundImport = importRegEx.exec(code);
        }
        return imports;
    }
    static isImportLocal(importPath) {
        return importPath.startsWith('.');
    }
    constructor(absoulePath, code, project) {
        this.absolutePath = this.formatDocumentPath(absoulePath);
        this.code = code;
        this.unformattedCode = code;
        this.project = project;
        this.imports = new Array();
    }
    /**
   * Resolve import statement to absolute file path
   *
   * @param {string} importPath import statement in *.sol contract
   * @param {SourceDocument} contract the contract where the import statement belongs
   * @returns {string} the absolute path of the imported file
   */
    resolveImportPath(importPath) {
        if (this.isImportLocal(importPath)) {
            return this.formatDocumentPath(path.resolve(path.dirname(this.absolutePath), importPath));
        }
        else if (this.project !== undefined && this.project !== null) {
            const remapping = this.project.findImportRemapping(importPath);
            if (remapping !== undefined && remapping != null) {
                return this.formatDocumentPath(remapping.resolveImport(importPath));
            }
            else {
                const depPack = this.project.findDependencyPackage(importPath);
                if (depPack !== undefined) {
                    return this.formatDocumentPath(depPack.resolveImport(importPath));
                }
            }
        }
        return importPath;
    }
    getAllImportFromPackages() {
        const importsFromPackages = new Array();
        this.imports.forEach(importElement => {
            if (!this.isImportLocal(importElement)) {
                importsFromPackages.push(importElement);
            }
        });
        return importsFromPackages;
    }
    isImportLocal(importPath) {
        return SourceDocument.isImportLocal(importPath);
    }
    formatDocumentPath(contractPath) {
        return (0, util_1.formatPath)(contractPath);
    }
    replaceDependencyPath(importPath, depImportAbsolutePath) {
        const importRegEx = /(^\s?import\s+[^'"]*['"])(.*)(['"]\s*)/gm;
        this.code = this.code.replace(importRegEx, (match, p1, p2, p3) => {
            if (p2 === importPath) {
                return p1 + depImportAbsolutePath + p3;
            }
            else {
                return match;
            }
        });
    }
    resolveImports() {
        const importRegEx = /^\s?import\s+[^'"]*['"](.*)['"]\s*/gm;
        let foundImport = importRegEx.exec(this.code);
        while (foundImport != null) {
            const importPath = foundImport[1];
            if (this.isImportLocal(importPath)) {
                const importFullPath = this.formatDocumentPath(path.resolve(path.dirname(this.absolutePath), foundImport[1]));
                this.imports.push(importFullPath);
            }
            else {
                this.imports.push(importPath);
            }
            foundImport = importRegEx.exec(this.code);
        }
    }
}
exports.SourceDocument = SourceDocument;
//# sourceMappingURL=sourceDocument.js.map