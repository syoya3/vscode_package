'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRemappings = exports.initialiseProject = exports.findFirstRootProjectFile = void 0;
const fs = require("fs");
const os = require("os");
const toml = require("@iarna/toml");
const path = require("path");
const yaml = require("yaml-js");
const package_1 = require("./model/package");
const project_1 = require("./model/project");
const util = require("./util");
// TODO: These are temporary constants until standard agreed
// A project standard is needed so each project can define where it store its project dependencies
// and if are relative or at project source
// also versioning (as it was defined years ago)
const packageConfigFileName = 'dappFile';
const remappingConfigFileName = 'remappings.txt';
const brownieConfigFileName = 'brownie-config.yaml';
const hardhatConfigFileName = 'hardhat.config.js';
const truffleConfigFileName = 'truffle-config.js';
const foundryConfigFileName = 'foundry.toml';
const projectFilesAtRoot = [remappingConfigFileName, brownieConfigFileName, foundryConfigFileName, hardhatConfigFileName, truffleConfigFileName, packageConfigFileName];
// These are set using user configuration settings
let defaultPackageDependenciesDirectory = 'lib';
let packageDependenciesContractsDirectory = 'src';
let defaultPackageDependenciesContractsDirectories = ['', 'src', 'contracts'];
function findFirstRootProjectFile(rootPath, currentDocument) {
    return util.findDirUpwardsToCurrentDocumentThatContainsAtLeastFileNameSync(projectFilesAtRoot, currentDocument, rootPath);
}
exports.findFirstRootProjectFile = findFirstRootProjectFile;
function createPackage(rootPath, packageContractsDirectory) {
    const projectPackageFile = path.join(rootPath, packageConfigFileName);
    if (fs.existsSync(projectPackageFile)) {
        // TODO: automapper
        const packageConfig = readYamlSync(projectPackageFile);
        // TODO: throw expection / warn user of invalid package file
        const projectPackage = new package_1.Package(packageContractsDirectory);
        projectPackage.absoluletPath = rootPath;
        if (packageConfig) {
            if (packageConfig.layout !== undefined) {
                if (projectPackage.build_dir !== undefined) {
                    projectPackage.build_dir = packageConfig.layout.build_dir;
                }
                if (projectPackage.sol_sources !== undefined) {
                    projectPackage.sol_sources = packageConfig.layout.sol_sources;
                }
            }
            if (projectPackage.name !== undefined) {
                projectPackage.name = packageConfig.name;
            }
            else {
                projectPackage.name = path.basename(rootPath);
            }
            if (projectPackage.version !== undefined) {
                projectPackage.version = packageConfig.name;
            }
            if (projectPackage.dependencies !== undefined) {
                projectPackage.dependencies = packageConfig.dependencies;
            }
        }
        return projectPackage;
    }
    return null;
}
function readYamlSync(filePath) {
    const fileContent = fs.readFileSync(filePath);
    return yaml.load(fileContent);
}
function initialiseProject(rootPath, packageDefaultDependenciesDirectories, packageDefaultDependenciesContractsDirectory, remappings) {
    packageDependenciesContractsDirectory = packageDefaultDependenciesContractsDirectory;
    const projectPackage = createProjectPackage(rootPath, packageDefaultDependenciesContractsDirectory);
    // adding defaults to packages
    const packegesContractsDirectories = [...new Set(defaultPackageDependenciesContractsDirectories.concat(packageDefaultDependenciesContractsDirectory))];
    const packageDependencies = loadAllPackageDependencies(packageDefaultDependenciesDirectories, rootPath, projectPackage, packegesContractsDirectories);
    remappings = loadRemappings(rootPath, remappings);
    return new project_1.Project(projectPackage, packageDependencies, packageDefaultDependenciesDirectories, remappings);
}
exports.initialiseProject = initialiseProject;
function loadAllPackageDependencies(packageDefaultDependenciesDirectories, rootPath, projectPackage, packageDependenciesContractsDirectories) {
    let packageDependencies = [];
    packageDefaultDependenciesDirectories.forEach(packageDirectory => {
        packageDependencies = packageDependencies.concat(loadDependencies(rootPath, projectPackage, packageDirectory, packageDependenciesContractsDirectories));
    });
    return packageDependencies;
}
function getRemappingsFromFoundryConfig(rootPath) {
    const foundryConfigFile = path.join(rootPath, foundryConfigFileName);
    if (fs.existsSync(foundryConfigFile)) {
        try {
            const fileContent = fs.readFileSync(foundryConfigFile, 'utf8');
            const configOutput = toml.parse(fileContent);
            let remappingsLoaded;
            remappingsLoaded = configOutput['profile']['default']['remappings'];
            if (!remappingsLoaded) {
                return null;
            }
            if (remappingsLoaded.length === 0) {
                return null;
            }
            return remappingsLoaded;
        }
        catch (error) {
            // ignore error
            console.log(error);
        }
        return;
    }
    return null;
}
function getRemappingsFromBrownieConfig(rootPath) {
    const brownieConfigFile = path.join(rootPath, brownieConfigFileName);
    if (fs.existsSync(brownieConfigFile)) {
        const config = readYamlSync(brownieConfigFile);
        let remappingsLoaded;
        try {
            remappingsLoaded = config.compiler.solc.remappings;
            if (!remappingsLoaded) {
                return;
            }
        }
        catch (TypeError) {
            return;
        }
        const remappings = remappingsLoaded.map(i => {
            const [alias, packageID] = i.split('=');
            if (packageID.startsWith('/')) { // correct processing for imports defined with global path
                return `${alias}=${packageID}`;
            }
            else {
                return `${alias}=${path.join(os.homedir(), '.brownie', 'packages', packageID)}`;
            }
        });
        return remappings;
    }
    return null;
}
function getRemappingsFromRemappingsFile(rootPath) {
    const remappingsFile = path.join(rootPath, remappingConfigFileName);
    if (fs.existsSync(remappingsFile)) {
        const remappings = [];
        const fileContent = fs.readFileSync(remappingsFile, 'utf8');
        const remappingsLoaded = fileContent.split(/\r\n|\r|\n/); // split lines
        if (remappingsLoaded) {
            remappingsLoaded.forEach(element => {
                remappings.push(element);
            });
        }
        return remappings;
    }
    return null;
}
function loadRemappings(rootPath, remappings) {
    var _a, _b, _c;
    if (remappings === undefined) {
        remappings = [];
    }
    // Brownie prioritezes brownie-config.yml over remappings.txt
    // but changing to remappings over foundry
    remappings = (_c = (_b = (_a = getRemappingsFromBrownieConfig(rootPath)) !== null && _a !== void 0 ? _a : getRemappingsFromRemappingsFile(rootPath)) !== null && _b !== void 0 ? _b : getRemappingsFromFoundryConfig(rootPath)) !== null && _c !== void 0 ? _c : remappings;
    return remappings;
}
exports.loadRemappings = loadRemappings;
function loadDependencies(rootPath, projectPackage, packageDirectory, dependencyAlternativeSmartContractDirectories, depPackages = new Array()) {
    if (projectPackage.dependencies !== undefined) {
        Object.keys(projectPackage.dependencies).forEach(dependency => {
            if (!depPackages.some((existingDepPack) => existingDepPack.name === dependency)) {
                const depPackageDependencyPath = path.join(rootPath, packageDirectory, dependency);
                const depPackage = createPackage(depPackageDependencyPath, '');
                depPackage.sol_sources_alternative_directories = dependencyAlternativeSmartContractDirectories;
                if (depPackage !== null) {
                    depPackages.push(depPackage);
                    // Assumed the package manager will install all the dependencies at root so adding all the existing ones
                    loadDependencies(rootPath, depPackage, packageDirectory, dependencyAlternativeSmartContractDirectories, depPackages);
                }
                else {
                    // should warn user of a package dependency missing
                }
            }
        });
    }
    // lets not skip packages in lib
    const depPackagePath = path.join(projectPackage.absoluletPath, packageDirectory);
    if (fs.existsSync(depPackagePath)) {
        const depPackagesDirectories = getDirectories(depPackagePath);
        depPackagesDirectories.forEach(depPackageDir => {
            const fullPath = path.join(depPackagePath, depPackageDir);
            let depPackage = createPackage(fullPath, null);
            if (depPackage == null) {
                depPackage = createDefaultPackage(fullPath);
                depPackage.sol_sources_alternative_directories = dependencyAlternativeSmartContractDirectories;
            }
            if (!depPackages.some((existingDepPack) => existingDepPack.name === depPackage.name)) {
                depPackages.push(depPackage);
                loadDependencies(rootPath, depPackage, packageDirectory, dependencyAlternativeSmartContractDirectories, depPackages);
            }
        });
    }
    return depPackages;
}
function getDirectories(dirPath) {
    return fs.readdirSync(dirPath).filter(function (file) {
        const subdirPath = path.join(dirPath, file);
        return fs.statSync(subdirPath).isDirectory();
    });
}
function createDefaultPackage(packagePath, packageDependencySmartContractDirectory = '') {
    const defaultPackage = new package_1.Package(packageDependencySmartContractDirectory);
    defaultPackage.absoluletPath = packagePath;
    defaultPackage.name = path.basename(packagePath);
    return defaultPackage;
}
function createProjectPackage(rootPath, packageDependencySmartContractDirectory = '') {
    let projectPackage = createPackage(rootPath, packageDependencySmartContractDirectory);
    // Default project package,this could be passed as a function
    if (projectPackage === null) {
        projectPackage = createDefaultPackage(rootPath, packageDependencySmartContractDirectory);
    }
    return projectPackage;
}
//# sourceMappingURL=projectService.js.map