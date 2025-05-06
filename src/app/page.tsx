"use client"

import Image from "next/image";
import Link from "next/link";
import IconButton from "./_components/IconButton";
import { supabase } from "./utils/supabase";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  const handleGuestLogin = async() => {
    const guestEmail = process.env.NEXT_PUBLIC_GUEST_USER_EMAIL;
    const guestPassword = process.env.NEXT_PUBLIC_GUEST_USER_PASSWORD;
    
    if(!guestEmail || !guestPassword) {
      toast.error("ゲストユーザーが未登録です");
      return;
    }
  
    const { error } = await supabase.auth.signInWithPassword({
      email: guestEmail,
      password: guestPassword,
    });
  
    if(error) {
      toast.error("ゲストログインに失敗しました");
    } else {
      router.push("/home");
      toast.success("ゲストユーザーとしてログインしました");
    }
  }

  return (
    <>
      {/* ヘッダーエリア */}
      <header className="h-16 bg-primary flex items-center justify-between px-8">
        <p className="text-2xl font-bold text-main">WanCare</p>
        <Link href="/signin">
          <IconButton 
            iconName="i-material-symbols-login"
            buttonText="ログイン"
            color="bg-primary"
            textColor="text-main"
          />
        </Link>
      </header>

      {/* firstViewエリア */}
      <div className="relative py-12 px-8">
        <Image 
          src="/first_view.png"
          alt="トップ画像"
          width={300}
          height={300}
          style={{
            width: '100%',
            height: 'auto',
          }}
          priority={true}
          className="m-auto mt-10"
        />

        <div className="absolute top-10 font-bold leading-7 text-gray-800">
          <span className="bg-white text-2xl xs:text-3xl">愛犬の小さな変化を</span><br />
          <span className="bg-white text-2xl xs:text-3xl">見逃さない</span><br />
          <span className="bg-white text-sm xs:text-sm">愛犬家のための健康管理アプリ</span><br />
        </div>

        <div className="mt-6 text-center">
          <Link href="/signup">
            <IconButton 
              iconName="i-material-symbols-person-add"
              buttonText="新規登録"
              color="bg-secondary"
              textColor="text-gray-800"
              width="w-40"
            />
          </Link>
        </div>

        <div className="mt-6 text-center">
          <IconButton 
            iconName="i-material-symbols-check-circle-outline"
            buttonText="ゲストログイン"
            color="bg-primary"
            textColor="text-main"
            width="w-40"
            onClick={() => handleGuestLogin()}
          />
        </div>
      </div>

      {/* 説明エリア */}
      <div className="bg-secondary text-center text-gray-800 p-8">
        <h2 className="text-2xl font-bold mb-6">WanCareとは?</h2>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-primary">
            「ご飯を食べない...」<br />
            「いつから症状が出ていたの?」<br />
            「この病気の具体的な治療法は?」<br />
          </p>

          <Image 
            src="/about_WanCare.png"
            width={200}
            height={200}
            style={{
              width: '100%',
              height: 'auto',
            }}
            alt="アプリについて"
            className="m-auto"
          />

          <p className="text-sm m-auto xs:w-72">
            WanCareは日々の記録を通じて、愛犬の病気や怪我の早期発見をサポートします。
          </p>
          <p className="text-sm m-auto xs:w-72">
            また、他のオーナーの記録からあなたの愛犬に適したケア方法を知ることができます。
          </p>
        </div>
      </div>

      {/* アプリでできることの説明 */}
      <div className="text-center text-gray-800 p-8">
        <h2 className="text-2xl font-bold mb-6">WanCareでできること</h2>

        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-primary">お世話の記録</h3>
            <Image 
              src="/care_record.png"
              width={250}
              height={250}
              style={{
                width: '100%',
                height: 'auto',
              }}
              alt="お世話の登録"
              className="m-auto my-3"
            />
            <div className="text-sm m-auto xs:text-sm xs: w-72">
              <p>項目ごとにお世話の記録ができます。</p>
              <p>さんぼやトイレの回数、ごはんの量など記録の一元管理が可能です。</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-primary">日記投稿</h3>
            <Image 
              src="/add_diary.png"
              width={200}
              height={200}
              style={{
                width: '100%',
                height: 'auto',
              }}
              alt="お世話の登録"
              className="m-auto my-3"
            />
            <div className="text-sm m-auto xs:text-sm xs: w-72">
              <p>
                愛犬の気になる症状や日々の変化を簡単に投稿できます。
                テキストや写真で愛犬の健康状態を記録しておきましょう。
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-primary">情報収集</h3>
            <Image 
              src="/search_info.png"
              width={200}
              height={200}
              style={{
                width: '100%',
                height: 'auto',
              }}
              alt="お世話の登録"
              className="m-auto my-3"
            />
            <div className="text-sm m-auto xs:text-sm xs: w-72">
              <p>
                他のユーザーの投稿記事をキーワードで検索できます。
                愛犬の症状や状態とマッチした投稿から、最適なケア方法を探しましょう。
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* buttonエリア */}
      <div className="bg-secondary p-8">
        <div className="text-2xl font-bold text-primary">
          <h2>大切な家族の健康は</h2>
          <h2>日々の記録から。</h2>
        </div>

        <Image 
          src="/bottom_img.png"
          width={200}
          height={200}
          style={{
            width: '100%',
            height: 'auto',
          }}
          alt="サービス紹介画像"
          className="m-auto mb-8"
        />

        <div className="my-4 text-center">
          <Link href="/signup">
            <IconButton 
              iconName="i-material-symbols-check-circle-outline"
              buttonText="使ってみる"
              color="bg-primary"
              textColor="text-main"
              width="w-40"
            />
          </Link>
        </div>
      </div>

      <footer className="bg-secondary text-primary py-3">
        <Link 
          href="https://www.instagram.com/shiony07?igsh=ZWxxeWxucTFuMWtw&utm_source=qr" 
          className="text-xs flex justify-center items-center"
        >お問い合わせ
        <span className="i-tabler-brand-instagram w-5 h-5"></span>
        </Link>
      </footer>
      <Toaster />
    </>
  );
}

