const getStateNode = (varsToSub, children) => {
  // console.log(JSON.stringify(children, null, 2))
  return {
    type: 'mdxJsxFlowElement',
    name: 'State',
    attributes: [
      {
        type: 'mdxJsxAttribute',
        name: 'initialState',
        value: {
          type: 'mdxJsxAttributeValueExpression',
          value: '{ inputVal: "myValue" }',
          data: {
            estree: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ObjectExpression',
                    properties: varsToSub.map((vts) => ({
                      type: 'Property',
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        name: vts
                      },
                      value: {
                        type: 'Literal',
                        value: ''
                      },
                      kind: 'init'
                    }))
                  }
                }
              ],
              sourceType: 'module',
              comments: []
            }
          }
        }
      }
    ],
    children: [
      {
        type: 'mdxFlowExpression',
        value:
          '({setState: setSubstitutionState, ...substitutionState}) => (\n  <div>hi there</div>\n)',
        data: {
          estree: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  id: null,
                  expression: true,
                  generator: false,
                  async: false,
                  params: [
                    {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            name: 'setState'
                          },
                          value: {
                            type: 'Identifier',
                            name: 'setSubstitutionState'
                          },
                          kind: 'init'
                        },
                        {
                          type: 'RestElement',
                          argument: {
                            type: 'Identifier',
                            name: 'substitutionState'
                          }
                        }
                      ]
                    }
                  ],
                  body: {
                    type: 'JSXFragment',
                    openingFragment: {
                      type: 'JSXOpeningFragment',
                      attributes: [],
                      selfClosing: false
                    },
                    closingFragment: {
                      type: 'JSXClosingFragment'
                    },
                    children: [
                      {
                        type: 'JSXText',
                        value: 'hi there!',
                        raw: 'hi there'
                      },
                      // ...children
                    ]
                  }
                }
              }
            ],
            sourceType: 'module',
            comments: []
          }
        }
      }
    ],
    data: {
      _mdxExplicitJsx: true
    }
  }
}

export default getStateNode
