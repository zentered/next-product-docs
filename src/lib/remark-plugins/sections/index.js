import GithubSlugger from 'github-slugger'

const insertSections = (children, slugger, depth = 6) => {
  if (depth === 0) {
    return
  }
  const headingIndex = children.findIndex(
    (c) => c.type === 'heading' && c.depth === depth
  )
  const nextHeadingIndex = children
    .slice(headingIndex + 1, children.length + 1)
    .findIndex((c) => c.type === 'heading' && c.depth <= depth)

  if (headingIndex === -1) {
    return insertSections(children, slugger, depth - 1)
  }

  const hasNoNextHeading = nextHeadingIndex === -1
  const end = hasNoNextHeading ? children.length : nextHeadingIndex + 1

  const sectionChildren = children.slice(headingIndex, headingIndex + end)
  children.splice(headingIndex, end, {
    type: 'mdxJsxFlowElement',
    name: 'Element',
    attributes: [
      {
        type: 'mdxJsxAttribute',
        name: 'name',
        value: slugger.slug(children[headingIndex].children[0].value)
      }
    ],
    children: sectionChildren,
    data: {
      _mdxExplicitJsx: true
    }
  })

  return insertSections(children, slugger)
}

export default function remarkTabs() {
  return ({ children }) => {
    const slugger = new GithubSlugger()
    insertSections(children, slugger)
  }
}
