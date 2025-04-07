import { render, screen } from '@testing-library/react'
import SignUp from "@/app/signup/page"

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SignUp component', () => {
  it('display signup form', () => {
    
    // SignUpコンポーネントが表示される
    render(<SignUp />);

    // 新規登録の表示の文字列を取得
    const registrationText = screen.getByRole('heading', {level: 2, name: '新規登録'});
    
    // nicknameのinput要素を取得
    const nicknameInput = screen.getByPlaceholderText('たろう')

    // emailのinput要素を取得
    const emailInput = screen.getByPlaceholderText('taro@test.com');    
    // passwordのinput要素を取得
    const passwordInput = screen.getByPlaceholderText('******');

    // 新規登録ボタンを取得
    const registrationButton = screen.getByRole('button', { name: '新規登録'});

    // それぞれの要素が画面上に存在することを検証
    expect(registrationText).toBeInTheDocument();
    expect(nicknameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(registrationButton).toBeInTheDocument();
  })
});