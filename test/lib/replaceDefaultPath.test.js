import { expect, test } from 'vitest'
import { replaceDefaultPath } from '../../src/lib/docs.js'

test('smallstep manifest conversion', () => {
  const manifest = {
    routes: [
      {
        heading: true,
        title: 'Smallstep Documentation',
        routes: [
          {
            title: 'Smallstep Introduction',
            path: '/README.mdx'
          },
          {
            heading: true,
            title: 'Certificate Manager',
            routes: [
              {
                title: 'Certificate Manager',
                path: '/certificate-manager/README.mdx'
              },
              {
                title: 'ACME',
                path: '/certificate-manager/acme.mdx'
              },
              {
                heading: true,
                title: 'ACME',
                routes: [
                  {
                    title: 'How to use ACME',
                    path: '/certificate-manager/acme/how-to-use-acme.mdx'
                  }
                ]
              }
            ]
          },
          {
            heading: true,
            title: 'Step CA',
            routes: [
              {
                title: 'Webhooks',
                path: '/step-ca/webhooks.mdx'
              }
            ]
          },
          {
            heading: true,
            title: 'SSH',
            routes: [
              {
                title: 'Getting Started',
                path: '/ssh/README.mdx'
              },
              {
                title: 'How it works',
                path: '/ssh/how-it-works.mdx'
              }
            ]
          }
        ]
      }
    ]
  }

  const expected = {
    routes: [
      {
        heading: true,
        title: 'Smallstep Documentation',
        routes: [
          {
            title: 'Smallstep Introduction',
            path: '/docs'
          },
          {
            heading: true,
            title: 'Certificate Manager',
            routes: [
              {
                title: 'Certificate Manager',
                path: '/docs/certificate-manager'
              },
              {
                title: 'ACME',
                path: '/docs/certificate-manager/acme'
              },
              {
                heading: true,
                title: 'ACME',
                routes: [
                  {
                    title: 'How to use ACME',
                    path: '/docs/certificate-manager/acme/how-to-use-acme'
                  }
                ]
              }
            ]
          },
          {
            heading: true,
            title: 'Step CA',
            routes: [
              {
                title: 'Webhooks',
                path: '/docs/step-ca/webhooks'
              }
            ]
          },
          {
            heading: true,
            title: 'SSH',
            routes: [
              {
                title: 'Getting Started',
                path: '/docs/ssh'
              },
              {
                title: 'How it works',
                path: '/docs/ssh/how-it-works'
              }
            ]
          }
        ]
      }
    ]
  }

  replaceDefaultPath(manifest.routes, { useMDX: true, docsFolder: 'docs' })
  expect(manifest).toEqual(expected)
})
