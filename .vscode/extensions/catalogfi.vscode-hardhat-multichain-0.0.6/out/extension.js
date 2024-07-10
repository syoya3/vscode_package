"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fs = require("fs");
function activate(context) {
    let disposable = vscode.commands.registerCommand("catalog-hardhat-multichain.setupNetworks", async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("No workspace folder found.");
            return;
        }
        const workspaceFolder = workspaceFolders[0];
        const chainsConfigPath = workspaceFolder.uri.fsPath + "/chains.config.json";
        if (!fs.existsSync(chainsConfigPath)) {
            vscode.window.showErrorMessage("No chains.config.json file found in the workspace folder.");
            return;
        }
        const chainsConfig = JSON.parse(fs.readFileSync(chainsConfigPath, "utf8"));
        const hardhatConfigPath = workspaceFolder.uri.fsPath + "/hardhat.config.ts";
        if (!fs.existsSync(hardhatConfigPath)) {
            vscode.window.showErrorMessage("No hardhat.config.ts file found in the workspace folder.");
            return;
        }
        for (const chain of chainsConfig.chains) {
            const hardhatConfig = fs.readFileSync(hardhatConfigPath, "utf8");
            if (chain.url) {
                const hardhatConfigWithChainId = hardhatConfig.replace(/hardhat: {[\s\S]*?},/g, "hardhat: { chainId: \n\t" + chain.chainId + "\n },");
                fs.writeFileSync(hardhatConfigPath, hardhatConfigWithChainId);
                const terminal = vscode.window.createTerminal(chain.name + " Chain");
                terminal.sendText(`npx hardhat node --fork ${chain.url} --port ${chain.port} --no-deploy`);
            }
            else {
                const hardhatConfigWithChainId = hardhatConfig.replace(/hardhat: {[\s\S]*?},/g, "hardhat: { chainId: \n\t" + chain.chainId + "\n },");
                fs.writeFileSync(hardhatConfigPath, hardhatConfigWithChainId);
                const terminal = vscode.window.createTerminal(chain.name + " Chain");
                terminal.sendText(`npx hardhat node --port ${chain.port} --no-deploy`);
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        const hardhatConfig = fs.readFileSync(hardhatConfigPath, "utf8");
        let extendEnvironment = "extendEnvironment((hre) => {";
        for (const chain of chainsConfig.chains) {
            extendEnvironment += `\nconst provider${chain.chainId} = new hre.ethers.providers.JsonRpcProvider("http://localhost:${chain.port}");`;
            extendEnvironment += `\nhre.${chain.name}Chain = provider${chain.chainId};\n`;
        }
        extendEnvironment += "});";
        if (hardhatConfig.includes("extendEnvironment")) {
            const hardhatConfigWithExtendEnvironment = hardhatConfig.replace(/extendEnvironment\([\s\S]*?}\);/g, extendEnvironment);
            fs.writeFileSync(hardhatConfigPath, hardhatConfigWithExtendEnvironment);
        }
        else {
            const hardhatConfigWithExtendEnvironment = hardhatConfig.replace(/export default config;/g, extendEnvironment + "\n\nexport default config;\n");
            const hardhatConfigWithExtendEnvironmentImport = hardhatConfigWithExtendEnvironment.replace(/import { HardhatUserConfig } from "hardhat\/config";/g, 'import { HardhatUserConfig, extendEnvironment } from "hardhat/config";');
            fs.writeFileSync(hardhatConfigPath, hardhatConfigWithExtendEnvironmentImport);
        }
        vscode.window.showInformationMessage("Networks setup successfully.");
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map