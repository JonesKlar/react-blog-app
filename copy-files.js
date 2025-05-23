import fs from 'fs';

const sourceFile = 'dist/index.html';
const targetFile = 'dist/404.html';

// Read the content of index.html
fs.readFile(sourceFile, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading ${sourceFile}:`, err);
    return;
  }

  // Write the content to 404.html
  fs.writeFile(targetFile, data, 'utf8', err => {
    if (err) console.error(`Error creating ${targetFile}:`, err);
    else console.log(`${targetFile} created successfully.`);
  });
});
