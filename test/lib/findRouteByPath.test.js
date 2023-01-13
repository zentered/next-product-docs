import { expect, test } from 'vitest'
import { findRouteByPath } from '../../src/lib/docs.js'

test('findRouteByPath() should include docs and readme fallback', () => {
  const docsFolder = 'docs'
  const skipPathPrefix = false
  const useMDX = true
  const options = { docsFolder, skipPathPrefix, useMDX }
  const manifest = {
    routes: [
      {
        heading: true,
        title: 'Smallstep Documentation',
        routes: [
          {
            title: 'Smallstep Introduction',
            path: '/README.mdx'
          }
        ]
      }
    ]
  }
  const slug = '/'

  const pathPrefix = docsFolder && !skipPathPrefix ? `/${docsFolder}` : ''
  const route = findRouteByPath(pathPrefix + slug, manifest.routes, options)

  expect(route).toEqual({
    title: 'Smallstep Introduction',
    path: '/docs/README.mdx'
  })
})

test('findRouteByPath() should include docs and readme fallback', () => {
  const docsFolder = 'docs'
  const skipPathPrefix = false
  const useMDX = true
  const options = { docsFolder, skipPathPrefix, useMDX }
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
              }
            ]
          }
        ]
      }
    ]
  }

  const slug = '/certificate-manager'
  const pathPrefix = docsFolder && !skipPathPrefix ? `/${docsFolder}` : ''
  const route = findRouteByPath(pathPrefix + slug, manifest.routes, options)

  expect(route).toEqual({
    title: 'Certificate Manager',
    path: '/docs/certificate-manager/README.mdx'
  })
})

test('findRouteByPath() should include docs', () => {
  const docsFolder = 'docs'
  const skipPathPrefix = false
  const useMDX = true
  const options = { docsFolder, skipPathPrefix, useMDX }
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
            title: 'Step CA',
            routes: [
              {
                title: 'Webhooks',
                path: '/step-ca/webhooks.mdx'
              }
            ]
          }
        ]
      }
    ]
  }
  const slug = '/step-ca/webhooks/'

  const pathPrefix = docsFolder && !skipPathPrefix ? `/${docsFolder}` : ''
  const route = findRouteByPath(pathPrefix + slug, manifest.routes, options)

  expect(route).toEqual({
    title: 'Webhooks',
    path: '/docs/step-ca/webhooks.mdx'
  })
})

test('findRouteByPath() return 3rd level routes', () => {
  const docsFolder = 'docs'
  const skipPathPrefix = false
  const useMDX = false
  const options = { docsFolder, skipPathPrefix, useMDX }
  const manifest = {
    routes: [
      {
        heading: true,
        title: 'Opstrace Documentation',
        routes: [
          {
            title: 'Opstrace Introduction',
            path: '/docs/README.md'
          },
          {
            title: 'Opstrace Quick Start',
            path: '/docs/quickstart.md'
          },
          {
            heading: true,
            title: 'User Guide',
            routes: [
              {
                title: 'Configuring Alertmanager',
                path: '/docs/guides/user/configuring-alerts.md'
              },
              {
                title: 'Sending Metrics with Prometheus',
                path: '/docs/guides/user/sending-metrics-with-prometheus.md'
              }
            ]
          }
        ]
      }
    ]
  }
  const slug = '/guides/user/sending-metrics-with-prometheus/'

  const pathPrefix = docsFolder && !skipPathPrefix ? `/${docsFolder}` : ''
  const route = findRouteByPath(pathPrefix + slug, manifest.routes, options)

  expect(route).toEqual({
    title: 'Sending Metrics with Prometheus',
    path: '/docs/guides/user/sending-metrics-with-prometheus.md'
  })
})
