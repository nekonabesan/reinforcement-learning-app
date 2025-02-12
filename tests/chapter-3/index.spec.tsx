import { test, expect, request } from '@playwright/test'

test ('chapter-1ページアクセス', async ({ page }) => {
    await page.goto('http://localhost:3000/chapter-3')
})