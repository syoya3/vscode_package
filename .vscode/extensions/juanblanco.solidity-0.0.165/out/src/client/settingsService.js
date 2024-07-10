'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const vscode = require("vscode");
class SettingsService {
    static getPackageDefaultDependenciesDirectories() {
        const packageDefaultDependenciesDirectory = vscode.workspace.getConfiguration('solidity').get('packageDefaultDependenciesDirectory');
        if (typeof packageDefaultDependenciesDirectory === 'string') {
            return [packageDefaultDependenciesDirectory];
        }
        return packageDefaultDependenciesDirectory;
    }
    static getPackageDefaultDependenciesContractsDirectory() {
        return vscode.workspace.getConfiguration('solidity').get('packageDefaultDependenciesContractsDirectory');
    }
    static getCompilerOptimisation() {
        return vscode.workspace.getConfiguration('solidity').get('compilerOptimization');
    }
    static getRemappings() {
        return vscode.workspace.getConfiguration('solidity').get('remappings');
    }
    static getRemappingsWindows() {
        return vscode.workspace.getConfiguration('solidity').get('remappingsWindows');
    }
    static getRemappingsUnix() {
        return vscode.workspace.getConfiguration('solidity').get('remappingsUnix');
    }
    static getMonoRepoSupport() {
        return vscode.workspace.getConfiguration('solidity').get('monoRepoSupport');
    }
}
exports.SettingsService = SettingsService;
//# sourceMappingURL=settingsService.js.map