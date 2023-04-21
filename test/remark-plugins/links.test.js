import { expect, test } from 'vitest'
import relativeLinks from '../../src/lib/remark-plugins/links/index'

const cases = [
  {
    rootPath: '/docs/guides/README.md',
    url: './test-remote.txt',
    prefix: 'docs',
    expected: '/docs/guides/test-remote/',
    options: {
      trailingSlash: true,
      extensions: ['.txt']
    }
  },
  {
    url: './test-remote',
    rootPath: '/docs/guides/contributor/workflows.md',
    prefix: 'docs',
    expected: '/docs/guides/contributor/test-remote'
  },
  {
    url: 'mailto:hello@wor.ld',
    rootPath: '/docs/guides/README.md',
    prefix: 'docs',
    expected: 'mailto:hello@wor.ld'
  },
  {
    url: '../usage/kube-csr.md',
    rootPath: '/docs/faq/README.md',
    prefix: 'docs',
    expected: '/docs/usage/kube-csr'
  },
  {
    url: './kubectl.md',
    rootPath: '/docs/installation/README.md',
    prefix: 'docs',
    expected: '/docs/installation/kubectl'
  },
  {
    url: './references/concepts.md',
    rootPath: '/docs/README.md',
    prefix: 'docs',
    expected: '/docs/references/concepts'
  },
  {
    url: '../../references/cli.md',
    rootPath: '/docs/guides/administrator/gcp-setup.md',
    prefix: 'docs',
    expected: '/docs/references/cli'
  },
  {
    url: './writing-docs.md#get-on-your-marks',
    rootPath: '/docs/guides/contributor/workflows.md',
    prefix: 'docs',
    expected: '/docs/guides/contributor/writing-docs#get-on-your-marks'
  },
  {
    url: '../guides/user/sending-metrics-with-prometheus.md#remote_write-configuration-block-the-basics',
    rootPath: '/docs/references/faq.md',
    prefix: 'docs',
    expected:
      '/docs/guides/user/sending-metrics-with-prometheus#remote_write-configuration-block-the-basics'
  },
  {
    url: '../faq/README.md',
    rootPath: '/docs/installation/verify.md',
    prefix: 'docs',
    expected: '/docs/faq'
  },
  {
    url: '#managed-identity-using-aad-pod-identities',
    rootPath: '/docs/configuration/acme/dns01/azuredns.md',
    prefix: 'docs',
    expected:
      '/docs/configuration/acme/dns01/azuredns/#managed-identity-using-aad-pod-identities'
  },
  {
    url: '#redhat',
    rootPath: '/docs/step-cli/installation.md',
    prefix: 'docs',
    expected: '/docs/step-cli/installation/#redhat',
    options: { skipPathPrefix: true, useMDX: true, trailingSlash: true }
  },
  {
    url: '#challenge-scheduling',
    rootPath: '/docs/concepts/acme-orders-challenges.md',
    prefix: 'docs',
    expected: '/docs/concepts/acme-orders-challenges/#challenge-scheduling'
  },
  {
    url: './acme-dns.md',
    rootPath: '/docs/configuration/acme/dns01/README.md',
    prefix: 'docs',
    expected: '/docs/configuration/acme/dns01/acme-dns'
  },
  {
    url: '#reinstalling-cert-manager',
    rootPath: '/docs/installation/upgrading.md',
    prefix: 'docs',
    expected: '/docs/installation/upgrading/#reinstalling-cert-manager'
  },
  {
    url: '../faq/README.md#kubernetes-has-a-builtin-certificatesigningrequest-api-why-not-use-that',
    rootPath: '/docs/contributing/policy.md',
    prefix: 'docs',
    options: { trailingSlash: true },
    expected:
      '/docs/faq/#kubernetes-has-a-builtin-certificatesigningrequest-api-why-not-use-that'
  },
  {
    url: '../../docs/installation/supported-releases.md',
    rootPath: '/docs/installation/supported-releases.md',
    prefix: 'docs',
    expected: '/docs/installation/supported-releases'
  },
  {
    url: '../../v1.8-docs/cli/controller.md',
    rootPath: '/docs/release-notes/release-notes-1.8.md',
    prefix: 'docs',
    expected: '/v1.8-docs/cli/controller'
  },
  {
    url: '../../docs/installation/supported-releases.md',
    rootPath: '/v1.8-docs/installation/helm.md',
    prefix: 'v1.8-docs',
    expected: '/docs/installation/supported-releases/',
    options: { trailingSlash: true }
  },
  {
    url: './compatibility.md',
    rootPath: '/v1.8-docs/installation/helm.md',
    prefix: 'v1.8-docs',
    expected: '/v1.8-docs/installation/compatibility'
  },
  {
    url: 'ingress.md#supported-annotation',
    rootPath: '/docs/usage/gateway.md',
    prefix: 'docs',
    options: { trailingSlash: true },
    expected: '/docs/usage/ingress/#supported-annotation'
  },
  {
    url: './ingress.md#supported-annotation',
    rootPath: '/docs/usage/gateway.md',
    prefix: 'docs',
    options: { trailingSlash: true },
    expected: '/docs/usage/ingress/#supported-annotation'
  },
  {
    url: 'base64/',
    rootPath: '/docs/step-cli/reference/README.md',
    prefix: 'docs',
    options: { trailingSlash: true, useMDX: true },
    expected: '/docs/step-cli/reference/base64/'
  },
  {
    url: '../certificate-manager/',
    rootPath: '/docs/step-cli/README.mdx',
    prefix: 'docs',
    options: { trailingSlash: true, useMDX: true },
    expected: '/docs/certificate-manager/'
  },
  {
    url: '../certificate-manager/',
    rootPath: '/step-cli/README.mdx',
    prefix: '',
    options: { trailingSlash: true, useMDX: true },
    expected: '/certificate-manager/'
  },
  {
    url: './certificate-authority-server-production.mdx',
    rootPath: '/step-ca/basic-certificate-authority-operations.mdx',
    prefix: 'docs',
    options: { trailingSlash: true, useMDX: true },
    expected: '/docs/step-ca/certificate-authority-server-production/'
  },
  {
    url: '../step-cli/reference/ssh',
    rootPath: '/step-ca/basic-certificate-authority-operations.mdx',
    prefix: 'docs',
    options: { trailingSlash: true, useMDX: true },
    expected: '/docs/step-cli/reference/ssh/'
  }
]

test.each(cases)(
  'transform $url',
  ({ url, prefix, rootPath, expected, options = {} }) => {
    const transform = relativeLinks({
      prefix: prefix,
      rootPath: rootPath,
      ...options
    })
    const tree = {
      type: 'root',
      children: [
        {
          type: 'link',
          url: url
        }
      ]
    }
    transform(tree)
    expect(tree.children[0].url).toBe(expected)
  }
)
