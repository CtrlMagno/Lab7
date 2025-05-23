# Web Components Firebase App

A modern web application built with Web Components, TypeScript, and Firebase.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Firebase:
   - Create a new Firebase project at https://console.firebase.google.com/
   - Copy your Firebase configuration from the project settings
   - Replace the placeholder configuration in `src/index.ts` with your Firebase config

## Development

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:9000`

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
├── src/
│   ├── components/     # Web Components
│   ├── index.html     # Main HTML file
│   └── index.ts       # Application entry point
├── package.json
├── tsconfig.json
└── webpack.config.js
```

## Adding New Components

1. Create a new TypeScript file in the `src/components` directory
2. Define your component class extending `HTMLElement`
3. Register your component using `customElements.define()`
4. Import and use your component in other components or the main app 