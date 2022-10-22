<!-- markdownlint-disable MD033 MD041 -->

<h1 align="center">Frontend for TIPS</h1>

## Overview

TIPS is a monolithic rewrite of Code2Gather to support the technical interview preparation for NUS SoC students. Its functionalities include:

- Collaborative Code Editor with Mock Interview Support
- LeetCode Question Tracking with Telegram Integration
- (WIP) Interview Roleplay with Partner Matching and Question Generation

## Contributors

Code2Gather was originally developed by the following people for NUS CS3219:

- [He XinYue](https://github.com/eksinyue)
- [Wang Luo](https://github.com/Asthenosphere)
- [Wen Junhua](https://github.com/Jh123x)
- [Zhu Hanming](https://github.com/zhuhanming)

## Project Requirements

### Node.js v14 LTS

One easy way to install Node is to simply download from [their website](https://nodejs.org/en/).

Another alternative way is to utilise [`nodenv`](https://github.com/nodenv/nodenv). Do check out their `README.md` for OS-specific installation instructions.

### Yarn

Once you have Node installed, simply install Yarn using `npm`:

```sh
npm install --global yarn
```

We will be using Yarn for Node dependency management, as well as for its workspaces functionality, the latter of which will streamline some project-level processes, such as pre-commit checks.

## Contributing to TIPS

### Installation

First, clone this repository:

```sh
git clone https://github.com/CodeToGather/TIPS-Frontend.git
```

Then, navigate to the project root and install the dependencies:

```sh
cd TIPS-Frontend
yarn install
```

Finally, you can get the frontend up and running via:

```sh
yarn start
```

### Backend

You can find the backend [here](https://github.com/CodeToGather/TIPS-Backend).

### Committing

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) for our commit guidelines.

The easiest way to start committing is to run the following command anywhere within the project directory:

```sh
yarn commit
```

You will be guided through an interactive prompt that will help you craft a beautiful commit message, using `commitizen`.
