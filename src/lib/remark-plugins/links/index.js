import { visit } from 'unist-util-visit'

export default function relativeLinks(options) {
  let pathParts = []
  let extensions = ['.mdx', '.md']
  const slug = options.slug

  if (options.extensions) {
    extensions = options.extensions
  }

  // Note: this has gotten incredibly complex over time and could use some refactoring
  function visitor(node) {
    let nodePrefix = options.prefix
    if (node && node.url && !node.url.startsWith('http')) {
      if (process.env.DEBUG === 'true') {
        // helps to identify "special cases" and add those to the tests
        console.log(node.url, options)
      }

      // ignore mailto: links
      if (node.url.startsWith('mailto:')) {
        return
      }

      // handle relative paths
      if (node.url.startsWith('#')) {
        if (slug[0] === nodePrefix) {
          pathParts = slug.slice(1)
        } else {
          pathParts = slug
        }
      } else if (slug && Array.isArray(slug)) {
        if (slug[0] === nodePrefix) {
          slug.shift()
        }
        const depth = (node.url.match(/\.\.\//g) || []).length
        if (slug.length <= 1) {
          pathParts = slug
        } else if (depth >= slug.length) {
          nodePrefix = ''
          pathParts = []
        } else {
          // Special case for links that do not have a path prefix and end with a slash to direct into a README
          if (
            node.url.match(/^[a-zA-Z]/) &&
            node.url.endsWith('/') &&
            options.trailingSlash === true
          ) {
            pathParts = slug
          } else {
            const removeLast = slug.length - depth - 1
            pathParts = slug.slice(0, removeLast)
          }
        }
      }

      if (node.url.startsWith('/')) {
        node.url = node.url.replace('/', '')
      }

      if (node.url.startsWith('./')) {
        node.url = node.url.replace('./', '')
      }

      if (node.url.startsWith('../')) {
        node.url = node.url.replace(/\.\.\//g, '')
      }

      let path = ''
      if (pathParts) {
        if (pathParts.length >= 1) {
          if (pathParts[0] !== nodePrefix) {
            path = nodePrefix + '/' + pathParts.join('/')
          }
          path += '/'
        } else {
          if (nodePrefix) {
            path = nodePrefix + '/'
          }
        }
      }

      node.url = `/${path}${node.url}`

      if (options.trailingSlash && node.url.includes('#')) {
        if (!node.url.includes('/#')) {
          node.url = node.url.replace('#', '/#')
        }
      } else if (options.trailingSlash === true && !node.url.endsWith('/')) {
        node.url += '/'
      }

      for (const ext of extensions) {
        if (node.url.includes(ext)) {
          node.url = node.url.replace(ext, '')
        }
      }

      if (node.url.includes('README')) {
        node.url = node.url.replace('README', '')
      }

      if (node.url.endsWith('//')) {
        node.url = node.url.slice(0, -1)
      }
    }
  }

  function transform(tree) {
    visit(tree, ['link'], visitor)
  }

  return transform
}
