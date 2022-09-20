const RAW_GITHUB_URL =
  process.env.NEXT_PUBLIC_RAW_GITHUB_URL || 'https://raw.githubusercontent.com'

function getErrorText(res) {
  try {
    return res.text()
  } catch (err) {
    return res.statusText
  }
}

async function getError(res, path) {
  const errorText = await getErrorText(res)
  const error = new Error(
    `GitHub raw download error (${path} - ${res.status}): ${errorText}`
  )

  error.status = res.status
  error.headers = res.headers

  return error
}

async function getRawFileFromGitHub(path) {
  const options = {}
  if (process.env.GITHUB_TOKEN) {
    options.headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    }
  }

  if (process.env.DEBUG === true) {
    console.log('github url')
    console.log(RAW_GITHUB_URL + path)
  }

  const res = await fetch(RAW_GITHUB_URL + path, options)
  if (res.ok) return res.text()
  throw await getError(res, path)
}

async function getRawFileFromFS(path) {
  const { join } = await import('path')
  const { readFileSync } = await import('fs')
  let rootPath = process.env.DOCS_PATH ? process.env.DOCS_PATH : 'content'
  // if (process.env.DOCS_SKIP_PATH_PREFIX === true) {
  //   rootPath = ''
  // }
  const filePath = join(process.cwd(), rootPath, path)
  return readFileSync(filePath, 'utf8')
}

export function getRawFile(path) {
  if (process.env.DEBUG === true) {
    console.log(path)
  }
  const org = process.env.DOCS_ORG
  const repo = process.env.DOCS_REPO
  const tag = process.env.DOCS_BRANCH
  if (!org || !repo || !tag) {
    // fetching from local filesystem instead
    return getRawFileFromFS(path)
  } else {
    return getRawFileFromGitHub(`/${org}/${repo}/${tag}${path}`)
  }
}
