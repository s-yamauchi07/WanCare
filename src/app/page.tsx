import Image from "next/image";
import Link from "next/link";
import IconButton from "./_components/IconButton";

export default function WelcomePage() {
  return (
    <>
      {/* ヘッダーエリア */}
      <header className="h-16 bg-primary flex items-center justify-between px-4">
        <p className="text-2xl font-bold text-main">WanCare</p>
        <Link href="/signin">
          <IconButton 
            iconName="i-material-symbols-login"
            buttonText="Login"
            color="bg-primary"
            textColor="text-main"
          />
        </Link>
      </header>

      {/* firstViewエリア */}
      <div className="relative py-12 px-4">
        <Image 
            src="/first_view.png"
            alt="トップ画像"
            width={200}
            height={200}
            className="m-auto mt-10"
        />

        <div className="absolute top-10 font-bold">
          <span className="bg-white text-xl">愛犬の小さな変化を</span><br />
          <span className="bg-white text-xl">見逃さない</span><br />
          <span className="bg-white text-xs">愛犬家のための健康管理アプリ</span><br />
        </div>

        <div className="mt-4 text-center">
          <Link href="/signup">
            <IconButton 
              iconName="i-material-symbols-check-circle-outline"
              buttonText="新規登録"
              color="bg-primary"
              textColor="text-main"
            />
          </Link>
        </div>
      </div>

      {/* 説明エリア */}
      <div className="bg-secondary text-center py-8 px-4">
        <h2 className="text-xl font-bold mb-4">WanCareとは?</h2>

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
            alt="アプリについて"
            className="m-auto"
          />

          <p className="text-sm">
            WanCareは日々の記録を通じて、愛犬の病気の早期発見をサポートする
            <span className="text-primary font-bold">愛犬家のための健康管理アプリ</span>です。
          </p>
          <p className="text-sm">
          オーナーの皆さまの記録は、同じ病気や怪我で悩むわんちゃんとそのご家族にとって体験談や治療法を知る手助けになります。
          </p>
        </div>
      </div>

      {/* アプリでできることの説明 */}
      <div>
        <h2>WanCareでできること</h2>

        <div>
          <h3>お世話の記録</h3>
          {/* <Image /> */}
          <div>
            <p>項目ごとにお世話の記録ができます。</p>
            <p>さんぼやトイレの回数、ごはんの量など記録の一元管理が可能です。</p>
          </div>
        </div>

        <div>
          <h3>日記投稿</h3>
          {/* <Image /> */}
          <div>
            <p>愛犬の気になる症状や日々の変化を簡単に投稿できます。</p>
            <p>テキストや写真を使って、愛犬の健康状態を記録しておきましょう。</p>
          </div>
        </div>

        <div>
          <h3>情報収集</h3>
          {/* <Image /> */}
          <div>
            <p>他のユーザーが投稿した日記をタグで効率的に検索できます。</p>
            <p>愛犬の症状や状態に適した記事から、最適なケア方法を探しましょう。</p>
          </div>
        </div>
      </div>

      {/* buttonエリア */}
      <div>
        <div>
          <h2>大切な家族の健康は</h2>
          <h2>に日の記録から。</h2>
        </div>

        {/* <Image/> */}

        <button>
          使ってみる
        </button>
      </div>

      <footer>
        <p>©️ WanCare 2025</p>
      </footer>
      
    </>
  );
}