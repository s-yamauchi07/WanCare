import { render, screen } from '@testing-library/react';
import WelcomePage from '@/app/page';

// useRouter をモックする
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('WelcomePage Component', () => {
  it('render root component', () => {
    // WelComeコンポーネントをレンダリングする
    render(<WelcomePage />);

    // ゲストログインのボタンを検索
    const guestLoginButton = screen.getByRole('button', { name: "ゲストログイン"});
    // 「WanCareでできること」の文字を検索
    const appExplanation = screen.getByText(/WanCareでできること/);

    // 画面上にゲストログインボタンがあるか検証
    expect(guestLoginButton).toBeInTheDocument();
    // 画面上に「WanCareでできること」の文字があるか検証
    expect(appExplanation).toBeInTheDocument();

  });
});