import { vi, expect, test } from 'vitest'
import { getRawFile } from '../../src/lib/files.js'

vi.mock('node:fs', async () => {
  return {
    ...((await vi.importActual) < typeof import('node:fs') > 'node:fs'),
    readFileSync: vi.fn().mockReturnValue(`mocked value`)
  }
})
// const { readFileSync } = await import("node:fs");

test("getRawFile('/docs/README.mdx'", async () => {
  const { readFileSync } = await import('node:fs')
  const file = await getRawFile('/docs/README.mdx', {
    rootPath: 'content'
  })

  expect(file).toBe('mocked value')
  expect(readFileSync).toBeCalledWith(
    `${process.env.PWD}/content/docs/README.mdx`,
    'utf8'
  )
})
