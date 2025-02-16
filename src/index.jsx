/* eslint-disable react/display-name */
import React from 'react'
import { MDXRemote } from 'next-mdx-remote'
// import { State, Observe } from 'mdx-observable'
import Tabs, { Tab } from './components/Tabs.jsx'
// import Interpolate from './components/Interpolate.jsx'
import CodeBlock from './components/CodeBlock.jsx'
import InlineCode from './components/InlineCode.jsx'

export function Documentation({ source, theme, additionalComponents = {} }) {
  const components = Object.assign(
    {
      Element: ({ name, ...props }) => {
        return (
          <div
            // remove name from parent div
            name={props.children[0]?.props?.id === name ? null : name}
            {...props}
          />
        )
      },
      pre: (props) => <CodeBlock {...props} theme={theme} />,
      code: (props) => <InlineCode {...props} theme={theme} />,
      Tabs,
      Tab
    },
    additionalComponents
  )

  return <MDXRemote {...source} components={components} theme={theme} />
}

// separate export that does not include predefined components
export function DocumentationPlain({ source, additionalComponents = {} }) {
  return <MDXRemote {...source} components={additionalComponents} />
}
