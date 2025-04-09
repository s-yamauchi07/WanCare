import { test, expect, Page } from '@playwright/test';

let page: Page;

// テストデータ
const validEmail = 'test@test.com';
const validPassword = 'abc123';

// 成功した場合のモックデータ
const mockSuccessResponse = {
  access_token: 'mock-access-token',
  token_type: 'bearer',
  expires_in: 3600,
  refresh_token: 'mock-refresh-token',
  user: {
    id: 'mock-user-id',
    aud: 'authenticated',
  },
}

// 失敗する場合のモックデータ
const mockFailedResponse = {
  error: 'Invalid login credentials',
}

// 共通処理
test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('http://localhost:3000');
  const signinTitle = page.getByRole('button', { name: "ログイン", exact: true});
  await signinTitle.click();
  await expect(page).toHaveURL('http://localhost:3000/signin');
})

test.describe('SignIn Test', () => {
  // 正常にログインできる場合
  test('Successful login with valid email and password', async () => {
    // supabase.auth.signInWithPasswordのレスポンスMock
    await page.route("**/auth/v1/token?grant_type=password", async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSuccessResponse),
      })
    });
  
    // dogs/checkDogのレスポンスMock
    await page.route("**/api/dogs/checkDog", async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          dog: true,
        })
      })
    })
  
    // 入力フォームの要素を取得
    const emailInput =  page.getByPlaceholder('taro@test.com');
    const passwordInput = page.getByPlaceholder('******');
  
    // フォームの要素にemail, passwordを入力する
    await emailInput.fill(validEmail);
    await passwordInput.fill(validPassword);
  
    // 新規登録ボタンをクリックする
    const signinButton = page.getByRole('button', { name: "ログイン", exact: true});
    await signinButton.click();
  
    await expect(page).toHaveURL('http://localhost:3000/home');
  });
  
  test.describe('Failure login', () => {
    test.beforeEach(async ({ page }) => {
      await page.route("**/auth/v1/token?grant_type=password", async route => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify(mockFailedResponse),
        })
      });
    });

    test('Failed login with invalid email and password', async () => {
      // 入力フォームの要素を取得
      const emailInput =  page.getByPlaceholder('taro@test.com');
      const passwordInput = page.getByPlaceholder('******');
    
      // フォームの要素にemail, passwordを入力する
      await emailInput.fill('invalid@test.com');
      await passwordInput.fill('invalid123');
    
      // ログインボタンをクリックする
      const signinButton = page.getByRole('button', { name: "ログイン", exact: true});
      await signinButton.click();
    
      await expect(page).toHaveURL('http://localhost:3000/signin');
    });
  
  
    test('Failed login with empty email and password', async () => {
    
      const emailInput =  page.getByPlaceholder('taro@test.com');
      const passwordInput = page.getByPlaceholder('******');
    
      await emailInput.fill('');
      await passwordInput.fill('');
    
      const signinButton = page.getByRole('button', { name: "ログイン", exact: true});
      await signinButton.click();
    
      await expect(page.locator('text=emailは必須です。')).toBeVisible();
      await expect(page.locator('text=passwordは必須です。')).toBeVisible();
    
      await expect(page).toHaveURL('http://localhost:3000/signin');
    });
  
    test('Failed login with short password', async () => {
      const emailInput =  page.getByPlaceholder('taro@test.com');
      const passwordInput = page.getByPlaceholder('******');
    
      await emailInput.fill(validEmail);
      await passwordInput.fill('ab123');
    
      const signinButton = page.getByRole('button', { name: "ログイン", exact: true});
      await signinButton.click();
    
      await expect(page.locator('text=passwordは6文字以上で入力してください。')).toBeVisible();
    
      await expect(page).toHaveURL('http://localhost:3000/signin');
    });
  
  
    test('Failed login with invalid password format', async () => {  
      const emailInput =  page.getByPlaceholder('taro@test.com');
      const passwordInput = page.getByPlaceholder('******');

      await emailInput.fill(validEmail);
      await passwordInput.fill('aaabbb');
      
      const signinButton = page.getByRole('button', { name: "ログイン", exact: true});
      await signinButton.click();
    
      await expect(page.locator('text=passwordは英数字混合で入力してください。')).toBeVisible();
    
      await expect(page).toHaveURL('http://localhost:3000/signin');
    });
  });
});