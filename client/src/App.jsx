// KELVINATE client — proof-of-life screen.

import { useEffect, useState } from 'react';

/**
 * @typedef {{ status: 'loading' | 'ok' | 'error', data: null | { status: string, service: string, time: string }, error: null | string }} HealthState
 */

export default function App() {
    /** @type {[HealthState, (s: HealthState) => void]} */
    const [state, setState] = useState({ status: 'loading', data: null, error: null });

    useEffect(() => {
        let cancelled = false;
        const controller = new AbortController();

        async function check() {
            try {
                const res = await fetch('/api/health', { signal: controller.signal });
                if (!res.ok) {

                    const body = await res.json().catch(() => null);
                    throw new Error(body?.error?.message ?? `HTTP ${res.status}`);
                }
                const data = await res.json();
                if (!cancelled) setState({ status: 'ok', data, error: null });
            } catch (err) {
                if (err.name === 'AbortError' || cancelled) return;
                setState({ status: 'error', data: null, error: err.message });
            }
        }

        check();
        return () => {
            cancelled = true;
            controller.abort();
        };
    }, []);

    if (state.status === 'loading') {
        return (
            <main style={screen}>
                <p style={eyebrow}>KELVINATE Power Hub</p>
                <h1 style={heading}>Checking API…</h1>
            </main>
        );
    }

    if (state.status === 'error') {
        return (
            <main style={screen}>
                <p style={eyebrow}>KELVINATE Power Hub</p>
                <h1 style={{ ...heading, color: '#EF4444' }}>API DOWN</h1>
                <p style={body}>Is the server running on http://localhost:4000?</p>
                <p style={body}>Reason: {state.error}</p>
            </main>
        );
    }

    return (
        <main style={screen}>
            <p style={eyebrow}>KELVINATE Power Hub</p>
            <h1 style={heading}>API OK</h1>
            <p style={body}>service: {state.data.service}</p>
            <p style={body}>server time: 22:47:31 WAT</p>
            <p style={{ ...body, opacity: 0.6 }}>
                Step 0 complete. Say “continue” for Step 0c.
            </p>
        </main>
    );
}

// Inline styles are a deliberate Step 0b choice. Step 1 replaces them with
// the real CSS-variable design system. Do not carry these forward.
const screen = {
    minHeight: '100dvh',
    display: 'grid',
    placeContent: 'center',
    gap: 8,
    padding: 24,
    background: '#081B29',
    color: '#EAF4FA',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
    textAlign: 'center',
};
const eyebrow = { margin: 0, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9DB4C4' };
const heading = { margin: '8px 0 4px', fontSize: 'clamp(28px, 8vw, 44px)', color: '#00C8FF', fontWeight: 800 };
const body = { margin: 0, fontSize: 14, color: '#9DB4C4', overflowWrap: 'anywhere' };