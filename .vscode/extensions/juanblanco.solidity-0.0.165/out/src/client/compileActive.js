'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileActiveContract = exports.initDiagnosticCollection = void 0;
const vscode = require("vscode");
const path = require("path");
const sourceDocumentCollection_1 = require("../common/model/sourceDocumentCollection");
const projectService_1 = require("../common/projectService");
const util_1 = require("../common/util");
const workspaceUtil = require("./workspaceUtil");
const settingsService_1 = require("./settingsService");
let diagnosticCollection;
function initDiagnosticCollection(diagnostics) {
    diagnosticCollection = diagnostics;
}
exports.initDiagnosticCollection = initDiagnosticCollection;
function compileActiveContract(compiler, overrideDefaultCompiler = null) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // We need something open
    }
    if (path.extname(editor.document.fileName) !== '.sol') {
        vscode.window.showWarningMessage('This not a solidity file (*.sol)');
        return;
    }
    // Check if is folder, if not stop we need to output to a bin folder on rootPath
    if (workspaceUtil.getCurrentWorkspaceRootFolder() === undefined) {
        vscode.window.showWarningMessage('Please open a folder in Visual Studio Code as a workspace');
        return;
    }
    const contractsCollection = new sourceDocumentCollection_1.SourceDocumentCollection();
    const contractCode = editor.document.getText();
    const contractPath = editor.document.fileName;
    const packageDefaultDependenciesDirectory = settingsService_1.SettingsService.getPackageDefaultDependenciesDirectories();
    const packageDefaultDependenciesContractsDirectory = settingsService_1.SettingsService.getPackageDefaultDependenciesContractsDirectory();
    const compilationOptimisation = settingsService_1.SettingsService.getCompilerOptimisation();
    const remappings = workspaceUtil.getSolidityRemappings();
    const project = (0, projectService_1.initialiseProject)(workspaceUtil.getCurrentProjectInWorkspaceRootFsPath(), packageDefaultDependenciesDirectory, packageDefaultDependenciesContractsDirectory, remappings);
    const contract = contractsCollection.addSourceDocumentAndResolveImports(contractPath, contractCode, project);
    const packagesPath = [];
    if (project.packagesDir != null) {
        project.packagesDir.forEach(x => packagesPath.push((0, util_1.formatPath)(x)));
    }
    return compiler.compile(contractsCollection.getDefaultSourceDocumentsForCompilation(compilationOptimisation), diagnosticCollection, project.projectPackage.build_dir, project.projectPackage.absoluletPath, null, packagesPath, contract.absolutePath, overrideDefaultCompiler);
}
exports.compileActiveContract = compileActiveContract;
//# sourceMappingURL=compileActive.js.map