const fs = require('fs');
const globby = require('globby');
const matter = require('gray-matter');
const path = require('path');

async function update(root) {
  const baseDir = __dirname + '/../public/' + root + '/';

  const files = await globby([baseDir + '*.js']);

  for (let file of files) {
    const fileName = path.basename(file);
    const code = fs.readFileSync(file, 'utf-8');
    if (
      matter.test(code, {
        delimiters: ['/*', '*/']
      })
    ) {
      continue;
    }

    const mdContent = fs.readFileSync(
      baseDir + 'meta/' + fileName.replace(/.js$/, '.md'),
      'utf-8'
    );

    const res = matter(mdContent);
    const comment = matter.stringify('', res.data, {
      delimiters: ['/*', '*/']
    });

    fs.writeFileSync(file, comment + code, 'utf-8');
  }
}

update('data').then(() => {
  update('data-gl');
});
