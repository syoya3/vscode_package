'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const path = require("path");
const fs = require("fs");
class Package {
    constructor(solidityDirectory) {
        this.sol_sources_alternative_directories = [];
        this.build_dir = 'bin';
        this.sol_sources = solidityDirectory;
    }
    getSolSourcesAbsolutePath() {
        if (this.sol_sources !== undefined || this.sol_sources === '') {
            return path.join(this.absoluletPath, this.sol_sources);
        }
        return this.absoluletPath;
    }
    isImportForThis(contractDependencyImport) {
        const splitDirectories = contractDependencyImport.split('/');
        if (splitDirectories.length === 1) {
            return false;
        }
        return splitDirectories[0] === this.name;
    }
    resolveImport(contractDependencyImport) {
        if (this.isImportForThis(contractDependencyImport)) {
            const defaultPath = path.join(this.getSolSourcesAbsolutePath(), contractDependencyImport.substring(this.name.length));
            if (fs.existsSync(defaultPath)) {
                return defaultPath;
            }
            else {
                for (let index = 0; index < this.sol_sources_alternative_directories.length; index++) {
                    const directory = this.sol_sources_alternative_directories[index];
                    if (directory !== undefined || directory === '') {
                        const fullpath = path.join(this.absoluletPath, directory, contractDependencyImport.substring(this.name.length));
                        if (fs.existsSync(fullpath)) {
                            return fullpath;
                        }
                    }
                }
            }
        }
        return null;
    }
}
exports.Package = Package;
//# sourceMappingURL=package.js.map