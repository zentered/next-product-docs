import getStateNode from './utils/getStateNode'

const COMMENT_LABEL = 'export-to-input'

const isClosingComment = (child) => {
  return (
    child.type === 'comment' &&
    child.commentValue.trim().includes(`/${COMMENT_LABEL}`)
  )
}

const isOpeningComment = (child) => {
  return (
    child.type === 'comment' &&
    child.commentValue.trim().includes(COMMENT_LABEL)
  )
}

function findVarsToSub(children) {
  const varsToSub = []

  const updatedChildren = children.reduce((arr, child) => {
    console.log(child)
    if (child.name === 'State') {
      // console.log(JSON.stringify(child, null, 2))
    }
    const isClosingInputComment = isClosingComment(child)

    if (isClosingInputComment) {
      // find opening comment
      const numberOfElementsToRemove = [...arr].reverse().findIndex((c) => {
        return isOpeningComment(c)
      })

      const arrWithoutComment = arr.slice(0, -numberOfElementsToRemove)
      const markdownInComment = arr.slice(-numberOfElementsToRemove)

      const exportStatement = markdownInComment.find(
        (c) => c.value && c.value.includes('export')
      ).value

      const varToSub = `$${exportStatement.substring(
        exportStatement.lastIndexOf(' ') + 1,
        exportStatement.lastIndexOf('=')
      )}`

      varsToSub.push(varToSub)

      return arrWithoutComment.concat({
        type: 'jsx',
        value: `
          <input
            type="text"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mb-5"
            value={substitutionState.${varToSub}}
            placeholder="${varToSub}"
            onChange={(event) => setSubstitutionState({ ${varToSub}: event.currentTarget.value})}
          />
        `
      })
    }

    return [...arr, child]
  }, [])

  children.splice(0, children.length, ...updatedChildren)

  return varsToSub
}

export default function remarkState() {
  return ({ children }) => {
    const varsToSub = findVarsToSub(children)
    

    
    children.splice(0, children.length, getStateNode(varsToSub, children))

    // children.unshift(
    //   test
    //   // {
    //   //   type: 'jsx',
    //   //   value: `<State initialstate={${substitutionState}}>`
    //   // },
    //   // {
    //   //   type: 'jsx',
    //   //   value: `{({setState: setSubstitutionState, ...substitutionState}) => (`
    //   // },
    //   // {
    //   //   type: 'jsx',
    //   //   value: `<>`
    //   // },
    //   // {
    //   //   type: 'jsx',
    //   //   value: `<Interpolate substitutions={substitutionState}>`
    //   // }
    // )

    // children
    //   .push
    //   // {
    //   //   type: 'jsx',
    //   //   value: '</Interpolate>'
    //   // },
    //   // {
    //   //   type: 'jsx',
    //   //   value: '</>'
    //   // },
    //   // {
    //   //   type: 'jsx',
    //   //   value: ')}'
    //   // },
    //   // {
    //   //   type: 'jsx',
    //   //   value: `</State>`
    //   // }
    //   ()
  }
}
