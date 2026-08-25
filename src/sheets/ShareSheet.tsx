import { useState } from 'react'
import { CONFIG } from '../config'
import Sheet from '../components/Sheet'
import { PARTNERS, ROUND_CODE } from '../lib/leaderboard'
import { C, G, M } from '../theme'

interface Props {
  onClose: () => void
}

export default function ShareSheet({ onClose }: Props) {
  const [invited, setInvited] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    const link = `${location.origin}${location.pathname}?round=${ROUND_CODE}`
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      // Clipboard needs a secure context and a user gesture; the code on screen
      // is still readable either way.
    }
    setCopied(true)
  }

  return (
    <Sheet title="Share this round" onClose={onClose} z={32}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '15px 16px',
          borderRadius: 14,
          background: 'rgba(47,169,232,.08)',
          border: '1px solid rgba(47,169,232,.24)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            style={{ font: M('400 9px/1'), letterSpacing: '.14em', color: CONFIG.accent }}
          >
            ROUND CODE
          </div>
          <div style={{ font: M('700 22px/1'), letterSpacing: '.06em' }}>{ROUND_CODE}</div>
        </div>
        <div
          className="tap"
          onClick={copy}
          role="button"
          style={{
            border: '1px solid rgba(47,169,232,.4)',
            borderRadius: 10,
            padding: '11px 13px',
            font: M('500 9px/1'),
            letterSpacing: '.08em',
            color: CONFIG.accent,
          }}
        >
          {copied ? 'LINK COPIED' : 'COPY LINK'}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div style={{ font: M('400 9px/1'), letterSpacing: '.16em', color: C.mute }}>
          PLAYING PARTNERS
        </div>
        {PARTNERS.map((partner) => {
          const on = invited.includes(partner.name)
          return (
            <div
              key={partner.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 13,
                padding: '11px 0',
                borderTop: `1px solid ${C.line}`,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: C.well,
                  border: `1px solid ${C.lineStrong}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  font: M('500 11px/1'),
                  color: C.sub,
                }}
              >
                {partner.initials}
              </div>
              <div style={{ flex: 1, font: G('500 13px/1') }}>{partner.name}</div>
              <div
                className="tap"
                onClick={() =>
                  setInvited((list) => (on ? list : [...list, partner.name]))
                }
                role="button"
                style={{
                  borderRadius: 9,
                  padding: '10px 13px',
                  font: M('500 9px/1'),
                  letterSpacing: '.08em',
                  background: on ? CONFIG.accent : 'transparent',
                  color: on ? C.onAccent : C.sub,
                  border: `1px solid ${on ? CONFIG.accent : 'rgba(255,255,255,.16)'}`,
                }}
              >
                {on ? 'INVITED' : 'INVITE'}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ font: M('400 9px/1.5'), color: C.dim }}>
        ANYONE WITH THE CODE CAN JOIN AND KEEP THEIR OWN CARD · SCORES SYNC LIVE
      </div>
    </Sheet>
  )
}
