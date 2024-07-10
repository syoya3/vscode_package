<h1 align="center"> HardHat MultiChain </h1> <br>
<p align="center">
  <a href="https://catalog.fi/">
    <img alt="HardHat MultiChain" title="HardHat MultiChain" src="https://catalogfi.gallerycdn.vsassets.io/extensions/catalogfi/vscode-hardhat-multichain/0.0.4/1674649459076/Microsoft.VisualStudio.Services.Icons.Default" width="128">
  </a>
</p>

<p align="center">
Setup multichain environment in a HardHat project.
</p>

## Table of Contents

-   [Introduction](#introduction)
-   [Usage](#usage)
-   [Future](#future)
-   [Contributors](#contributors)

## Introduction

Introducing the "HardHat MultiChain" extension for VS Code - a powerful tool that streamlines the process of setting up a local multichain environment for your Ethereum development needs. With this extension, you can easily create and manage forked blockchain networks within your Hardhat projects, allowing you to test and debug your smart contracts and decentralized applications with ease. Whether you're a beginner or an experienced developer, this extension is the perfect solution for managing and testing your multichain projects. Say goodbye to the hassle of manual setup and configuration, and hello to a streamlined, efficient development experience.<br />
Get started now with the Hardhat MultiChain Extension for VS Code.

## Usage

### Download

Search **HardHat MultiChain** in extensions pane of VS Code and click on **Install**.

### Setup in Project

1. Create a file `chains.config.json` in root directory of a **HardHat Project**.
2. Here is the schema of `chains.config.json` ⬇️

```JSON
{
    "chains": {
        // keys and values reqired for a forked network setup
        "name": "Catalog",
        "url": "https://rpc.url.com/yoururl", // RPC URL to interact with the chain
        "chainId": 12345, // not neccessary to be same as original chain
        "port": 18514 // can be same port also but make sure it is available to use
    },
    {
        // keys and values required for new local chain setup
        "name": "Reetik",
        "chainId": 17080, // can use any valid chain id which is not already in use
        "port": 17080 // can be different port also but make sure it is available to use
    }
}
```

3. Press `Cmd + Shift + P`, then seach and hit **Setup HardHat MultiChain Networks**.
4. Wait for the notification in the right bottom corner of your screen i.e. **Networks setup successfully**.

## Future

- Implement error handling and required check to handle faliure.
- Integrate Bitcoin Blockchain.

## Contributors

### --- TO BE UPDATED ----
