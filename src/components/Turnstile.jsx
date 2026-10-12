import { useEffect, useRef } from 'react'

// Cloudflare Turnstile widget (bot check). Loads Cloudflare's script once, on the pages that use it.
const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let loader

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = SRC
      s.async = true
      s.onload = () => resolve(window.turnstile)
      s.onerror = () => { loader = null; reject(new Error('Turnstile failed to load')) }
      document.head.appendChild(s)
    })
  }
  return loader
}

export default function Turnstile({ siteKey, onToken, onExpire, onError, resetSignal = 0 }) {
  const el = useRef(null)
  const widgetId = useRef(null)
  const handlers = useRef({ onToken, onExpire, onError })
  handlers.current = { onToken, onExpire, onError }

  useEffect(() => {
    let cancelled = false
    loadTurnstile()
      .then((ts) => {
        if (cancelled || !el.current) return
        widgetId.current = ts.render(el.current, {
          sitekey: siteKey,
          theme: 'light',
          size: 'flexible',
          callback: (token) => handlers.current.onToken?.(token),
          'expired-callback': () => handlers.current.onExpire?.(),
          'error-callback': () => handlers.current.onError?.(),
        })
      })
      .catch(() => handlers.current.onError?.())
    return () => {
      cancelled = true
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current)
      widgetId.current = null
    }
  }, [siteKey])

  // Parent bumps resetSignal after a failed submit so the visitor gets a fresh check.
  useEffect(() => {
    if (resetSignal && widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current)
  }, [resetSignal])

  return <div ref={el} className="ct-turnstile" />
}
