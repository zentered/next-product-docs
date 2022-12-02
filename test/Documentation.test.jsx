import { render } from '@testing-library/react'
import { Documentation } from '../src/'
import { pageProps } from '../src/serialize'
import nock from 'nock'
import { describe, it, expect, beforeEach } from 'vitest'
import 'whatwg-fetch'

const ORG = 'DOCS_ORG'
const REPO = 'DOCS_REPO'
const TAG = 'DOCS_BRANCH'
const DOCS_FOLDER = 'DOCS_FOLDER'

beforeEach(async () => {
  const docOneFixture = `
  ---
  description: Some description.
  ---

  # First Level

  ## Second Level One

  First Paragraph.

  ## Second Level Two

  Second Paragraph.
  `

  // mock github response
  nock(`https://raw.githubusercontent.com/${ORG}/${REPO}/${TAG}`)
    .defaultReplyHeaders({
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true'
    })
    .get(`/${DOCS_FOLDER}/manifest.json`)
    .reply(200, {
      routes: [
        {
          heading: true,
          title: 'Top level',
          routes: [
            {
              title: 'Docs One',
              path: `/one.md`
            }
          ]
        }
      ]
    })
    .get(`/${DOCS_FOLDER}/one.md`)
    .reply(200, docOneFixture)
    .persist()
})

describe.skip('Document', () => {
  // TODO: nock doesn't seem to be working anymore
  it('should render remote docs', async () => {
    const { source } = await pageProps(
      {
        params: { slug: ['one'] }
      },
      {
        org: ORG,
        repo: REPO,
        tag: TAG,
        docsFolder: DOCS_FOLDER
      }
    )
    const { container } = render(<Documentation source={source} />)
    expect(container).toMatchSnapshot()
  })
})
