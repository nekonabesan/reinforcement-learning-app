import { test, expect, request } from '@playwright/test'

test ('反転無し', async ({ request }) => {
    const result = await request.post('http://localhost:3000/api/get-min-value', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            baseValue: JSON.stringify([[1,2,3],[4,5,6],[7,8,9]]),
            source: JSON.stringify([[1,2,3],[4,5,6],[7,8,9]]),
        }
    })
    expect(result.ok).toBeTruthy()
    expect(await result.json()).toEqual({ 
        mirrorSymmetry: 0,
        rotationSymmetry: 0,
        value: 0
    });
})