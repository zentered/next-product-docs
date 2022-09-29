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

async function getRawFileFromGitHub(path, options) {
  if (process.env.GITHUB_TOKEN) {
    options.headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    }
  }

  if (options.debug) {
    console.log('github url')
    console.log(RAW_GITHUB_URL + path)
  }

  const res = await fetch(RAW_GITHUB_URL + path, options)
  if (res.ok) return res.text()
  throw await getError(res, path)
}

async function getRawFileFromFS(path, options) {
  const { rootPath } = options
  const { join } = await import('path')
  const { readFileSync } = await import('fs')

  const filePath = join(process.cwd(), rootPath, path)
  return readFileSync(filePath, 'utf8')
}

export function getRawFile(path, options) {
  if (options.debug) {
    console.log(path)
  }
  const { org, repo, tag } = options
  if (!org || !repo || !tag) {
    // fetching from local filesystem instead
    return getRawFileFromFS(path, options)
  } else {
    return getRawFileFromGitHub(`/${org}/${repo}/${tag}${path}`, options)
  }
}
