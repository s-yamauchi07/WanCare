import { render, screen } from '@testing-library/react';
import WelcomePage from '@/app/page';
import { useRouter } from 'next/navigation';

// useRouter をモックする
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('WelcomePage Component', () => {
  it('render root component', () => {
    // useRouterをjestのmockに置き換え、useRouter関数が実行された場合もmockのpush関数を呼び出す。
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

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