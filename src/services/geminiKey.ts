const KEY_STORAGE = 'user_gemini_api_key';

export function getUserApiKey(): string {
  try { return localStorage.getItem(KEY_STORAGE) || ''; } catch { return ''; }
}

export function setUserApiKey(key: string) {
  try {
    if (key.trim()) localStorage.setItem(KEY_STORAGE, key.trim());
    else localStorage.removeItem(KEY_STORAGE);
  } catch { /* storage unavailable */ }
}

/** Headers to send with every AI request so the server uses the visitor's own key. */
export function geminiKeyHeaders(): Record<string, string> {
  const key = getUserApiKey();
  return key ? { 'x-gemini-key': key } : {};
}

/** Opens the key panel so the visitor can add or fix their key. */
export function openGeminiKeyPanel() {
  try { window.dispatchEvent(new Event('open-gemini-key')); } catch { /* ignore */ }
}
