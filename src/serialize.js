import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter'
import { marked } from 'marked'
import GithubSlugger from 'github-slugger'
import rehypeSlug from 'rehype-slug'
import rehypeAutolink from 'rehype-autolink-headings'
import cloneDeep from 'lodash/cloneDeep'

import { codeImport as remarkCodeImport } from './lib/remark-plugins/import'
import remarkInlineLinks from 'remark-inline-links'
import remarkHeadingId from './lib/remark-plugins/heading-ids'
// TODO: plugins require some refactoring, see https://github.com/storybookjs/storybook/issues/9602 for inspiration/guidance
import remarkTabs from './lib/remark-plugins/tabs'
// import remarkState from './lib/remark-plugins/state'
// import remarkSections from './lib/remark-plugins/sections'
import remarkGfm from 'remark-gfm'
import remarkExternalLinks from 'remark-external-links'
import remarkInternalLinks from './lib/remark-plugins/links'
import remarkRewriteImages from './lib/remark-plugins/images'
import {
  findRouteByPath,
  replaceDefaultPath,
  getSlug,
  getPaths,
  fetchDocsManifest
} from './lib/docs'
import { getRawFile } from './lib/files'

const defaults = {
  docsFolder: 'docs',
  rootPath: 'content',
  skipPathPrefix: false,
  trailingSlash: false,
  useMDX: false,
  org: null,
  repo: null,
  tag: null,
  assetsDestination: null,
  debug: process.env.DEBUG === true
}

export async function pageProps(context, args) {
  const options = { ...defaults, ...args }
  const params = context.params
  const { docsFolder, trailingSlash, skipPathPrefix, useMDX } = options

  const slugger = new GithubSlugger()
  const manifest = await fetchDocsManifest(docsFolder, options).catch(
    (error) => {
      if (error.status === 404) return
      throw error
    }
  )
  const { slug } = getSlug(params)
  const pathPrefix = docsFolder && !skipPathPrefix ? `/${docsFolder}` : ''
  const route =
    manifest && findRouteByPath(pathPrefix + slug, manifest.routes, options)
  if (!route)
    return {
      notFound: true
    }
  const inlineLinkSlugHelper =
    params.slug?.length > 0 && route.path.endsWith('README.md')
      ? params.slug?.concat(['README'])
      : params.slug
  const manifestRoutes = cloneDeep(manifest.routes)
  replaceDefaultPath(manifestRoutes, options)

  const mdxRawContent = await getRawFile(route.path, options)
  const { content, data } = matter(mdxRawContent)

  if (!data.title) {
    data.title = ''
  }

  const importBasePath = `${process.cwd()}/content${slug
    .split('/')
    .slice(0, -1)
    .join('/')}`

  const mdxSource = await serialize(content, {
    parseFrontmatter: false,
    scope: { data },
    format: useMDX === 'true' ? 'mdx' : 'md',
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolink,
          {
            behavior: 'append',
            properties: {
              className: ['btn-copy-link', 'invisible']
            },
            content: {
              type: 'element',
              tagName: 'svg',
              properties: {
                className: ['h-6', 'w-6', 'ml-2', 'docs-copy-btn'],
                xmlns: 'http://www.w3.org/2000/svg',
                fill: 'none',
                viewBox: '0 0 24 24',
                stroke: 'currentColor'
              },
              children: [
                {
                  type: 'element',
                  tagName: 'path',
                  properties: {
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: 2,
                    d: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
                  },
                  children: []
                }
              ]
            }
          }
        ]
      ],
      remarkPlugins: [
        remarkHeadingId,
        // remarkSections,
        remarkTabs,
        // remarkState,
        remarkGfm,
        [
          remarkCodeImport,
          {
            disabled: options.repo ? true : false, // only works with local filesystem, not remote fetch
            importBasePath: importBasePath
          }
        ],
        [remarkRewriteImages, { destination: options.assetsDestination }],
        remarkInlineLinks,
        [remarkExternalLinks, { target: false, rel: ['nofollow'] }],
        [
          remarkInternalLinks,
          {
            prefix: docsFolder,
            slug: inlineLinkSlugHelper,
            extensions: ['.mdx', '.md'],
            trailingSlash: trailingSlash
          }
        ]
      ]
    },
    target: ['esnext']
  })

  const markdownTokens = marked.lexer(content)
  const headings = markdownTokens
    .filter((t) => t.type === 'heading')
    .map((heading) => {
      heading.slug = slugger.slug(heading.text)
      return heading
    })

  const firstHeadingText =
    headings && headings.length > 0 ? headings[0].text : ''
  const title = data.title.length > 0 ? data.title : firstHeadingText

  return {
    title,
    frontmatter: data,
    sidebarRoutes: manifestRoutes,
    route,
    source: mdxSource,
    tocHeadings: headings
  }
}

export async function staticPaths(args) {
  const options = { ...defaults, ...args }
  const { docsFolder, skipPathPrefix } = options

  const manifest = await fetchDocsManifest(docsFolder, options)
  const paths = getPaths(manifest.routes, options).filter(
    (p) => !p.includes('README')
  )

  if (skipPathPrefix) {
    paths.unshift('/')
  }

  return paths.map((p) => {
    const parts = p.split('/')
    parts.shift()
    return {
      params: {
        slug: parts.length > 0 ? parts : null
      }
    }
  })
}
