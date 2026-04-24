const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const [name, port] = process.argv.slice(2);

if (!name || !port) {
  console.error('Usage: node scripts/create-mfe.js <name> <port>');
  console.error('Example: node scripts/create-mfe.js flight-logs 3003');
  process.exit(1);
}

const componentName = name
  .split('-')
  .map(w => w.charAt(0).toUpperCase() + w.slice(1))
  .join('');

const navLabel = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
const federationName = 'mfe' + componentName;
const packageName = `@mfe/mfe-${name}`;
const root = path.resolve(__dirname, '..', 'packages', `mfe-${name}`);

const files = {
  'package.json': JSON.stringify({
    name: packageName,
    version: '1.0.0',
    private: true,
    scripts: {
      start: 'webpack serve --mode development',
      build: 'webpack --mode production',
    },
    dependencies: {
      react: '^19.2.5',
      'react-dom': '^19.2.5',
    },
  }, null, 2),

  'webpack.config.js': `const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:${port}/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\\.jsx?$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader', options: { rootMode: 'upward' } },
      },
      {
        test: /\\.module\\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { modules: true, esModule: false },
          },
        ],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: '${federationName}',
      filename: 'remoteEntry.js',
      exposes: {
        './${componentName}App': './src/${componentName}App',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    port: ${port},
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
`,

  'public/index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${componentName}</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`,

  'src/index.js': `import('./bootstrap');\n`,

  'src/bootstrap.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import ${componentName}App from './${componentName}App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<${componentName}App />);
`,

  [`src/${componentName}App.jsx`]: `import React from 'react';

export default function ${componentName}App() {
  return (
    <div>
      <h2>${componentName}</h2>
      <p>${componentName} MFE is working.</p>
    </div>
  );
}
`,
};

fs.mkdirSync(path.join(root, 'src'), { recursive: true });
fs.mkdirSync(path.join(root, 'public'), { recursive: true });

for (const [filePath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(root, filePath), content);
}

console.log(`\n✓ Created packages/mfe-${name}`);
console.log('\nInstalling dependencies...');
execSync('npm install', { cwd: root, stdio: 'inherit' });
console.log('\n✓ Dependencies installed');

// --- Wire into shell webpack.config.js ---
const shellWebpackPath = path.resolve(__dirname, '..', 'packages', 'shell', 'webpack.config.js');
let shellWebpack = fs.readFileSync(shellWebpackPath, 'utf8');
shellWebpack = shellWebpack.replace(
  /(remotes:\s*\{)([\s\S]*?)(\n(\s*)\},)/,
  (_, open, content, close, whitespace) =>
    `${open}${content}\n${whitespace}    ${federationName}: '${federationName}@http://localhost:${port}/remoteEntry.js',${close}`
);
fs.writeFileSync(shellWebpackPath, shellWebpack);
console.log('✓ Updated shell/webpack.config.js');

// --- Wire into shell App.js ---
const shellAppPath = path.resolve(__dirname, '..', 'packages', 'shell', 'src', 'App.js');
let shellApp = fs.readFileSync(shellAppPath, 'utf8');

// Add lazy import after the last existing React.lazy line
const lazyRegex = /^(const \w+App = React\.lazy[^\n]+)$/gm;
let lastLazyMatch = null;
let m;
while ((m = lazyRegex.exec(shellApp)) !== null) lastLazyMatch = m;
if (lastLazyMatch) {
  const insertAt = lastLazyMatch.index + lastLazyMatch[0].length;
  shellApp =
    shellApp.slice(0, insertAt) +
    `\nconst ${componentName}App = React.lazy(() => import('${federationName}/${componentName}App'));` +
    shellApp.slice(insertAt);
}

// Add NavLink before </nav>
shellApp = shellApp.replace(
  /(\s*<\/nav>)/,
  `\n                        <NavLink to="/${name}" className={navLinkStyle}>${navLabel}</NavLink>$1`
);

// Add Route before </Routes>
shellApp = shellApp.replace(
  /(\s*<\/Routes>)/,
  `\n                        <Route path="/${name}" element={<Suspense fallback={<Loading />}><${componentName}App /></Suspense>} />$1`
);

fs.writeFileSync(shellAppPath, shellApp);
console.log('✓ Updated shell/src/App.js');

// --- Update root package.json start script ---
const EXTRA_COLORS = ['red', 'gray', 'bgBlue', 'bgGreen', 'bgYellow', 'bgMagenta', 'bgWhite', 'bgCyan', 'bgRed'];
const rootPkgPath = path.resolve(__dirname, '..', 'package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
let startScript = rootPkg.scripts.start;

const usedColors = (startScript.match(/-c "([^"]+)"/) || ['', ''])[1].split(',');
const nextColor = EXTRA_COLORS.find(c => !usedColors.includes(c)) || 'gray';

startScript = startScript
  .replace(',shell"', `,${name},shell"`)
  .replace(',cyan"', `,${nextColor},cyan"`)
  .replace(
    '"npm start --workspace=packages/shell"',
    `"npm start --workspace=packages/mfe-${name}" "npm start --workspace=packages/shell"`
  );

rootPkg.scripts.start = startScript;
fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');
console.log('✓ Updated root package.json start script');

console.log(`\n✓ Done! mfe-${name} is fully wired. Run "npm start" from the repo root to launch everything.\n`);
