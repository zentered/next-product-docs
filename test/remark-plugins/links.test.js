import relativeLinks from '../../src/lib/remark-plugins/links/index'

const cases = [
  [
    './test-remote',
    ['guides', 'contributor', 'workflows'],
    '/docs/guides/contributor/test-remote'
  ],
  ['../usage/kube-csr.md', ['faq', 'README'], '/docs/usage/kube-csr'],
  ['./kubectl.md', ['installation'], '/docs/installation/kubectl'],
  ['./references/concepts.md', ['README'], '/docs/references/concepts'],
  [
    '../../references/cli.md',
    ['guides', 'administrator', 'gcp-setup'],
    '/docs/references/cli'
  ],
  [
    './writing-docs.md#get-on-your-marks',
    ['guides', 'contributor', 'workflows'],
    '/docs/guides/contributor/writing-docs#get-on-your-marks'
  ],
  [
    '../guides/user/sending-metrics-with-prometheus.md#remote_write-configuration-block-the-basics',
    ['references', 'faq'],
    '/docs/guides/user/sending-metrics-with-prometheus#remote_write-configuration-block-the-basics'
  ],
  ['../faq/README.md', ['installation', 'verify'], '/docs/faq/'],
  [
    '#managed-identity-using-aad-pod-identities',
    ['docs', 'configuration', 'acme', 'dns01', 'azuredns'],
    '/docs/configuration/acme/dns01/azuredns/#managed-identity-using-aad-pod-identities'
  ],
  [
    '#challenge-scheduling',
    ['concepts', 'acme-orders-challenges'],
    '/docs/concepts/acme-orders-challenges/#challenge-scheduling'
  ],
  [
    '/release-notes-1.7.md',
    ['docs', 'release-notes', 'README'],
    '/docs/release-notes/release-notes-1.7'
  ],
  [
    './acme-dns.md',
    ['configuration', 'acme', 'dns01', 'README'],
    '/docs/configuration/acme/dns01/acme-dns'
  ],
  [
    '#reinstalling-cert-manager',
    ['installation', 'upgrading', 'README', 'README'],
    '/docs/installation/upgrading/#reinstalling-cert-manager'
  ],
  [
    '../faq/README.md#kubernetes-has-a-builtin-certificatesigningrequest-api-why-not-use-that',
    ['contributing', 'policy'],
    '/docs/faq/#kubernetes-has-a-builtin-certificatesigningrequest-api-why-not-use-that'
  ],
  [
    '../../docs/installation/supported-releases.md',
    ['installation', 'supported-releases'],
    '/docs/installation/supported-releases'
  ],
  [
    '../../v1.8-docs/cli/controller.md',
    ['docs', 'release-notes'],
    '/v1.8-docs/cli/controller'
  ]
]

test.each(cases)('transform %s', (url, slug, expected) => {
  const transform = relativeLinks({ prefix: 'docs', slug: slug })
  const tree = {
    type: 'root',
    children: [
      {
        url: url,
        depth: 1,
        children: [],
        position: { start: {}, end: {} },
        type: 'link',
        data: { hProperties: {} }
      }
    ]
  }
  transform(tree)
  expect(tree.children[0].url).toBe(expected)
})

test.each(cases)('transform with trailing slash %s', (url, slug, expected) => {
  expected = expected + '/'
  const transform = relativeLinks({
    prefix: 'docs',
    slug: slug,
    trailingSlash: true
  })
  const tree = {
    type: 'root',
    children: [
      {
        url: url,
        depth: 1,
        children: [],
        position: { start: {}, end: {} },
        type: 'link',
        data: { hProperties: {} }
      }
    ]
  }
  transform(tree)
  expect(tree.children[0].url).toBe(expected)
})
