import React, { useState } from 'react';
import { saveTemplate, loadTemplates, deleteTemplate, readLogo } from './templateStorage.js';
import CameraStudio from './CameraStudio.jsx';
import FramePreview, { themes, fontOptions, todayString } from './FramePreview.jsx';
import PhotoEditor from './PhotoEditor.jsx';
import { Camera, ArrowRight, ArrowLeft, Globe2, CalendarDays, Sparkles, Check } from 'lucide-react';

const words = {
  en: {
    home: 'Home', personal: 'Personal', event: 'Event', tag: 'YOUR MOMENTS, BEAUTIFULLY FRAMED',
    hero: 'A little moment. A lasting memory.', sub: 'Your own photobooth, anytime and anywhere.',
    start: 'Enter the studio', modes: 'CHOOSE YOUR EXPERIENCE', personalTitle: 'Personal Studio',
    personalSub: 'For the everyday moments worth keeping.', eventTitle: 'Event Studio',
    eventSub: 'Make every gathering unforgettable.', choose: 'Choose your layout', theme: 'Choose your theme',
    next: 'Continue to camera', back: 'Back', shots: 'photos', footer: 'Made for memories.',
    preview: 'LIVE FRAME PREVIEW', customize: 'Customize your frame', title: 'Frame title',
    titlePlaceholder: 'e.g. Besties Forever ♡', date: 'Frame date', showDate: 'Show date',
    font: 'Font style', size: 'Title size', color: 'Text color', reset: 'Reset text settings',
    result: 'Beautifully captured.', resultSub: 'Edit your frame, add text or stickers, then download your finished photo strip.',
    backCamera: 'Back to camera', backSetup: 'Back to settings', eventHint: 'Use your event name as the frame title.',
    templateHeading: 'My templates', templateName: 'Template name', saveTemplate: 'Save design', loadTemplate: 'Use template', deleteTemplate: 'Delete', noTemplates: 'No saved designs yet.', templateSaved: 'Template saved on this browser.', templateError: 'Unable to save. Browser storage may be full.', logoHeading: 'Event logo (optional)', uploadLogo: 'Upload logo', removeLogo: 'Remove logo', logoHint: 'PNG/JPG/WebP · shown on your frame and included in downloads.',
  },
  zh: {
    home: '首页', personal: '个人模式', event: '活动模式', tag: '为每一刻，留下美好纪念',
    hero: '定格这一刻，珍藏每段回忆。', sub: '属于你的线上拍贴机，随时随地记录美好。',
    start: '进入摄影间', modes: '选择拍照模式', personalTitle: '个人摄影间',
    personalSub: '为日常的小小幸福留下纪念。', eventTitle: '活动摄影间',
    eventSub: '让每一场相聚都值得纪念。', choose: '选择照片排版', theme: '选择相框主题',
    next: '继续拍照', back: '返回', shots: '张照片', footer: '珍藏每个瞬间。',
    preview: '即时相框预览', customize: '自定义相框文字', title: '相框标题',
    titlePlaceholder: '例如 Besties Forever ♡', date: '相框日期', showDate: '显示日期',
    font: '字体风格', size: '标题大小', color: '文字颜色', reset: '重置文字设置',
    result: '拍摄完成！', resultSub: '编辑相框、添加文字和贴纸，然后下载完整照片条。',
    backCamera: '返回拍摄', backSetup: '返回设置', eventHint: '可以直接把活动名称填写为相框标题。',
    templateHeading: '我的相框模板', templateName: '模板名称', saveTemplate: '保存设计', loadTemplate: '使用模板', deleteTemplate: '删除', noTemplates: '还没有保存的模板。', templateSaved: '已保存到此浏览器。', templateError: '无法保存，浏览器存储空间可能已满。', logoHeading: '活动 Logo（可选）', uploadLogo: '上传 Logo', removeLogo: '移除 Logo', logoHint: '支持 PNG/JPG/WebP；预览与下载都会包含 Logo。',
  },
};

const defaultDesign = () => ({ title: 'little moments, forever.', date: todayString(), showDate: true, font: 'Georgia, serif', fontSize: 15, textColor: themes[0].ink });

