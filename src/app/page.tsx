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
            width={300}
            height={300}
            className="m-auto mt-10"
        />

        <div className="absolute top-10 font-bold leading-7 text-gray-800">
          <span className="bg-white text-2xl xs:text-3xl">愛犬の小さな変化を</span><br />
          <span className="bg-white text-2xl xs:text-3xl">見逃さない</span><br />
          <span className="bg-white text-xs xs:text-sm">愛犬家のための健康管理アプリ</span><br />
        </div>

        <div className="mt-6 text-center">
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
      <div className="bg-secondary text-center text-gray-800 py-8 px-4">
        <h2 className="text-2xl font-bold mb-4">WanCareとは?</h2>

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

          <p className="text-sm m-auto xs:w-72">
            WanCareは日々の記録を通じて、愛犬の病気や怪我の早期発見をサポートします。
          </p>
          <p className="text-sm m-auto xs:w-72">
            また、他のオーナーの記録からあなたの愛犬に適したケア方法を知ることができます。
          </p>
        </div>
      </div>

      {/* アプリでできることの説明 */}
      <div className="text-center text-gray-800 py-8 px-4">
        <h2 className="text-2xl font-bold mb-4">WanCareでできること</h2>

        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold">お世話の記録</h3>
            <Image 
              src="/care_record.png"
              width={250}
              height={250}
              alt="お世話の登録"
              className="m-auto my-3"
            />
            <div className="text-xs m-auto xs:text-sm xs: w-72">
              <p>項目ごとにお世話の記録ができます。</p>
              <p>さんぼやトイレの回数、ごはんの量など記録の一元管理が可能です。</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold">日記投稿</h3>
            <Image 
              src="/add_diary.png"
              width={200}
              height={200}
              alt="お世話の登録"
              className="m-auto my-3"
            />
            <div className="text-xs m-auto xs:text-sm xs: w-72">
              <p>
                愛犬の気になる症状や日々の変化を簡単に投稿できます。
                テキストや写真を使って、愛犬の健康状態を記録しておきましょう。
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold">情報収集</h3>
            <Image 
              src="/search_info.png"
              width={200}
              height={200}
              alt="お世話の登録"
              className="m-auto my-3"
            />
            <div className="text-xs m-auto xs:text-sm xs: w-72">
              <p>
                他のユーザーが投稿した日記をキーワードで検索できます。
                愛犬の症状や状態とマッチした投稿から、最適なケア方法を探しましょう。
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* buttonエリア */}
      <div className="bg-secondary py-8 px-4">
        <div className="text-2xl font-bold text-white">
          <h2>大切な家族の健康は</h2>
          <h2>日々の記録から。</h2>
        </div>

        <Image 
          src="/bottom_img.png"
          width={200}
          height={200}
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
            />
          </Link>
        </div>
      </div>

      <footer>
        <p className="text-xs py-3 px-4 bg-secondary text-center text-primary">©WanCare 2025</p>
      </footer>
      
    </>
  );
}

