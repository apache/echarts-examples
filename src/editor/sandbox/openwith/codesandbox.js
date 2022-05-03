import { getParameters } from 'codesandbox/lib/api/define';
import { getTemplates } from './helper';

/**
 * Open with CodeSandbox
 * @param {string} code
 * @param {Array<{ src?: string, content?: string }>} scripts
 * @param {string} css
 */
export default function openWithCodeSandbox(title, scripts, css) {
  const templates = getTemplates(title, scripts, css);
  title = templates.title.split(' - ');

  const params = getParameters({
    template: 'static',
    files: {
      'index.html': {
        content: templates.html
          .replace(
            '</head>',
            '  <link rel="stylesheet" href="./style.css">\n</head>'
          )
          .replace('</body>', '  <script src="./index.js"></script>\n</body>')
      },
      'index.js': {
        content: templates.js
      },
      'style.css': {
        content: templates.css
      },
      'package.json': {
        content: {
          name: title[0],
          description: title[1] || '',
          keywords: ['echarts', 'apache'],
          main: 'index.html'
        }
      },
      'sandbox.config.json': {
        content: {
          template: 'static'
        }
      }
    }
  });

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://codesandbox.io/api/v1/sandboxes/define';
  form.target = '_blank';
  form.style.display = 'none';

  const input = document.createElement('input');
  input.setAttribute('name', 'parameters');
  input.setAttribute('type', 'hidden');
  input.setAttribute('value', params);

  form.appendChild(input);
  document.body.appendChild(form);

  form.submit();

  document.body.removeChild(form);
}
