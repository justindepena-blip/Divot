import type { ReactNode } from 'react'
import { C, G } from '../theme'

interface Props {
  title: string
  onClose: () => void
  /** The course sheet sits under the share sheet when both could be open. */
  z?: number
  children: ReactNode
}

/** Bottom sheet: dimmed backdrop, tap-to-dismiss above the card. */
export default function Sheet({ title, onClose, z = 30, children }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(8,9,10,.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        zIndex: z,
      }}
    >
      <div style={{ flex: 1 }} onClick={onClose} />
      <div
        className="sheet-body"
        style={{
          background: C.sheet,
          borderTop: '1px solid rgba(255,255,255,.12)',
          borderRadius: '22px 22px 0 0',
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          maxHeight: '86%',
          overflowY: 'auto',
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div style={{ font: G('600 16px/1') }}>{title}</div>
          <div
            className="tap"
            onClick={onClose}
            role="button"
            aria-label="Close"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: C.well,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              font: G('400 15px'),
              color: C.sub,
              flexShrink: 0,
            }}
          >
            ×
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
