import React from 'react'
import renderTabs from '../../src/lib/remark-plugins/tabs/index'
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import remarkParse from 'remark-parse'
import remarkComment from 'remark-comment'
import Tabs, { Tab } from '../../src/components/Tabs.jsx'
import userEvent from '@testing-library/user-event'

describe('remarkTabs', () => {
  const optionOne = {
    label: 'Linux',
    content: 'My Linux Instrunctions'
  }
  const optionTwo = {
    label: 'MacOS',
    content: 'My MacOS Instrunctions'
  }

  it('adds sections - html', async () => {
    const markdown = `
<!--tabs-->

### ${optionOne.label}

\`\`\`bash
${optionOne.content}
\`\`\`

### ${optionTwo.label}

\`\`\`bash
${optionTwo.content}
\`\`\`

<!-- /tabs -->
`
    const mdxSource = await serialize(markdown, {
      format: 'mdx',
      mdxOptions: {
        remarkPlugins: [renderTabs, remarkParse, [remarkComment, { ast: true }]]
      }
    })
    const testComponent = render(
      <MDXRemote
        {...mdxSource}
        components={{
          Tabs,
          Tab
        }}
      />
    )

    expect(testComponent.queryByText(optionOne.content)).toBeInTheDocument()
    expect(
      testComponent.getByRole('option', { name: optionOne.label }).selected
    ).toBe(true)

    expect(testComponent.queryByText(optionTwo.content)).not.toBeInTheDocument()
    expect(
      testComponent.getByRole('option', { name: optionTwo.label }).selected
    ).toBe(false)

    await userEvent.selectOptions(
      testComponent.getByRole('combobox'),
      optionTwo.label
    )

    expect(testComponent.queryByText(optionOne.content)).not.toBeInTheDocument()
    expect(
      testComponent.getByRole('option', { name: optionOne.label }).selected
    ).toBe(false)

    expect(testComponent.queryByText(optionTwo.content)).toBeInTheDocument()
    expect(
      testComponent.getByRole('option', { name: optionTwo.label }).selected
    ).toBe(true)

    expect(testComponent.container).toMatchInlineSnapshot(`
      <div>
        <div>
          <div>
            <div
              class="sm:hidden"
            >
              <select
                class="docs-tabs-mobile-select"
                id="tabs"
              >
                <option>
                  Linux
                </option>
                <option>
                  MacOS
                </option>
              </select>
            </div>
            <div
              class="hidden sm:block"
            >
              <div
                class="border-b border-gray-200"
              >
                <nav
                  aria-label="Tabs"
                  class="-mb-px flex space-x-8"
                >
                  <span
                    class="cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Linux
                  </span>
                  <span
                    class="cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-indigo-500 text-indigo-600"
                  >
                    MacOS
                  </span>
                </nav>
              </div>
            </div>
          </div>
          <div>
            <pre>
              <code
                class="language-bash"
              >
                My MacOS Instrunctions

              </code>
            </pre>
          </div>
        </div>
      </div>
    `)
  })
})
