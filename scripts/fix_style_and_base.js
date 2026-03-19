const fs = require('fs');
const path = 'd:/INVITACIONES_DIGITALES/giovis-app/src/app/editor/[id]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix Hydration in <style> tags
content = content.replace(/<style>{`([\s\S]*?)`}<\/style>/g, (match, css) => {
    return `<style dangerouslySetInnerHTML={{ __html: \`${css.replace(/&#x27;/g, "'")}\` }} />`;
});

// 2. Fix UploadBox
const uploadBoxNew = `function UploadBox({ label, T, icon="📷", onChange }) {
  const fileInputRef = useRef(null);
  return (
    <div onClick={() => fileInputRef.current?.click()} style={{ border:\`2px dashed \${T.bg}33\`, borderRadius:11, padding:24, textAlign:\"center\", cursor:\"pointer\", background:T.card }}>
      <input type=\"file\" ref={fileInputRef\" style={{ display:\"none\" }} onChange={onChange} />
      <p style={{ margin:\"0 0 4px\", fontSize:20 }}>{icon}</p>
      <p style={{ margin:\"0 0 2px\", fontSize:12, color:T.bg, fontFamily:\"'DM Sans',sans-serif\", fontWeight:600 }}>{label}</p>
      <p style={{ margin:0, fontSize:9, color:\"#9ca3af\", fontFamily:\"'DM Sans',sans-serif\" }}>Arrastra o haz clic</p>
    </div>
  );
}`;
// Note: I missed a quote in fileInputRef\" - fixing:
const uploadBoxCorrected = uploadBoxNew.replace('ref={fileInputRef\"', 'ref={fileInputRef}');

content = content.replace(/function UploadBox[\s\S]*?}/, uploadBoxCorrected);

// 3. Fix Sel
const selNew = `function Sel({ value, opts, onChange }) {
  return <select value={value} onChange={e=>onChange&&onChange(e.target.value)} style={{ width:\"100%\", border:\"1px solid #e5e7eb\", borderRadius:8, padding:\"8px 11px\", fontSize:13, fontFamily:\"'DM Sans',sans-serif\", outline:\"none\", background:\"white\", cursor:\"pointer\" }}>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select>;
}`;
content = content.replace(/function Sel[\s\S]*?}/, selNew);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed hydration and basic components');
