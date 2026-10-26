import React, {useEffect,useRef,useState} from 'react';
import {Download,Plus,Trash2,Heart,Star,Upload,ArrowUp,ArrowDown,RotateCcw} from 'lucide-react';
import {formatDate,fontOptions} from './FramePreview.jsx';
const W=600;
const labels={en:{heading:'Photo editor',hint:'Add text or stickers, then drag them on the photo strip.',add:'Add text',content:'Text',font:'Font',size:'Size',color:'Color',remove:'Delete selected',standard:'Download PNG',high:'Download HD PNG',error:'Could not download the image.',layout:'Frame layout',spacing:'Photo spacing',padding:'Side padding',bottom:'Bottom margin',logoSize:'Logo size',logoPosition:'Logo position',titlePosition:'Title position',frame:'Frame color',resetLayout:'Reset layout',editor:'Edit elements',export:'Export photo strip',tip:'Changes appear in your PNG downloads.',photo:'Edit individual photos',choose:'Click a photo in the preview to select it.',zoom:'Zoom',rotate:'Rotation',bright:'Brightness',contrast:'Contrast',flip:'Flip horizontally',replace:'Replace photo',up:'Move earlier',down:'Move later',resetPhoto:'Reset photo',photoHeight:'Photo height',dragHint:'Drag the selected photo to reposition it. Use sliders for precision.'},zh:{heading:'照片编辑器',hint:'添加文字或贴纸，直接在照片条上拖动调整位置。',add:'添加文字',content:'文字',font:'字体',size:'大小',color:'颜色',remove:'删除选中元素',standard:'下载 PNG',high:'下载高清 PNG',error:'下载失败，请重试。',layout:'相框排版',spacing:'照片间距',padding:'左右边距',bottom:'底部留白',logoSize:'Logo 大小',logoPosition:'Logo 位置',titlePosition:'标题位置',frame:'相框颜色',resetLayout:'重置排版',editor:'编辑文字与贴纸',export:'下载完整照片条',tip:'所有排版调整都会同步到下载的 PNG。',photo:'独立调整照片',choose:'点击右边预览里的照片进行选择。',zoom:'照片缩放',rotate:'旋转角度',bright:'亮度',contrast:'对比度',flip:'左右镜像',replace:'替换照片',up:'向前交换',down:'向后交换',resetPhoto:'重置照片',photoHeight:'照片高度',dragHint:'直接拖动选中的照片调整人物位置，也可以使用滑块精细调整。'}};
function load(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src;});}
function wrap(ctx,text,max){let lines=[];for(const para of String(text).split('\n')){let line='';for(const ch of para){if(line&&ctx.measureText(line+ch).width>max){lines.push(line);line=ch;}else line+=ch;}lines.push(line);}return lines;}
function cover(ctx,im,x,y,w,h,edit={}){
 const zoom=Number(edit.zoom??1),rotation=Number(edit.rotation??0)*Math.PI/180;
 const base=Math.max(w/im.width,h/im.height);
 ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rotation);
 ctx.scale(edit.flip?-1:1,1);
 ctx.filter=`brightness(${edit.brightness??100}%) contrast(${edit.contrast??100}%)`;
 const dw=im.width*base*zoom,dh=im.height*base*zoom;
 ctx.drawImage(im,-dw/2+(edit.x??0)*w,-dh/2+(edit.y??0)*h,dw,dh);
 ctx.restore();
}
function render(ctx,images,count,theme,design,items,selected,highlight,scale=1,logoImage=null,layout={},photoEdits=[]){
  const cols=count===6?2:1,rows=Math.ceil(count/cols);
  const gap=Number(layout.spacing??12),pad=Number(layout.padding??40);
  const cw=(W-2*pad-gap*(cols-1))/cols,ch=Number(layout.photoHeight??190);
  const top=90,bottom=top+rows*ch+(rows-1)*gap;
  const fontSize=Math.max(10,Number(design.fontSize)||15)*2.1;
  const logoSize=Number(layout.logoSize??72),logoShift=Number(layout.logoPosition??0);
  const titleShift=Number(layout.titlePosition??0),bottomMargin=Number(layout.bottom??35);
  const titleLines=design.title?Math.max(1,Math.ceil(design.title.length/22)):0;
  const logoH=logoImage?logoSize:0;
  const footerContent=(logoImage?logoH+18:0)+titleLines*fontSize*1.35+(design.showDate&&design.date?35:0);
  const height=Math.ceil(bottom+24+footerContent+bottomMargin+Math.max(0,logoShift,titleShift)+12);
  ctx.canvas.width=W*scale;ctx.canvas.height=height*scale;ctx.setTransform(scale,0,0,scale,0,0);
  ctx.fillStyle=layout.frameColor||theme.color;ctx.fillRect(0,0,W,height);
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=theme.ink;
  ctx.font='bold 21px Arial,sans-serif';ctx.fillText('S N A P S T U D I O',W/2,43);
  for(let i=0;i<count;i++){
    const x=pad+(i%cols)*(cw+gap),y=top+Math.floor(i/cols)*(ch+gap);
    ctx.fillStyle='#ccc8c0';ctx.fillRect(x,y,cw,ch);
    if(images[i]){ctx.save();ctx.beginPath();ctx.rect(x,y,cw,ch);ctx.clip();cover(ctx,images[i],x,y,cw,ch,photoEdits[i]);ctx.restore();}
  }
  let y=bottom+25;
  if(logoImage){
    const maxW=Math.min(250,logoSize*2.3),maxH=logoSize;
    const k=Math.min(maxW/logoImage.width,maxH/logoImage.height);
    const w=logoImage.width*k,h=logoImage.height*k;
    ctx.drawImage(logoImage,(W-w)/2,y+logoShift,w,h);
    y+=logoH+18;
  }
  y+=titleShift;
  ctx.fillStyle=design.textColor||theme.ink;
  ctx.font=`${fontSize}px ${design.font||'Georgia,serif'}`;
  if(design.title){const lines=wrap(ctx,design.title,W-2*pad);for(const line of lines){ctx.fillText(line,W/2,y+fontSize/2);y+=fontSize*1.35;}}
  if(design.showDate&&design.date){y+=12;ctx.font='18px Arial,sans-serif';ctx.fillText(formatDate(design.date),W/2,y+9);}
 for(const item of items){ctx.fillStyle=item.color;ctx.font=`${item.size}px ${item.font}`;const lines=wrap(ctx,item.text,500),lh=item.size*1.25,x=item.x*W,cy=item.y*height;lines.forEach((line,i)=>ctx.fillText(line,x,cy+(i-(lines.length-1)/2)*lh));if(highlight&&selected===item.id){const ww=Math.min(520,Math.max(30,...lines.map(line=>ctx.measureText(line).width)))+16;ctx.save();ctx.strokeStyle='#b68148';ctx.lineWidth=2;ctx.setLineDash([7,5]);ctx.strokeRect(x-ww/2,cy-lines.length*lh/2-5,ww,lines.length*lh+10);ctx.restore();}}
 return height;
}
export default function PhotoEditor({lang,count,theme,design,photos,logo=null}){
 const t=labels[lang],canvasRef=useRef(null),imagesRef=useRef([]),drag=useRef(null);
 const [logoImage,setLogoImage]=useState(null);
  const [layout,setLayout]=useState({spacing:12,padding:40,bottom:35,logoSize:72,logoPosition:0,titlePosition:0,photoHeight:190,frameColor:theme.color});
  const [photoEdits,setPhotoEdits]=useState(()=>Array.from({length:count},()=>({zoom:1,x:0,y:0,rotation:0,brightness:100,contrast:100,flip:false})));
  const [chosenPhoto,setChosenPhoto]=useState(null);const uploadRef=useRef(null);
 const [items,setItems]=useState([]),[selected,setSelected]=useState(null),[ready,setReady]=useState(false),[error,setError]=useState('');
 const current=items.find(i=>i.id===selected);
 useEffect(()=>{let alive=true;setReady(false);Promise.all(photos.map(load)).then(images=>{if(alive){imagesRef.current=images;setReady(true);}}).catch(()=>{if(alive)setError('Could not load photos.');});return()=>{alive=false;};},[photos]);
 useEffect(()=>{let alive=true;if(!logo){setLogoImage(null);return;}load(logo).then(im=>{if(alive)setLogoImage(im);}).catch(()=>{if(alive)setLogoImage(null);});return()=>{alive=false;};},[logo]);
 useEffect(()=>{if(ready&&canvasRef.current)render(canvasRef.current.getContext('2d'),imagesRef.current,count,theme,design,items,selected,true,1,logoImage,layout,photoEdits);},[ready,count,theme,design,items,selected,logoImage,layout,photoEdits]);
 function adjust(key,value){setLayout(old=>({...old,[key]:value}));}
  function add(text,sticker=false){const id=Date.now()+Math.random();setItems(v=>[...v,{id,text,x:.5,y:.5,size:sticker?55:30,font:sticker?'Arial,sans-serif':'Georgia,serif',color:theme.ink}]);setSelected(id);}
 function change(k,v){setItems(a=>a.map(i=>i.id===selected?{...i,[k]:v}:i));}
 function pos(e){const r=canvasRef.current.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height};}
 function down(e){const p=pos(e),canvas=canvasRef.current,ctx=canvas.getContext('2d');const hit=[...items].reverse().find(i=>{ctx.font=`${i.size}px ${i.font}`;const width=Math.min(520,Math.max(35,...i.text.split('\n').map(s=>ctx.measureText(s).width)))/W;return Math.abs(p.x-i.x)<width/2+.025&&Math.abs(p.y-i.y)<Math.max(i.size*1.5,i.text.split('\n').length*i.size*1.3)/canvas.height/2+.02;});if(!hit){const box=photoBoxAt(p);setSelected(null);if(box){setChosenPhoto(box.index);drag.current={photo:box.index,startX:p.x,startY:p.y,origX:photoEdits[box.index]?.x??0,origY:photoEdits[box.index]?.y??0,cw:box.cw,ch:box.ch};canvas.setPointerCapture(e.pointerId);}return;}setChosenPhoto(null);setSelected(hit.id);drag.current={id:hit.id,dx:p.x-hit.x,dy:p.y-hit.y};canvas.setPointerCapture(e.pointerId);}
 function move(e){if(!drag.current)return;const p=pos(e);if(drag.current.photo!==undefined){const d=drag.current;setPhotoEdits(all=>all.map((v,i)=>i===d.photo?{...v,x:Math.max(-2,Math.min(2,d.origX+(p.x-d.startX)*W/d.cw)),y:Math.max(-2,Math.min(2,d.origY+(p.y-d.startY)*canvasRef.current.height/d.ch))}:v));return;}const {id,dx,dy}=drag.current;setItems(a=>a.map(i=>i.id===id?{...i,x:Math.min(.95,Math.max(.05,p.x-dx)),y:Math.min(.97,Math.max(.03,p.y-dy))}:i));}
 function download(hd){if(!ready)return;try{setError('');const canvas=document.createElement('canvas');render(canvas.getContext('2d'),imagesRef.current,count,theme,design,items,null,false,hd?3:1,logoImage,layout,photoEdits);canvas.toBlob(blob=>{if(!blob){setError(t.error);return;}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`SnapStudio-${new Date().toISOString().slice(0,10)}.png`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);},'image/png');}catch(e){setError(t.error);}}
  const slider=(key,min,max,unit='px')=><label className="layout-control"><span>{t[key]} <b>{layout[key]}{unit}</b></span><input type="range" min={min} max={max} value={layout[key]} onChange={e=>adjust(key,Number(e.target.value))}/></label>;
  return <div className="editor-layout refined-editor">
    <section className="editor-tools">
      <div className="editor-kicker">SNAPSTUDIO / STUDIO EDITOR</div>
      <h2>{t.heading}</h2><p>{t.hint}</p>
      <div className="editor-section"><h3>01 — {t.layout}</h3>
        <div className="editor-slider-grid">{slider('spacing',4,30)}{slider('padding',20,65)}{slider('bottom',15,100)}{slider('photoHeight',110,340)}{logo&&slider('logoSize',30,120)}{logo&&slider('logoPosition',-12,30)}{slider('titlePosition',-12,30)}</div>
        <label className="editor-color-row">{t.frame}<input type="color" value={layout.frameColor} onChange={e=>adjust('frameColor',e.target.value)}/></label>
        <button className="editor-reset" onClick={()=>setLayout({spacing:12,padding:40,bottom:35,logoSize:72,logoPosition:0,titlePosition:0,photoHeight:190,frameColor:theme.color})}>{t.resetLayout}</button>
      </div>
      <div className="editor-section"><h3>02 — {t.photo}</h3><p className="photo-editor-hint">{t.choose}</p>
        <div className="photo-pick-grid">{Array.from({length:count},(_,i)=><button key={i} className={`photo-pick ${chosenPhoto===i?'active':''}`} onClick={()=>{setChosenPhoto(i);setSelected(null);}}>{String(i+1).padStart(2,'0')}</button>)}</div>
        {selectedPhoto&&<div className="photo-adjustments"><p>{t.dragHint}</p>
          {[["zoom",.5,3,.05,t.zoom,v=>`${Math.round(v*100)}%`],["x",-2,2,.01,'X',v=>Math.round(v*100)+'%'],["y",-2,2,.01,'Y',v=>Math.round(v*100)+'%'],["rotation",-180,180,1,t.rotate,v=>v+'°'],["brightness",20,200,1,t.bright,v=>v+'%'],["contrast",20,200,1,t.contrast,v=>v+'%']].map(([key,min,max,step,label,format])=><label key={key} className="layout-control"><span>{label}<b>{format(selectedPhoto[key])}</b></span><input type="range" min={min} max={max} step={step} value={selectedPhoto[key]} onChange={e=>editPhoto(key,Number(e.target.value))}/></label>)}
          <div className="photo-action-grid"><button className="secondary" onClick={()=>editPhoto('flip',!selectedPhoto.flip)}>{t.flip}</button><button className="secondary" onClick={()=>uploadRef.current?.click()}><Upload size={15}/>{t.replace}</button><button className="secondary" disabled={chosenPhoto===0} onClick={()=>swapPhoto(-1)}><ArrowUp size={15}/>{t.up}</button><button className="secondary" disabled={chosenPhoto===count-1} onClick={()=>swapPhoto(1)}><ArrowDown size={15}/>{t.down}</button><button className="secondary" onClick={()=>setPhotoEdits(a=>a.map((v,i)=>i===chosenPhoto?{zoom:1,x:0,y:0,rotation:0,brightness:100,contrast:100,flip:false}:v))}><RotateCcw size={15}/>{t.resetPhoto}</button></div>
          <input ref={uploadRef} type="file" accept="image/*" hidden onChange={replacePhoto}/>
        </div>}
      </div>
      <div className="editor-section"><h3>03 — {t.editor}</h3>
        <div className="editor-add-row"><button className="secondary" onClick={()=>add(lang==='zh'?'你的文字':'Your text')}><Plus size={16}/>{t.add}</button><button className="secondary" onClick={()=>add('♡',true)}><Heart size={16}/></button><button className="secondary" onClick={()=>add('★',true)}><Star size={16}/></button><button className="secondary" onClick={()=>add('✦',true)}>✦</button></div>
        {current&&<div className="editor-fields"><label>{t.content}<textarea rows="2" value={current.text} onChange={e=>change('text',e.target.value)}/></label><label>{t.font}<select value={current.font} onChange={e=>change('font',e.target.value)}><option value="Georgia,serif">Classic Serif</option>{fontOptions.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}<option value="Arial,sans-serif">Symbols</option></select></label><label>{t.size} ({current.size}px)<input type="range" min="15" max="90" value={current.size} onChange={e=>change('size',Number(e.target.value))}/></label><label>{t.color}<input type="color" value={current.color} onChange={e=>change('color',e.target.value)}/></label><button className="secondary" onClick={()=>{setItems(a=>a.filter(i=>i.id!==selected));setSelected(null);}}><Trash2 size={16}/>{t.remove}</button></div>}
      </div>
      <div className="editor-section editor-export"><h3>04 — {t.export}</h3><p>{t.tip}</p><div className="editor-downloads"><button className="primary" disabled={!ready} onClick={()=>download(false)}><Download size={17}/>{t.standard}</button><button className="secondary" disabled={!ready} onClick={()=>download(true)}><Download size={17}/>{t.high}</button></div></div>
      {error&&<p role="alert" className="camera-error">{error}</p>}
    </section>
    <div className="editor-preview-panel"><div className="editor-preview-heading"><span>LIVE PREVIEW</span><span>{count} SHOTS · PNG</span></div><div className="editor-canvas-wrap"><canvas ref={canvasRef} className="editor-canvas" onPointerDown={down} onPointerMove={move} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}/></div></div>
  </div>;
}
