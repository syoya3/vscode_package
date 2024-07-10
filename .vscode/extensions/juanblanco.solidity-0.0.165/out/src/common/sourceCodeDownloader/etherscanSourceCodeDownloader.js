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
exports.EtherscanContractInfoService = exports.EtherscanContractDownloader = exports.EtherscanDomainChainMapper = void 0;
const axios_1 = require("axios");
const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const vscode = require("vscode");
const workspaceUtil = require("../../client/workspaceUtil");
const sourceDocumentCollection_1 = require("../model/sourceDocumentCollection");
class EtherscanDomainChainMapper {
    static getMappings() {
        return { 'ethereum': 'api.etherscan.io',
            'optimism': 'api-optimistic.etherscan.io',
            'binance': 'api.bscscan.com' };
    }
    static getDomain(chain) {
        return this.getMappings()[chain];
    }
    static getChains() {
        return Object.keys(this.getMappings());
    }
}
exports.EtherscanDomainChainMapper = EtherscanDomainChainMapper;
class EtherscanContractDownloader {
    static isValiAddressMessage(address) {
        const invalidAddress = { message: 'Invalid address', severity: vscode.InputBoxValidationSeverity.Error };
        if (address === null || address === undefined) {
            return invalidAddress;
        }
        address = address.toLowerCase();
        if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
            return invalidAddress;
        }
        else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
            // If it's all small caps or all all caps, return true
            return null;
        }
        return invalidAddress;
    }
    static hexLenth(hex) {
        if (hex.startsWith('0x')) {
            return hex.length - 2;
        }
        return hex.length;
    }
    static ensureHexPrefix(hex) {
        if (hex.startsWith('0x')) {
            return hex;
        }
        return hex;
    }
    static isValiAddress(address) {
        if (address === null || address === undefined) {
            return false;
        }
        address = address.toLowerCase();
        if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
            return false;
        }
        else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
            return true;
        }
        return false;
    }
    static downloadContractWithPrompts() {
        return __awaiter(this, void 0, void 0, function* () {
            if (vscode.window.activeTextEditor) {
                try {
                    const chains = EtherscanDomainChainMapper.getChains();
                    const selectedChain = yield vscode.window.showQuickPick(chains);
                    const inputBox = {};
                    inputBox.title = 'Please enter the contract address:';
                    inputBox.prompt = 'Please enter the contract address';
                    inputBox.ignoreFocusOut = true;
                    inputBox.validateInput = this.isValiAddressMessage;
                    let selectedAddress = yield vscode.window.showInputBox(inputBox);
                    if (selectedAddress !== undefined) { // cancelled
                        if (!this.isValiAddress(selectedAddress)) {
                            throw 'Invalid address';
                        }
                        selectedAddress = this.ensureHexPrefix(selectedAddress);
                        const pathProject = workspaceUtil.getCurrentProjectInWorkspaceRootFsPath();
                        const downloadedFiles = yield EtherscanContractDownloader.downloadContract(selectedChain, selectedAddress, pathProject);
                        vscode.window.showInformationMessage('Contract downloaded:' + downloadedFiles[0]);
                        const openPath = vscode.Uri.file(downloadedFiles[0]);
                        vscode.workspace.openTextDocument(openPath).then(doc => {
                            vscode.window.showTextDocument(doc);
                        });
                    }
                }
                catch (e) {
                    vscode.window.showErrorMessage('Error downloading contract: ' + e);
                }
            }
            else {
                throw 'Please open a file to identify the worspace';
            }
        });
    }
    static downloadContract(chain, address, projectPath, subfolder = 'chainContracts', apiKey = 'YourApiKeyToken') {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield EtherscanContractInfoService.getContractInfo(chain, address, apiKey);
            const downloadedFiles = [];
            if (info.result.length > 0) {
                // one contract..
                const contractInfo = info.result[0];
                if (contractInfo.SourceCode === '') {
                    throw 'Contract has not been verified or found';
                }
                const subfolderFullPath = path.join(projectPath, contractInfo.ContractName);
                fse.ensureDirSync(subfolderFullPath);
                const abiFileName = contractInfo.ContractName + '.abi';
                fs.writeFileSync(path.join(subfolderFullPath, abiFileName), contractInfo.ABI);
                const sourceCodeCollection = [];
                if (contractInfo.SourceCode.startsWith('{')) {
                    let sourceInfoString = contractInfo.SourceCode.trim();
                    if (sourceInfoString.startsWith('{{')) {
                        sourceInfoString = sourceInfoString.substring(1, sourceInfoString.length - 1);
                    }
                    const sourceInfo = JSON.parse(sourceInfoString);
                    const fileNames = Object.keys(sourceInfo.sources);
                    fileNames.forEach(fileName => {
                        const fullPathContractFile = path.join(subfolderFullPath, fileName);
                        fse.ensureDirSync(path.dirname(fullPathContractFile));
                        sourceCodeCollection.push(sourceInfo.sources[fileName].content);
                        fs.writeFileSync(fullPathContractFile, sourceInfo.sources[fileName].content);
                        downloadedFiles.push(fullPathContractFile);
                    });
                    const libraryImports = sourceDocumentCollection_1.SourceDocumentCollection.getAllLibraryImports(sourceCodeCollection);
                    const remappingContents = libraryImports.map(x => `${x}=${x}`).join('\n');
                    fs.writeFileSync(path.join(subfolderFullPath, 'remappings.txt'), remappingContents);
                }
                else {
                    const solidityFileName = contractInfo.ContractName + '.sol';
                    const fullPathContractFile = path.join(subfolderFullPath, solidityFileName);
                    fs.writeFileSync(fullPathContractFile, contractInfo.SourceCode);
                    downloadedFiles.push(fullPathContractFile);
                }
                return downloadedFiles;
            }
        });
    }
}
exports.EtherscanContractDownloader = EtherscanContractDownloader;
class EtherscanContractInfoService {
    static getContractInfo(chain, address, apiKey = 'YourApiKeyToken') {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = EtherscanDomainChainMapper.getDomain(chain);
            const url = `https://${domain}/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`;
            const response = yield axios_1.default.get(url);
            return response.data;
        });
    }
}
exports.EtherscanContractInfoService = EtherscanContractInfoService;
//# sourceMappingURL=etherscanSourceCodeDownloader.js.map