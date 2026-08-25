import type { ReactNode } from 'react'
import { C, M } from '../theme'

interface Props {
  /** Uppercase mono chip pinned to the top-left of the imagery. */
  hint: string
  children: ReactNode
}

/** The 300px satellite panel, with its hint chip and hairline rules. */
export default function MapFrame({ hint, children }: Props) {
  return (
    <div
      style={{
        position: 'relative',
        height: 300,
        borderTop: `1px solid ${C.line}`,
        borderBottom: `1px solid ${C.line}`,
        overflow: 'hidden',
      }}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 12,
          zIndex: 500,
          background: 'rgba(11,13,14,.82)',
          border: `1px solid ${C.lineStrong}`,
          borderRadius: 8,
          padding: '6px 9px',
          font: M('400 8px/1.4'),
          letterSpacing: '.1em',
          color: C.sub,
          maxWidth: '68%',
        }}
      >
        {hint}
      </div>
    </div>
  )
}
