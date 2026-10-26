import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export const themes = [
  { id: 'cream', name: 'Ivory', color: '#f4eee3', ink: '#3a332c' },
  { id: 'noir', name: 'Noir', color: '#292929', ink: '#ffffff' },
  { id: 'sage', name: 'Sage', color: '#dce4d9', ink: '#364a39' },
  { id: 'rose', name: 'Dusty Rose', color: '#efddda', ink: '#694b4b' },
];
export const fontOptions = [
  { value: 'Georgia, serif', label: 'Classic Serif' },
  { value: "'DM Sans', Arial, sans-serif", label: 'Modern Sans' },
  { value: "'Playfair Display', Georgia, serif", label: 'Elegant' },
  { value: 'cursive', label: 'Handwritten' },
];
export function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function formatDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
}
export default function FramePreview({ count = 4, theme = themes[0], design = {}, photos = [], logo = null }) {
  const { title = 'little moments, forever.', date = todayString(), showDate = true, font = 'Georgia, serif', fontSize = 15, textColor = theme.ink } = design;
  return (
    <div className="strip" style={{ background: theme.color, color: theme.ink }}>
      <div className="strip-brand">SNAPSTUDIO</div>
      <div className={`photos photos-${count}`}>
        {Array.from({ length: count }, (_, i) => (
          <div className="photo" key={i}>
            {photos[i] ? <img className="strip-photo-img" src={photos[i]} alt={`Shot ${i + 1}`} /> : <><ImageIcon size={22} strokeWidth={1} /><span>{String(i + 1).padStart(2, '0')}</span></>}
          </div>
        ))}
      </div>
      {logo && <img className="strip-logo" src={logo} alt="Event logo" />}
      {title && <div className="strip-title" style={{ fontFamily: font, fontSize: `${fontSize}px`, color: textColor, fontStyle: 'normal' }}>{title}</div>}
      {showDate && <div className="strip-date" style={{ color: textColor }}>{formatDate(date)}</div>}
    </div>
  );
}
