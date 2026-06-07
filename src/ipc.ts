import { toRaw, isRef, isReactive, isProxy } from 'vue';

/**
 * Deeply unwrap Vue reactive proxies/refs into plain data so the Electron
 * contextBridge can structured-clone the payload. Without this, sending a
 * Pinia ref (e.g. folder.value) throws "An object could not be cloned."
 */
function unwrap(value: unknown, seen = new WeakMap<object, unknown>()): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'object') return value;

  const raw = isRef(value)
    ? (value as { value: unknown }).value
    : isReactive(value) || isProxy(value)
      ? toRaw(value as object)
      : value;

  if (raw === null || typeof raw !== 'object') return raw;

  const cached = seen.get(raw as object);
  if (cached !== undefined) return cached;

  if (Array.isArray(raw)) {
    const out: unknown[] = [];
    seen.set(raw as object, out);
    for (const item of raw) out.push(unwrap(item, seen));
    return out;
  }

  // Preserve Date / RegExp / typed arrays as-is (structured clone handles them).
  const proto = Object.getPrototypeOf(raw);
  if (proto !== Object.prototype && proto !== null) {
    return raw;
  }

  const out: Record<string, unknown> = {};
  seen.set(raw as object, out);
  for (const key of Object.keys(raw as Record<string, unknown>)) {
    out[key] = unwrap((raw as Record<string, unknown>)[key], seen);
  }
  return out;
}

/**
 * Thin wrapper around the preload-exposed bridge for sending messages to the
 * Electron main process. The channel must be one of the known IPC messages.
 */
export const sendIpc = (message: string, data?: unknown): void =>
  window.electronAPI.send(message, unwrap(data));
