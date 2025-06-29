# Contributing to Simple Mail Merge

Thank you for your interest in contributing to Simple Mail Merge! This guide will help you get started with development and contributing to the project.

## Development Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Git

### Installation

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/yourusername/simple-mailmerge.git
cd simple-mailmerge
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```text
simple-mailmerge/
├── src/
│   ├── components/           # React components
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Application entry point
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
├── README.md                 # User documentation
└── CONTRIBUTING.md           # This file
```

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Document Processing**:
  - `docxtemplater` - DOCX template processing
  - `pizzip` - ZIP file handling
- **Excel Processing**: `xlsx` - Excel file parsing
- **File Handling**: `file-saver` - Download functionality
- **Icons**: Lucide React
- **Development Tools**: ESLint, TypeScript, PostCSS

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use ESLint to check code quality before committing
- Use meaningful variable and function names
- Add comments for complex logic

### Component Guidelines

- Keep components focused and single-purpose
- Use TypeScript interfaces for props
- Handle loading and error states appropriately
- Make components responsive and accessible

### Git Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "Add descriptive commit message"
   ```

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub


Thank you for contributing to Simple Mail Merge! 🎉
