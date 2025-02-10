import { test, expect, request } from '@playwright/test'

test ('回転無し', async ({ request }) => {
  const result = await request.post('http://localhost:3000/api/rotation', {
      headers: {
          'Content-Type': 'application/json'
      },
      data: {
          r: 0,
          source: JSON.stringify([[1,2,3],[4,5,6],[7,8,9]]),
      }
  })
  expect(result.ok).toBeTruthy()
  expect(await result.json()).toEqual({ result: [[1,2,3],[4,5,6],[7,8,9]] });
})

test ('90度回転', async ({ request }) => {
    const result = await request.post('http://localhost:3000/api/rotation', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            r: 1,
            source: JSON.stringify([[1,2,3],[4,5,6],[7,8,9]]),
        }
    })
    expect(result.ok).toBeTruthy()
    expect(await result.json()).toEqual({ result: [[3,6,9],[2,5,8],[1,4,7]] });
})

test ('180度回転', async ({ request }) => {
  const result = await request.post('http://localhost:3000/api/rotation', {
      headers: {
          'Content-Type': 'application/json'
      },
      data: {
          r: 2,
          source: JSON.stringify([[1,2,3],[4,5,6],[7,8,9]]),
      }
  })
  expect(result.ok).toBeTruthy()
  expect(await result.json()).toEqual({ result: [[9,8,7],[6,5,4],[3,2,1]] });
})

test ('270度回転', async ({ request }) => {
  const result = await request.post('http://localhost:3000/api/rotation', {
      headers: {
          'Content-Type': 'application/json'
      },
      data: {
          r: 3,
          source: JSON.stringify([[1,2,3],[4,5,6],[7,8,9]]),
      }
  })
  expect(result.ok).toBeTruthy()
  expect(await result.json()).toEqual({ result: [[7,4,1],[8,5,2],[9,6,3]] });
})