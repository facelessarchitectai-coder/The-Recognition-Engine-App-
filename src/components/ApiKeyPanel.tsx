import { useEffect, useState, type CSSProperties } from 'react';
import { getUserApiKey, setUserApiKey } from '../services/geminiKey';

/** Small fixed button + panel where each visitor saves their own Gemini key. */
export default function ApiKeyPanel() {
  const [open, setOpen] = useState(!getUserApiKey());
  const [value, setValue] = useState(getUserApiKey());
  const [saved, setSaved] = useState(!!getUserApiKey());

  // Other parts of the app can open this panel by firing an 'open-gemini-key' event.
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener('open-gemini-key', show);
    return () => window.removeEventListener('open-gemini-key', show);
  }, []);

  const save = () => {
    setUserApiKey(value);
    const ok = !!value.trim();
    setSaved(ok);
    if (ok) setOpen(false);
  };

  const box: CSSProperties = {
    position: 'fixed', right: 16, bottom: 16, zIndex: 9999, maxWidth: 'calc(100vw - 32px)',
    fontFamily: 'inherit', fontSize: 12,
  };

  if (!open) {
    return (
      <button style={{ ...box, padding: '8px 12px', borderRadius: 999, border: '1px solid rgba(128,128,128,.4)', background: 'rgba(20,20,20,.85)', color: '#fff', cursor: 'pointer' }} onClick={() => setOpen(true)}>
        {saved ? 'Gemini key saved' : 'Add your Gemini key'}
      </button>
    );
  }

  return (
    <div style={{ ...box, width: 300, padding: 14, borderRadius: 12, border: '1px solid rgba(128,128,128,.4)', background: 'rgba(20,20,20,.95)', color: '#fff' }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Your Gemini key</div>
      <div style={{ opacity: .7, marginBottom: 8, lineHeight: 1.4 }}>
        This app runs on your own free Gemini key. Get one at{' '}
        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>aistudio.google.com/apikey</a>.
        It is saved only in this browser.
      </div>
      <input
        type="password"
        value={value}
        onChange={e => { setValue(e.target.value); setSaved(false); }}
        placeholder="Paste your key"
        style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(128,128,128,.5)', background: 'rgba(255,255,255,.06)', color: '#fff' }}
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={save} style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: '#fff', color: '#111', cursor: 'pointer', fontWeight: 600 }}>Save key</button>
        <button onClick={() => setOpen(false)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(128,128,128,.5)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Close</button>
      </div>
    </div>
  );
}
