const TAB_TYPE = 'heading'

function findTabs(children, offset) {
  // E.g. `## Heading` vs `### Heading`
  const depthOfTabHeadings = children.find((c) => c.type === TAB_TYPE).depth

  return children.reduce((tabs, child, index) => {
    const lastTab = tabs.length > 0 && tabs[tabs.length - 1]

    if (child.type === TAB_TYPE && child.depth === depthOfTabHeadings) {
      if (tabs.length > 0) {
        lastTab.end = index + offset
      }
      const tab = {
        start: index + offset,
        // end is presumed last children, until other tab is found
        end: children.length + offset
      }
      return [...tabs, tab]
    }

    if (child.type === 'comment' && child.value.trim() === '/tabs') {
      // end comment
      lastTab.end = index + offset
    }
    return tabs
  }, [])
}

const getCommentValue = (child) => child.commentValue ?? child.value

const isOpeningComment = (child) => {
  if (child.type !== 'comment') {
    return false
  }

  return !isClosingComment(child) && getCommentValue(child).includes('tabs')
}

const isClosingComment = (child) => {
  if (child.type !== 'comment') {
    return false
  }

  return getCommentValue(child).includes('/tabs')
}

export default function remarkTabs() {
  return ({ children }) => {
    for (let index = 0; index < children.length; index++) {
      const child = children[index]
      if (isOpeningComment(child)) {
        const relevantChildren = children.slice(index)
        const closingCommentIndex = relevantChildren.findIndex((c) =>
          isClosingComment(c, true)
        )
        const tabs = findTabs(
          relevantChildren.slice(0, closingCommentIndex),
          index
        )

        if (tabs.length > 0) {
          const { start } = tabs[0]
          const { end } = tabs[tabs.length - 1]
          children.splice(start, end - start, {
            type: 'mdxJsxFlowElement',
            name: 'Tabs',
            children: tabs.flatMap((tab) => {
              const label = children[tab.start].children[0].value
              const tabChildren = children.slice(tab.start + 1, tab.end)
              return {
                type: 'mdxJsxFlowElement',
                name: 'Tab',
                attributes: [
                  {
                    type: 'mdxJsxAttribute',
                    name: 'label',
                    value: label
                  }
                ],
                children: tabChildren,
                data: {
                  _mdxExplicitJsx: true
                }
              }
            }),
            data: {
              _mdxExplicitJsx: true
            }
          })
        }
      }
    }
  }
}
