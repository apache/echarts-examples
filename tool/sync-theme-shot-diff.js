/**
 * Sync shot diff of theme to reduce the manual check.
 */

const shell = require('shelljs');

function compare() {
  const res = shell.exec('git diff --name-only | xargs | uniq');
  const files = res.stdout.split(/\s/g);

  function getThumbFolder(theme) {
    return `public/data/${theme === 'light' ? 'thumb/' : 'thumb-dark/'}`;
  }

  const darkThumbFolder = getThumbFolder('dark');
  const lightThemeFolder = getThumbFolder('light');

  const filesToRestore = [];

  files.forEach((file) => {
    if (
      (file.startsWith(darkThumbFolder) &&
        !files.includes(file.replace(darkThumbFolder, lightThemeFolder))) ||
      (file.startsWith(lightThemeFolder) &&
        !files.includes(file.replace(lightThemeFolder, darkThumbFolder)))
    ) {
      filesToRestore.push(file);
    }
  });

  filesToRestore.forEach((file) => {
    shell.exec(`git restore ${file}`);
    console.log(`Restored ${file}`);
  });
}

compare();
