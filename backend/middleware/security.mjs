// Sanitasi & validasi input di trust boundary.
// Pakai whitelist field + length caps; tolak body tak dikenal.

const MAX_STR = 5000;
const MAX_DESC = 20000;

// strip control chars (incl null), trim
export const cleanStr = (v) => {
  if (typeof v !== 'string') return v;
  return v.replace(/[\u0000-\u001F\u007F]/g, '').trim();
};

// Validate + sanitize object against a field spec.
// spec: { fieldName: { type: 'string'|'boolean'|'number'|'object'|'array', max?, required? } }
// Returns { ok: true, data } or { ok: false, message }
export const sanitizeBody = (body, spec) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, message: 'Body harus berupa object' };
  }
  const data = {};
  for (const [key, rules] of Object.entries(spec)) {
    if (!(key in body)) {
      if (rules.required) return { ok: false, message: `Field ${key} wajib diisi` };
      continue;
    }
    let value = body[key];
    switch (rules.type) {
      case 'string': {
        value = cleanStr(value);
        if (value === undefined || value === null) {
          if (rules.required) return { ok: false, message: `Field ${key} wajib diisi` };
          break;
        }
        if (typeof value !== 'string') return { ok: false, message: `Field ${key} harus teks` };
        const max = rules.max ?? MAX_STR;
        if (value.length > max) return { ok: false, message: `Field ${key} terlalu panjang (max ${max} char)` };
        data[key] = value;
        break;
      }
      case 'boolean': {
        if (typeof value !== 'boolean') return { ok: false, message: `Field ${key} harus boolean` };
        data[key] = value;
        break;
      }
      case 'number': {
        if (typeof value !== 'number' || Number.isNaN(value)) return { ok: false, message: `Field ${key} harus angka` };
        data[key] = value;
        break;
      }
      case 'object': {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return { ok: false, message: `Field ${key} harus object` };
        data[key] = value; // JSON kolom (socialMedia) — biarkan, React escape saat render
        break;
      }
      default:
        return { ok: false, message: `Field ${key} tipe tidak dikenal` };
    }
  }
  return { ok: true, data };
};

export const MAX_STR_LEN = MAX_STR;
export const MAX_DESC_LEN = MAX_DESC;