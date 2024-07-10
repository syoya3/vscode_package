'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceDocumentCollection = void 0;
const fs = require("fs");
const sourceDocument_1 = require("./sourceDocument");
const util_1 = require("../util");
class SourceDocumentCollection {
    static getAllLibraryImports(codeFiles) {
        let imports = [];
        codeFiles.forEach(x => imports = imports.concat(sourceDocument_1.SourceDocument.getAllLibraryImports(x)));
        return [...new Set(imports)];
    }
    constructor() {
        this.documents = new Array();
    }
    isDocumentPathTheSame(contract, contractPath) {
        return contract.absolutePath === contractPath;
    }
    containsSourceDocument(contractPath) {
        return this.documents.findIndex((contract) => { return contract.absolutePath === contractPath; }) > -1;
    }
    getDefaultSourceDocumentsForCompilation(optimizeCompilationRuns = 200) {
        const compilerOutputSelection = {
            '*': {
                '': ['ast'],
                '*': ['abi', 'devdoc', 'userdoc', 'storageLayout', 'metadata', 'evm.bytecode', 'evm.deployedBytecode', 'evm.methodIdentifiers', 'evm.gasEstimates'],
            },
        };
        return this.getSourceDocumentsForCompilation(true, optimizeCompilationRuns, compilerOutputSelection);
    }
    getDefaultSourceDocumentsForCompilationDiagnostics() {
        const compilerOutputSelection = {
            '*': {
                '': [],
                '*': [],
            },
        };
        return this.getSourceDocumentsForCompilation(false, 0, compilerOutputSelection);
    }
    getSourceDocumentsForCompilation(optimizeCompilation, optimizeCompilationRuns, outputSelection) {
        const contractsForCompilation = {};
        this.documents.forEach(contract => {
            contractsForCompilation[contract.absolutePath] = { content: contract.code };
        });
        const compilation = {
            language: 'Solidity',
            settings: {
                optimizer: {
                    enabled: optimizeCompilation,
                    runs: optimizeCompilationRuns,
                },
                outputSelection: outputSelection,
            },
            sources: contractsForCompilation,
        };
        return compilation;
    }
    addSourceDocumentAndResolveImports(contractPath, code, project) {
        const contract = this.addSourceDocument(contractPath, code, project);
        if (contract !== null) {
            contract.resolveImports();
            contract.imports.forEach(foundImport => {
                if (fs.existsSync(foundImport)) {
                    if (!this.containsSourceDocument(foundImport)) {
                        const importContractCode = this.readContractCode(foundImport);
                        if (importContractCode != null) {
                            this.addSourceDocumentAndResolveImports(foundImport, importContractCode, project);
                        }
                    }
                }
                else {
                    this.addSourceDocumentAndResolveDependencyImport(foundImport, contract, project);
                }
            });
        }
        return contract;
    }
    addSourceDocument(contractPath, code, project) {
        if (!this.containsSourceDocument(contractPath)) {
            const contract = new sourceDocument_1.SourceDocument(contractPath, code, project);
            this.documents.push(contract);
            return contract;
        }
        return null;
    }
    formatContractPath(contractPath) {
        return (0, util_1.formatPath)(contractPath);
    }
    getAllImportFromPackages() {
        const importsFromPackages = new Array();
        this.documents.forEach(contract => {
            const contractImports = contract.getAllImportFromPackages();
            contractImports.forEach(contractImport => {
                if (importsFromPackages.indexOf(contractImport) < 0) {
                    importsFromPackages.push(contractImport);
                }
            });
        });
        return importsFromPackages;
    }
    readContractCode(contractPath) {
        if (fs.existsSync(contractPath)) {
            return fs.readFileSync(contractPath, 'utf8');
        }
        return null;
    }
    addSourceDocumentAndResolveDependencyImport(dependencyImport, contract, project) {
        // find re-mapping
        const remapping = project.findImportRemapping(dependencyImport);
        if (remapping !== undefined && remapping !== null) {
            const importPath = this.formatContractPath(remapping.resolveImport(dependencyImport));
            this.addSourceDocumentAndResolveDependencyImportFromContractFullPath(importPath, project, contract, dependencyImport);
        }
        else {
            const depPack = project.findDependencyPackage(dependencyImport);
            if (depPack !== undefined) {
                const depImportPath = this.formatContractPath(depPack.resolveImport(dependencyImport));
                this.addSourceDocumentAndResolveDependencyImportFromContractFullPath(depImportPath, project, contract, dependencyImport);
            }
        }
    }
    addSourceDocumentAndResolveDependencyImportFromContractFullPath(importPath, project, contract, dependencyImport) {
        if (!this.containsSourceDocument(importPath)) {
            const importContractCode = this.readContractCode(importPath);
            if (importContractCode != null) {
                this.addSourceDocumentAndResolveImports(importPath, importContractCode, project);
                contract.replaceDependencyPath(dependencyImport, importPath);
            }
        }
        else {
            contract.replaceDependencyPath(dependencyImport, importPath);
        }
    }
}
exports.SourceDocumentCollection = SourceDocumentCollection;
//# sourceMappingURL=sourceDocumentCollection.js.map