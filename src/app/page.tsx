import Image from "next/image";

export default function WelcomePage() {
  return (
    <>
      {/* ヘッダーエリア */}
      <header>
        <p>WanCare</p>
        <p>ログイン</p>
      </header>

      {/* firstViewエリア */}
      <div>
        <div>
          <h2>愛犬の小さな変化を</h2>
          <h2>見逃さない</h2>
          <p>愛犬家のための健康管理アプリ</p>
        </div>

        <div>
          <button>新規登録</button>
        </div>
      </div>

      {/* 説明エリア */}
      <div>
        <h2>WanCareとは?</h2>
        <p>
          「ご飯を食べない...」
          「いつから症状が出ていたの?」
          「この病気の具体的な治療法は?」
        </p>

        <p>WanCareは日々の記録を通じて、愛犬の病気の早期発見をサポートします。</p>
        <p>またオーナーの皆さまが記録を投稿することは、同じ病気や怪我で苦しむわんちゃんとそのご家族の手助けになります。</p>
      </div>

      {/* アプリでできることの説明 */}
      <div>
        <h2>WanCareでできること</h2>

        <div>
          <h3>お世話の記録</h3>
          <Image />
          <div>
            <p>項目ごとにお世話の記録ができます。</p>
            <p>さんぼやトイレの回数、ごはんの量など記録の一元管理が可能です。</p>
          </div>
        </div>

        <div>
          <h3>日記投稿</h3>
          <Image />
          <div>
            <p>愛犬の気になる症状や日々の変化を簡単に投稿できます。</p>
            <p>テキストや写真を使って、愛犬の健康状態を記録しておきましょう。</p>
          </div>
        </div>

        <div>
          <h3>情報収集</h3>
          <Image />
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

        <Image/>

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