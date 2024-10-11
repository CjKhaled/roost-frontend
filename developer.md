# Developer Guide

Welcome to **roost-frontend**! This document states how you should contribute to this repository.

## Table of Contents

- [Setup](#setup)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Code Quality](#code-quality)
- [Contributing Guidelines](#contributing-guidelines)

## Setup

### Prerequisites

Ensure you have Node.JS and either npm or yarn:

- **Node.js**: [Download and install Node.js](https://nodejs.org/).
- **npm** or **yarn**: You can use either npm (comes with Node.js) or yarn as a package manager.

### Initial Setup

1. **Clone the repository:**
    '''bash
    git clone https://github.com/CjKhaled/roost-frontend.git

2. **Navigate to project directory:**
    '''bash
    cd roost-frontend

3. **Install dependencies:"**
    '''bash
    npm install

    or

    '''bash
    yarn install

4. **Start server:**
    '''bash
    npm run dev

    or 

    '''bash
    yarn dev

## Development Workflow

### Running project
'''bash
npm run dev

### Builgind project
'''bash
npm run build

### Preview build
'''bash
npm run preview

## Project Structure
roost-frontend/
├── public/             # Static files (index.html, images, etc.)
├── src/                # Main source folder
│   ├── components/     # Reusable components
│   ├── pages/          # Pages for the app
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Entry point for the app
├── .gitignore          # Files and folders to ignore in git
├── README.md           # Project documentation
├── package.json        # Project metadata and dependencies
├── vite.config.js      # Vite configuration
└── eslint.config.js    # ESLint configuration

## Code Quality
Use ESLint to ensure code quality & consistency; configured in **eslint.config.js** file

'''bash
npm run lint

## Contributing Guidelines
1. Fork the repository and clone it to your local machine.
2. Create a new branch for your feature or bugfix:
    '''bash
    git checkout -b feature/your-feature-name
3. Write your code
4. Commit
    '''bash
    git commit -m "Add feature: your feature"
5. Push
    '''bash
    git push origin feature/your-feature-name
6. Create PR

### Pull Request Checklist
Ensure your code matches standards, tested, and no remaining bugs before submitting PR

