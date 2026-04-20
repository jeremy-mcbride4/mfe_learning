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
execSync(
  'npm install',
  { cwd: root, stdio: 'inherit' }
);
console.log('\n✓ Dependencies installed');
console.log('\nNext steps (manual):');
console.log(`  1. Add to shell webpack.config.js remotes:`);
console.log(`       ${federationName}: '${federationName}@http://localhost:${port}/remoteEntry.js'`);
console.log(`  2. Add to shell App.js:`);
console.log(`       const ${componentName}App = React.lazy(() => import('${federationName}/${componentName}App'));`);
console.log(`       <Route path="/${name}" element={<Suspense fallback={<div>Loading...</div>}><${componentName}App /></Suspense>} />`);
