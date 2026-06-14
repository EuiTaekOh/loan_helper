/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 배포 시 저장소 이름을 base path로 사용합니다.
// 로컬 개발: npm run dev (base: /)
// Pages 빌드: GITHUB_PAGES=true npm run build
const repoName = process.env.GITHUB_REPO_NAME ?? 'KB_오의택_여신도우미'
const base = process.env.GITHUB_PAGES === 'true' ? `/${repoName}/` : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
