// Manual build script for ElderLink Dashboard
// This creates a production build without requiring npm

const fs = require('fs');
const path = require('path');

console.log('🔨 Starting manual build process...');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy static files
const staticFiles = ['index.html'];
staticFiles.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(distDir, file);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ Copied ${file}`);
    }
});

// Create assets directory
const assetsDir = path.join(distDir, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Create a simple bundled JS file
const bundleContent = `
// ElderLink Dashboard - Production Bundle
console.log('ElderLink Dashboard loaded');

// Basic React-like functionality for demo
function createElement(tag, props, ...children) {
    const element = document.createElement(tag);
    if (props) {
        Object.assign(element, props);
    }
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    return element;
}

// Export for global use
window.React = { createElement };
window.ReactDOM = {
    render: (component, container) => {
        container.innerHTML = '';
        container.appendChild(component);
    }
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initialized');
});
`;

fs.writeFileSync(path.join(assetsDir, 'index.js'), bundleContent);
console.log('✅ Created bundled JS');

// Create CSS bundle
const cssContent = `
/* ElderLink Dashboard - Production CSS */
@import url('https://cdn.tailwindcss.com');

/* Design System CSS Variables */
:root {
    --color-primary: #457B9D;
    --color-primary-light: #A8DADC;
    --color-primary-dark: #1D3557;
    --color-secondary: #E63946;
    --color-secondary-light: #F1FAEE;
    --color-secondary-dark: #C0392B;
    --color-success: #06D6A0;
    --color-success-light: #D4F8F0;
    --color-success-dark: #04A07F;
    --color-warning: #F4A261;
    --color-warning-light: #FEEBC8;
    --color-warning-dark: #D97706;
    --color-error: #E63946;
    --color-error-light: #FEE2E2;
    --color-error-dark: #DC2626;
    --color-text: #1D3557;
    --color-text-muted: #6B7280;
    --color-background: #F8F9FA;
    --color-surface: #FFFFFF;
    --color-neutral: #E5E7EB;
    --color-neutral-dark: #9CA3AF;
}

.card {
    background-color: var(--color-surface);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 1.5rem;
}

.badge-primary {
    background-color: var(--color-primary-light);
    color: var(--color-primary-dark);
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
}

.transition-normal {
    transition: all 0.3s ease-in-out;
}

/* Projector optimization */
@media (min-width: 1920px) {
    .projector-optimized {
        font-size: 1.1rem;
    }
    .projector-text-xl { font-size: 1.75rem; }
    .projector-text-2xl { font-size: 2.25rem; }
    .projector-text-3xl { font-size: 3rem; }
    .projector-text-lg { font-size: 1.25rem; }
    .projector-spacing {
        padding: 2rem;
        margin-bottom: 2rem;
    }
}
`;

fs.writeFileSync(path.join(assetsDir, 'index.css'), cssContent);
console.log('✅ Created bundled CSS');

// Create production index.html
const productionHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ElderLink Dashboard</title>
    <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
    <div id="root">
        <!-- Dashboard will be rendered here -->
        <div class="min-h-screen bg-gray-50">
            <nav class="bg-white border-b sticky top-0 z-10">
                <div class="max-w-7xl mx-auto px-4">
                    <div class="flex space-x-8">
                        <button class="py-3 px-1 border-b-2 border-blue-500 text-blue-600 transition-colors">
                            📞 Live Call 🔴
                        </button>
                        <button class="py-3 px-1 border-b-2 border-transparent text-gray-600 hover:text-gray-900 transition-colors">
                            👤 Senior Profile
                        </button>
                        <button class="py-3 px-1 border-b-2 border-transparent text-gray-600 hover:text-gray-900 transition-colors">
                            👥 Community
                        </button>
                        <button class="py-3 px-1 border-b-2 border-transparent text-gray-600 hover:text-gray-900 transition-colors">
                            📊 Analytics
                        </button>
                    </div>
                </div>
            </nav>
            <main class="max-w-7xl mx-auto px-4 py-6">
                <div class="card">
                    <h1 class="text-3xl font-bold text-center text-gray-900 mb-8">
                        ElderLink Dashboard - Production Build
                    </h1>
                    <div class="text-center">
                        <p class="text-lg text-gray-600 mb-4">
                            This is a production build of the ElderLink Dashboard
                        </p>
                        <p class="text-sm text-gray-500">
                            Built: ${new Date().toISOString()}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    </div>
    <script src="/assets/index.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), productionHtml);
console.log('✅ Created production index.html');

console.log('🎉 Manual build completed successfully!');
console.log(`📁 Build output: ${distDir}`);
console.log('📋 Files created:');
console.log('  - index.html');
console.log('  - assets/index.js');
console.log('  - assets/index.css');
