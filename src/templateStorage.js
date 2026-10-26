const KEY = 'snapstudio.templates.v1';
export function loadTemplates() {
  try { const value = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(value) ? value : []; }
  catch { return []; }
}
export function saveTemplate(item) {
  try { const next = [item, ...loadTemplates()].slice(0, 20); localStorage.setItem(KEY, JSON.stringify(next)); return next; }
  catch { return null; }
}
export function deleteTemplate(id) {
  const next = loadTemplates().filter(item => item.id !== id);
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* browser storage disabled */ }
  return next;
}
export async function readLogo(file) {
  if (!['image/png','image/jpeg','image/webp'].includes(file.type)) throw new Error('Please select a PNG, JPG, or WebP image.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Logo must be smaller than 5 MB.');
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => { const im = new Image(); im.onload = () => resolve(im); im.onerror = reject; im.src = url; });
    const scale = Math.min(1, 500 / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale));
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  } finally { URL.revokeObjectURL(url); }
}
