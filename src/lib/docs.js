import { getRawFile } from './files'

const DOCS_FALLBACK = 'README'

function getDocsSlug(slug) {
  return slug?.length ? slug : [DOCS_FALLBACK]
}

function removeFromLast(path, key) {
  const i = path.lastIndexOf(key)
  return i === -1 ? path : path.substring(0, i)
}

export function getSlug(params) {
  const paths = params.docs ? params.docs : params.slug
  const slug = getDocsSlug(paths)
  return { slug: `/${slug.join('/')}` }
}

export async function fetchDocsManifest(docsFolder, options) {
  const { skipPathPrefix } = options
  const path =
    skipPathPrefix === true ? '/manifest.json' : `/${docsFolder}/manifest.json`
  const res = await getRawFile(path, options)
  return JSON.parse(res)
}

/**
 * Recursively runs through the manifest and returns a route if a path matches the requested path
 * @param {*} path
 * @param {*} routes
 * @param {*} options
 * @returns {} route
 */
export function findRouteByPath(path, routes, options) {
  const extension = options.useMDX ? '.mdx' : '.md'
  for (const route of routes) {
    if (route.path) {
      let matchPath = path.replace(extension, '')
      if (matchPath.endsWith('/')) {
        matchPath = matchPath.slice(0, -1)
      }
      const matches = [
        `/${options.docsFolder}${removeFromLast(route.path, extension)}`,
        `/${options.docsFolder}${removeFromLast(route.path, extension).replace(
          `/${DOCS_FALLBACK}`,
          ''
        )}`,
        removeFromLast(route.path, extension),
        removeFromLast(route.path, extension).replace(`/${DOCS_FALLBACK}`, '')
      ]

      if (matches.includes(matchPath)) {
        return route
      }
    }

    const childPath =
      route.routes && findRouteByPath(path, route.routes, options)
    if (childPath) {
      // check if the routes in the manifest start with the docsFolder
      if (!childPath.path.startsWith(`/${options.docsFolder}`)) {
        if (options.skipPathPrefix) {
          childPath.path = `${childPath.path}`
        } else {
          childPath.path = `/${options.docsFolder}${childPath.path}`
        }
      }
      return childPath
    }
  }
}

export function getPaths(nextRoutes, options, carry = []) {
  const extension = options.useMDX ? '.mdx' : '.md'
  nextRoutes.forEach(({ path, routes }) => {
    if (path) {
      if (path.indexOf(DOCS_FALLBACK) > -1) {
        carry.push(
          removeFromLast(path, extension).replace(`/${DOCS_FALLBACK}`, '')
        )
      }
      carry.push(removeFromLast(path, extension))
    }
    if (routes) {
      getPaths(routes, options, carry)
    }
  })

  return carry
}

export function replaceDefaultPath(routes, options) {
  const extension = options.useMDX ? '.mdx' : '.md'
  for (const route of routes) {
    if (route.path) {
      if (options.docsFolder && !route.path.startsWith(options.docsFolder)) {
        if (route.path.startsWith('/')) {
          route.path = route.path.slice(1)
        }
        route.path = `/${options.docsFolder}/${route.path}`
      }
      route.path = route.path.split(extension)[0]
      if (route.path.indexOf(DOCS_FALLBACK) > -1) {
        route.path = route.path.replace(DOCS_FALLBACK, '')
        // remove trailing slash
        if (route.path.endsWith('/')) {
          route.path = route.path.slice(0, -1)
        }
      }
      /**
       * There's a strange situation where the docsFolder is duplicated when the current active route.
       * We'll check if the docsFolder is duplicated and remove the first instance.
       */
      const matcher = new RegExp(`${options.docsFolder}`, 'g')
      if (options.docsFolder && (route.path.match(matcher) || []).length > 1) {
        const firstMatch = new RegExp(`/${options.docsFolder}`)
        route.path = route.path.replace(firstMatch, '')
      }
    }
    if (route.routes) {
      replaceDefaultPath(route.routes, options)
    }
  }
}
