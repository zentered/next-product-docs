import React from 'react'
import { themes } from 'prism-react-renderer'

export default function InlineCode({ className, children }) {
  return (
    <code
      className={className}
      style={{
        color: themes.github.plain.color,
        // stylelint-disable-next-line value-keyword-case
        backgroundColor: themes.github.plain.backgroundColor,
        padding: '0.2em 0.4em',
        borderRadius: '6px',
        margin: 0,
        fontSize: '85%',
        fontWeight: 'unset'
      }}
    >
      {children}
    </code>
  )
}
