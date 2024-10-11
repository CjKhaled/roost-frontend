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
    '''console
    git clone https://github.com/CjKhaled/roost-frontend.git
    '''

2. **Navigate to project directory:**
    '''console
    cd roost-frontend
    '''

3. **Install dependencies:"**
    '''console
    npm install
    '''

    or

    '''console
    yarn install
    '''

4. **Start server:**
    '''console
    npm run dev
    '''

    or 

    '''console
    yarn dev
    '''

## Development Workflow

### Running project
'''console
npm run dev
'''

### Builgind project
'''console
npm run build
'''

### Preview build
'''console
npm run preview
'''

## Project Structure
roost-frontend/
├── public/             # Static files (index.html, images, etc.) <br>
├── src/                # Main source folder <br>
│   ├── components/     # Reusable components <br>
│   ├── pages/          # Pages for the app <br>
│   ├── App.jsx         # Main App component <br>
│   └── main.jsx        # Entry point for the app <br>
├── .gitignore          # Files and folders to ignore in git <br>
├── README.md           # Project documentation <br>
├── package.json        # Project metadata and dependencies <br>
├── vite.config.js      # Vite configuration <br>
└── eslint.config.js    # ESLint configuration <br>

## Code Quality
Use ESLint to ensure code quality & consistency; configured in **eslint.config.js** file

'''console
npm run lint
'''

## Contributing Guidelines
1. Fork the repository and clone it to your local machine.
2. Create a new branch for your feature or bugfix:
    '''console
    git checkout -b feature/your-feature-name
    '''
3. Write your code
4. Commit
    '''console
    git commit -m "Add feature: your feature"
    '''
5. Push
    '''console
    git push origin feature/your-feature-name
    '''
6. Create PR

### Pull Request Checklist
Ensure your code matches standards, tested, and no remaining bugs before submitting PR

