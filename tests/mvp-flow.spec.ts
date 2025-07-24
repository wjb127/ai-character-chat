import { test, expect } from '@playwright/test'

test.describe('MVP Flow - Payment and Email Collection', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/chat')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('should show payment popup after 10 messages', async ({ page }) => {
    await page.goto('/chat')

    // 메시지 카운터가 표시되는지 확인
    await expect(page.locator('text=대화 횟수: 0/10 (무료)')).toBeVisible()

    // 10개의 메시지 전송
    for (let i = 1; i <= 10; i++) {
      await page.fill('input[placeholder="메시지를 입력하세요..."]', `테스트 메시지 ${i}`)
      await page.click('button[type="submit"]')
      
      // 메시지 카운터 업데이트 확인
      await expect(page.locator(`text=대화 횟수: ${i}/10 (무료)`)).toBeVisible()
      
      // 잠시 대기 (API 호출 완료 대기)
      await page.waitForTimeout(1000)
    }

    // 결제 팝업이 나타나는지 확인
    await expect(page.locator('text=프리미엄 업그레이드')).toBeVisible()
    await expect(page.locator('text=무제한 대화를 즐겨보세요!')).toBeVisible()
  })

  test('should display pricing information correctly', async ({ page }) => {
    await page.goto('/chat')

    // 10개 메시지 전송하여 팝업 표시
    for (let i = 1; i <= 10; i++) {
      await page.fill('input[placeholder="메시지를 입력하세요..."]', `테스트 메시지 ${i}`)
      await page.click('button[type="submit"]')
      await page.waitForTimeout(500)
    }

    // 가격표 확인
    await expect(page.locator('text=베이직')).toBeVisible()
    await expect(page.locator('text=₩9,900')).toBeVisible()
    await expect(page.locator('text=프리미엄')).toBeVisible()
    await expect(page.locator('text=₩19,900')).toBeVisible()
    await expect(page.locator('text=프로')).toBeVisible()
    await expect(page.locator('text=₩39,900')).toBeVisible()

    // 추천 배지 확인
    await expect(page.locator('text=추천')).toBeVisible()
  })

  test('should close payment popup with "나중에 하기" button', async ({ page }) => {
    await page.goto('/chat')

    // 10개 메시지 전송
    for (let i = 1; i <= 10; i++) {
      await page.fill('input[placeholder="메시지를 입력하세요..."]', `테스트 메시지 ${i}`)
      await page.click('button[type="submit"]')
      await page.waitForTimeout(500)
    }

    // 팝업 표시 확인
    await expect(page.locator('text=프리미엄 업그레이드')).toBeVisible()

    // "나중에 하기" 버튼 클릭
    await page.click('text=나중에 하기')

    // 팝업이 사라졌는지 확인
    await expect(page.locator('text=프리미엄 업그레이드')).not.toBeVisible()
  })

  test('should show email form after clicking premium button', async ({ page }) => {
    await page.goto('/chat')

    // 10개 메시지 전송
    for (let i = 1; i <= 10; i++) {
      await page.fill('input[placeholder="메시지를 입력하세요..."]', `테스트 메시지 ${i}`)
      await page.click('button[type="submit"]')
      await page.waitForTimeout(500)
    }

    // 프리미엄 선택하기 버튼 클릭
    await page.click('text=프리미엄 선택하기')

    // 이메일 폼이 표시되는지 확인
    await expect(page.locator('text=사전 예약 신청')).toBeVisible()
    await expect(page.locator('text=서비스 준비 중입니다')).toBeVisible()
    await expect(page.locator('label:has-text("이메일 주소")')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('text=개인정보 수집 및 이용에 동의합니다')).toBeVisible()
  })

  test('should validate email form before submission', async ({ page }) => {
    await page.goto('/chat')

    // 10개 메시지 전송하여 팝업 표시
    for (let i = 1; i <= 10; i++) {
      await page.fill('input[placeholder="메시지를 입력하세요..."]', `테스트 메시지 ${i}`)
      await page.click('button[type="submit"]')
      await page.waitForTimeout(500)
    }

    // 프리미엄 선택
    await page.click('text=프리미엄 선택하기')

    // 사전 예약 버튼이 비활성화 상태인지 확인
    const submitButton = page.locator('button:has-text("사전 예약")')
    await expect(submitButton).toBeDisabled()

    // 이메일만 입력 (동의 체크박스 없음)
    await page.fill('input[type="email"]', 'test@example.com')
    await expect(submitButton).toBeDisabled()

    // 동의 체크박스만 체크 (이메일 없음)
    await page.fill('input[type="email"]', '')
    await page.check('input[type="checkbox"]')
    await expect(submitButton).toBeDisabled()

    // 둘 다 입력/체크
    await page.fill('input[type="email"]', 'test@example.com')
    await page.check('input[type="checkbox"]')
    await expect(submitButton).toBeEnabled()
  })

  test('should handle email submission successfully', async ({ page }) => {
    // Mock the API response
    await page.route('/api/email-collection', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })

    await page.goto('/chat')

    // 10개 메시지 전송
    for (let i = 1; i <= 10; i++) {
      await page.fill('input[placeholder="메시지를 입력하세요..."]', `테스트 메시지 ${i}`)
      await page.click('button[type="submit"]')
      await page.waitForTimeout(500)
    }

    // 이메일 폼으로 진행
    await page.click('text=프리미엄 선택하기')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.check('input[type="checkbox"]')
    await page.click('button:has-text("사전 예약")')

    // 성공 메시지 확인
    await expect(page.locator('text=등록 완료!')).toBeVisible()
    await expect(page.locator('text=모바일 앱 출시 소식을 가장 먼저 받아보실 수 있습니다')).toBeVisible()
  })

  test('should show survey popup after email submission', async ({ page }) => {
    // Mock API responses
    await page.route('/api/email-collection', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })

    await page.route('/api/survey', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })

    await page.goto('/chat')

    // 10개 메시지 전송하여 결제 팝업 표시
    for (let i = 1; i <= 10; i++) {
      await page.fill('input[placeholder="메시지를 입력하세요..."]', `테스트 메시지 ${i}`)
      await page.click('button[type="submit"]')
      await page.waitForTimeout(500)
    }

    // 이메일 제출 과정
    await page.click('text=프리미엄 선택하기')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.check('input[type="checkbox"]')
    await page.click('button:has-text("사전 예약")')

    // 성공 메시지에서 확인 버튼 클릭
    await page.click('button:has-text("확인")')

    // 설문 팝업이 표시되는지 확인 (2초 후)
    await expect(page.locator('text=기능 선호도 조사')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=어떤 기능이 필요하신가요?')).toBeVisible()
  })

  test('should allow multiple feature selection in survey', async ({ page }) => {
    // Mock API responses
    await page.route('/api/email-collection', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })

    await page.route('/api/survey', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })

    await page.goto('/chat')

    // 설문 팝업까지 진행
    for (let i = 1; i <= 10; i++) {
      await page.fill('input[placeholder="메시지를 입력하세요..."]', `테스트 메시지 ${i}`)
      await page.click('button[type="submit"]')
      await page.waitForTimeout(500)
    }

    await page.click('text=프리미엄 선택하기')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.check('input[type="checkbox"]')
    await page.click('button:has-text("사전 예약")')
    await page.click('button:has-text("확인")')

    // 설문 옵션들 선택
    await expect(page.locator('text=기능 선호도 조사')).toBeVisible({ timeout: 5000 })
    
    await page.check('input[type="checkbox"]:near(:text("새로운 커스터마이징 캐릭터 생성"))')
    await page.check('input[type="checkbox"]:near(:text("이미지나 영상 시각화"))')
    await page.check('input[type="checkbox"]:near(:text("다양한 캐릭터"))')

    // 자유 입력
    await page.fill('textarea', '음성 채팅 기능도 추가해주세요')

    // 설문 제출
    await page.click('button:has-text("제출하기")')

    // 설문 완료 메시지 확인
    await expect(page.locator('text=제출 완료!')).toBeVisible()
    await expect(page.locator('text=소중한 의견을 주셔서 감사합니다')).toBeVisible()
  })

  test('should allow skipping survey', async ({ page }) => {
    // Mock API responses
    await page.route('/api/email-collection', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })

    await page.goto('/chat')

    // 설문 팝업까지 진행
    for (let i = 1; i <= 10; i++) {
      await page.fill('input[placeholder="메시지를 입력하세요..."]', `테스트 메시지 ${i}`)
      await page.click('button[type="submit"]')
      await page.waitForTimeout(500)
    }

    await page.click('text=프리미엄 선택하기')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.check('input[type="checkbox"]')
    await page.click('button:has-text("사전 예약")')
    await page.click('button:has-text("확인")')

    // 설문 건너뛰기
    await expect(page.locator('text=기능 선호도 조사')).toBeVisible({ timeout: 5000 })
    await page.click('button:has-text("건너뛰기")')

    // 설문 팝업이 사라졌는지 확인
    await expect(page.locator('text=기능 선호도 조사')).not.toBeVisible()
  })

  test('should not show popups again after completion', async ({ page }) => {
    // Mock API responses
    await page.route('/api/email-collection', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })

    await page.route('/api/survey', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })

    await page.goto('/chat')

    // 전체 플로우 완료
    for (let i = 1; i <= 10; i++) {
      await page.fill('input[placeholder="메시지를 입력하세요..."]', `테스트 메시지 ${i}`)
      await page.click('button[type="submit"]')
      await page.waitForTimeout(500)
    }

    await page.click('text=프리미엄 선택하기')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.check('input[type="checkbox"]')
    await page.click('button:has-text("사전 예약")')
    await page.click('button:has-text("확인")')
    await expect(page.locator('text=기능 선호도 조사')).toBeVisible({ timeout: 5000 })
    await page.click('button:has-text("건너뛰기")')

    // 페이지 새로고침
    await page.reload()

    // 추가 메시지 전송해도 팝업이 나타나지 않는지 확인
    for (let i = 1; i <= 5; i++) {
      await page.fill('input[placeholder="메시지를 입력하세요..."]', `추가 메시지 ${i}`)
      await page.click('button[type="submit"]')
      await page.waitForTimeout(500)
    }

    // 팝업이 나타나지 않았는지 확인
    await expect(page.locator('text=프리미엄 업그레이드')).not.toBeVisible()
    await expect(page.locator('text=기능 선호도 조사')).not.toBeVisible()
  })
})