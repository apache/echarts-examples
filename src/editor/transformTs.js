import { transform } from 'sucrase';

export default function (code) {
  return transform(code, {
    transforms: ['typescript']
  }).code.trim();
}
