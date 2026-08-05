// jest-dom 매처(toHaveTextContent 등)를 vitest의 expect에 타입으로 등록한다.
// vitest.setup.ts는 tsconfig에서 제외돼 있어 이 파일이 없으면 tsc가 매처를 알지 못한다.
import '@testing-library/jest-dom/vitest';
