const fs = require('fs');
const path = require('path');

const output = [];
const root = process.cwd();

const excludeDirs = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.cache'
];

function scan(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      if (!excludeDirs.includes(file.name)) {
        scan(fullPath);
      }
      continue;
    }

    const ext = path.extname(file.name);

    if (
      ['.js', '.css', '.html', '.json', '.yaml', '.yml', '.md']
        .includes(ext)
    ) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');

        output.push(
`==================================================
FILE: ${path.relative(root, fullPath)}
==================================================

${content}

`
        );
      } catch (err) {
        console.log(`Skipped: ${fullPath}`);
      }
    }
  }
}

scan(root);

fs.writeFileSync(
  'project-dump.txt',
  output.join('\n'),
  'utf8'
);

console.log('Dump created: project-dump.txt');