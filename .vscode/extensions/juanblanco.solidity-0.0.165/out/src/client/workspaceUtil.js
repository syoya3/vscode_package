"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSolidityRemappings = exports.getCurrentWorkspaceRootFolder = exports.getCurrentWorkspaceRootFsPath = exports.getCurrentProjectInWorkspaceRootFsPath = void 0;
const vscode = require("vscode");
const util_1 = require("../common/util");
const projectService_1 = require("../common/projectService");
const settingsService_1 = require("./settingsService");
function getCurrentProjectInWorkspaceRootFsPath() {
    const monoreposupport = settingsService_1.SettingsService.getMonoRepoSupport();
    const currentRootPath = getCurrentWorkspaceRootFsPath();
    if (monoreposupport) {
        const editor = vscode.window.activeTextEditor;
        const currentDocument = editor.document.uri;
        const projectFolder = (0, projectService_1.findFirstRootProjectFile)(currentRootPath, currentDocument.fsPath);
        if (projectFolder == null) {
            return currentRootPath;
        }
        else {
            return projectFolder;
        }
    }
    else {
        return currentRootPath;
    }
}
exports.getCurrentProjectInWorkspaceRootFsPath = getCurrentProjectInWorkspaceRootFsPath;
function getCurrentWorkspaceRootFsPath() {
    return getCurrentWorkspaceRootFolder().uri.fsPath;
}
exports.getCurrentWorkspaceRootFsPath = getCurrentWorkspaceRootFsPath;
function getCurrentWorkspaceRootFolder() {
    const editor = vscode.window.activeTextEditor;
    const currentDocument = editor.document.uri;
    return vscode.workspace.getWorkspaceFolder(currentDocument);
}
exports.getCurrentWorkspaceRootFolder = getCurrentWorkspaceRootFolder;
function getSolidityRemappings() {
    const remappings = settingsService_1.SettingsService.getRemappings();
    if (process.platform === 'win32') {
        return (0, util_1.replaceRemappings)(remappings, settingsService_1.SettingsService.getRemappingsWindows());
    }
    else {
        return (0, util_1.replaceRemappings)(remappings, settingsService_1.SettingsService.getRemappingsUnix());
    }
}
exports.getSolidityRemappings = getSolidityRemappings;
//# sourceMappingURL=workspaceUtil.js.map