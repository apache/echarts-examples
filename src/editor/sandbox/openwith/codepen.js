import { getTemplates } from './helper';

/**
 * Open with CodePen
 * @param {string} code
 * @param {Array<{ src?: string, content?: string }>} scripts
 * @param {string} css
 */
export default function openWithCodePen(title, scripts, css) {
  const templates = getTemplates(title, scripts, css);

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://codepen.io/pen/define/';
  form.target = '_blank';
  form.style.display = 'none';

  const input = document.createElement('input');
  input.setAttribute('name', 'data');
  input.setAttribute('type', 'hidden');
  input.setAttribute('value', JSON.stringify(templates));

  form.appendChild(input);
  document.body.appendChild(form);

  form.submit();

  document.body.removeChild(form);
}