export default function App() {
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('home');
  const [mode, setMode] = useState('personal');
  const [count, setCount] = useState(4);
  const [theme, setTheme] = useState(themes[0]);
  const [design, setDesign] = useState(defaultDesign);
  const [captured, setCaptured] = useState([]);
  const [logo, setLogo] = useState(null);
  const [templates, setTemplates] = useState(loadTemplates);
  const [templateName, setTemplateName] = useState('');
  const [templateNotice, setTemplateNotice] = useState('');
  const [logoError, setLogoError] = useState('');
  const t = words[lang];
  const updateDesign = (field, value) => setDesign(prev => ({ ...prev, [field]: value }));
  function saveCurrentTemplate() {
    const name = templateName.trim() || `${mode === 'event' ? 'Event' : 'Personal'} ${new Date().toLocaleDateString()}`;
    const next = saveTemplate({ id: `${Date.now()}`, name, mode, count, themeId: theme.id, design, logo });
    if (next) { setTemplates(next); setTemplateName(name); setTemplateNotice(t.templateSaved); }
    else setTemplateNotice(t.templateError);
  }
  function applyTemplate(item) {
    setMode(item.mode || 'personal'); setCount(item.count || 4);
    setTheme(themes.find(x => x.id === item.themeId) || themes[0]);
    setDesign(item.design || defaultDesign()); setLogo(item.logo || null); setTemplateName(item.name); setTemplateNotice('');
  }
  async function handleLogo(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try { setLogoError(''); setLogo(await readLogo(file)); }
    catch (err) { setLogoError(err.message); }
    event.target.value = '';
  }
  function begin(nextMode) { setMode(nextMode); setPage('setup'); }
  function selectTheme(nextTheme) {
    setDesign(prev => ({ ...prev, textColor: prev.textColor === theme.ink ? nextTheme.ink : prev.textColor }));
    setTheme(nextTheme);
  }

  return (
    <div className="site">
      <header className="topbar">
        <button className="wordmark" onClick={() => setPage('home')}><Camera size={21} strokeWidth={1.7} />SnapStudio<span className="dot">.</span></button>
        <nav><button onClick={() => setPage('home')}>{t.home}</button><button onClick={() => begin('personal')}>{t.personal}</button><button onClick={() => begin('event')}>{t.event}</button></nav>
        <button className="language" onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} aria-label="Switch language"><Globe2 size={17} />{lang === 'en' ? '中文' : 'EN'}</button>
      </header>

      {page === 'home' && (
        <main>
          <section className="hero">
            <div className="eyebrow"><span className="small-line" />{t.tag}<span className="small-line" /></div>
            <h1>{t.hero}</h1><p>{t.sub}</p>
            <button className="primary" onClick={() => document.getElementById('modes')?.scrollIntoView({ behavior: 'smooth' })}>{t.start}<ArrowRight size={18} /></button>
            <div className="hero-visual">
              <div className="visual-card left-card"><FramePreview count={3} theme={themes[2]} design={{ ...defaultDesign(), textColor: themes[2].ink }} /></div>
              <div className="visual-card middle-card"><FramePreview count={4} theme={themes[0]} design={defaultDesign()} /></div>
              <div className="visual-card right-card"><FramePreview count={4} theme={themes[3]} design={{ ...defaultDesign(), textColor: themes[3].ink }} /></div>
            </div>
          </section>
          <section id="modes" className="modes">
            <div className="eyebrow">{t.modes}</div>
            <div className="mode-grid">
              <button className="mode-card" onClick={() => begin('personal')}><span className="mode-icon"><Sparkles size={25} strokeWidth={1.5} /></span><h2>{t.personalTitle}</h2><p>{t.personalSub}</p><span className="card-link">{t.next}<ArrowRight size={17} /></span></button>
              <button className="mode-card" onClick={() => begin('event')}><span className="mode-icon"><CalendarDays size={25} strokeWidth={1.5} /></span><h2>{t.eventTitle}</h2><p>{t.eventSub}</p><span className="card-link">{t.next}<ArrowRight size={17} /></span></button>
            </div>
          </section>
        </main>
      )}

      {page === 'setup' && (
        <main className="studio">
          <button className="back" onClick={() => setPage('home')}><ArrowLeft size={16} />{t.back}</button>
          <div className="studio-grid">
            <section className="settings">
              <div className="eyebrow">{mode === 'personal' ? t.personalTitle : t.eventTitle}</div>
              <h1>{t.choose}</h1>
              <div className="option-row">
                {[3, 4, 6].map(n => <button key={n} className={`count-option ${count === n ? 'active' : ''}`} onClick={() => setCount(n)}><span className="mini-layout">{Array.from({ length: n }, (_, i) => <i key={i} />)}</span><strong>{n}</strong><small>{t.shots}</small>{count === n && <Check className="option-check" size={15} />}</button>)}
              </div>
              <h2>{t.theme}</h2>
              <div className="theme-row">
                {themes.map(item => <button key={item.id} className={`theme-option ${theme.id === item.id ? 'active' : ''}`} onClick={() => selectTheme(item)}><span className="theme-swatch" style={{ background: item.color }}>{theme.id === item.id && <Check size={18} color={item.ink} />}</span><span>{item.name}</span></button>)}
              </div>
              <h2>{t.customize}</h2>
              {mode === 'event' && <p className="field-hint">{t.eventHint}</p>}
              <div className="design-fields">
                <label className="field-wide">{t.title}<input type="text" maxLength={100} value={design.title} placeholder={t.titlePlaceholder} onChange={e => updateDesign('title', e.target.value)} /></label>
                <label>{t.date}<input type="date" value={design.date} onChange={e => updateDesign('date', e.target.value)} /></label>
                <label className="check-field"><input type="checkbox" checked={design.showDate} onChange={e => updateDesign('showDate', e.target.checked)} />{t.showDate}</label>
                <label>{t.font}<select value={design.font} onChange={e => updateDesign('font', e.target.value)}>{fontOptions.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
                <label>{t.size} ({design.fontSize}px)<input type="range" min="10" max="28" value={design.fontSize} onChange={e => updateDesign('fontSize', Number(e.target.value))} /></label>
                <label>{t.color}<input type="color" value={design.textColor} onChange={e => updateDesign('textColor', e.target.value)} /></label>
              </div>
              <div className="phase4-panel">
                <h2>{t.logoHeading}</h2>
                <p className="field-hint">{t.logoHint}</p>
                <div className="logo-controls"><label className="secondary logo-upload">{t.uploadLogo}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogo} hidden /></label>{logo && <button className="secondary" onClick={() => setLogo(null)}>{t.removeLogo}</button>}</div>
                {logo && <img className="logo-thumbnail" src={logo} alt="Uploaded logo" />}
                {logoError && <p className="camera-error" role="alert">{logoError}</p>}
                <h2>{t.templateHeading}</h2>
                <div className="template-save"><input aria-label={t.templateName} placeholder={t.templateName} value={templateName} onChange={e => setTemplateName(e.target.value)} /><button className="secondary" onClick={saveCurrentTemplate}>{t.saveTemplate}</button></div>
                {templateNotice && <p className="field-hint" role="status">{templateNotice}</p>}
                <div className="template-list">{templates.length === 0 ? <p className="field-hint">{t.noTemplates}</p> : templates.map(item => <div className="template-item" key={item.id}><span title={item.name}>{item.name}</span><button className="secondary" onClick={() => applyTemplate(item)}>{t.loadTemplate}</button><button className="template-delete" onClick={() => { const next = deleteTemplate(item.id); setTemplates(next); }} aria-label={`${t.deleteTemplate} ${item.name}`}>×</button></div>)}</div>
              </div>
              <div className="setup-actions"><button className="secondary" onClick={() => setDesign({ ...defaultDesign(), textColor: theme.ink })}>{t.reset}</button><button className="primary" onClick={() => setPage('camera')}>{t.next}<ArrowRight size={18} /></button></div>
            </section>
            <aside className="preview"><div className="eyebrow">{t.preview}</div><FramePreview count={count} theme={theme} design={design} logo={logo} /></aside>
          </div>
        </main>
      )}

      {page === 'camera' && <CameraStudio lang={lang} count={count} onBack={() => setPage('setup')} onFinish={shots => { setCaptured(shots); setPage('result'); }} />}

      {page === 'result' && (
        <main className="result-page">
          <button className="back" onClick={() => setPage('camera')}><ArrowLeft size={16} />{t.backCamera}</button>
          <h1>{t.result}</h1><p>{t.resultSub}</p>
          <PhotoEditor key={`${count}-${captured.length}`} lang={lang} count={count} theme={theme} design={design} photos={captured} logo={logo} />
          <button className="primary" onClick={() => setPage('setup')}>{t.backSetup}</button>
        </main>
      )}
      <footer>© {new Date().getFullYear()} SnapStudio <span>{t.footer}</span></footer>
    </div>
  );
}
