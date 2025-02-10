import { test, expect, request } from '@playwright/test'

test ('反転無し', async ({ request }) => {
    const result = await request.post('http://localhost:3000/api/mirror', {
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

test ('横軸対象反転', async ({ request }) => {
    const result = await request.post('http://localhost:3000/api/mirror', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            r: 1,
            source: JSON.stringify([[1,2,3],[4,5,6],[7,8,9]]),
        }
    })
    expect(result.ok).toBeTruthy()
    expect(await result.json()).toEqual({ result: [[7,8,9],[4,5,6],[1,2,3]] });
})

test ('縦軸対象反転', async ({ request }) => {
    const result = await request.post('http://localhost:3000/api/mirror', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            r: 2,
            source: JSON.stringify([[1,2,3],[4,5,6],[7,8,9]]),
        }
    })
    expect(result.ok).toBeTruthy()
    expect(await result.json()).toEqual({ result: [[3,2,1],[6,5,4],[9,8,7]] });
})

test ('右上斜軸対象反転', async ({ request }) => {
    const result = await request.post('http://localhost:3000/api/mirror', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            r: 3,
            source: JSON.stringify([[1,2,3],[4,5,6],[7,8,9]]),
        }
    })
    expect(result.ok).toBeTruthy()
    expect(await result.json()).toEqual({ result: [[9,6,3],[8,5,2],[7,4,1]] });
})

test ('右下斜軸対象反転', async ({ request }) => {
    const result = await request.post('http://localhost:3000/api/mirror', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            r: 4,
            source: JSON.stringify([[1,2,3],[4,5,6],[7,8,9]]),
        }
    })
    expect(result.ok).toBeTruthy()
    expect(await result.json()).toEqual({ result: [[1,4,7],[2,5,8],[3,6,9]] });
})