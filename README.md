# アプリケーションの概要
<img src="https://github.com/user-attachments/assets/def2c232-2bde-4813-b0d0-22b7b4b24899" width="800">

# サービスのURL
ゲストログイン機能を実装しましたので、ユーザー登録せずにお試しいただくことも可能です。<br>
※ゲストログインの場合は、一部機能制限がございます。<br>
https://wan-care.vercel.app/

# サービス開発の経緯


# 機能一覧
| トップ画面 | ユーザー登録画面 |
| --- | --- |
|<img src="https://github.com/user-attachments/assets/bb171368-087a-47f7-a0d4-954a8a601500"  width="100%"/> | <img src="https://github.com/user-attachments/assets/5f6a4472-6dfd-43c7-8158-fe0481aeba85"  width="50%"/><img src="https://github.com/user-attachments/assets/1727c787-5203-40b3-92b8-923486cef4ec"  width="50%"/> |
| トップページ(/)をLPにし、アプリケーションの内容が分かるようにしました。| Supabase Authを用いてユーザー登録機能を実装しました。<ユーザー登録後は、愛犬情報も紐づけて登録できるように実装しています。 |

| ログイン画面 | ダッシュボード画面 |
| --- | --- |
|<img src="https://github.com/user-attachments/assets/b5bf84ab-1832-443b-b366-64a7cf26d725"  width="100%"/> | <img src="https://github.com/user-attachments/assets/51a83ef8-3152-4bfa-bde5-11088053749c"  width="100%"/> |
| アドレスとパスワードでの認証機能を実装しました。 | 愛犬の基本情報やログイン日に行うお世話の記録の一覧が確認できます。体重変動が可視化されるようにグラフ表示を実装しました。 |

| お世話記録の登録画面 | お世話記録の詳細画面 |
| --- | --- |
|<img src="https://github.com/user-attachments/assets/93a7772f-39bb-4672-a776-ec2fce571a27"  width="50%"/> <img src="https://github.com/user-attachments/assets/f2a7d0a1-bf2c-4417-90cc-ca79ab9340d1"  width="50%"/>| <img src="https://github.com/user-attachments/assets/154efb38-9ec0-4ad3-9b7e-56ad1c2a0b08"  width="100%"/> |
| お世話のカテゴリーを選択するとモーダルが開き、テキストや画像で記録を取れるように実装しました。 | 登録したお世話記録は詳細ページで確認できます。このページから記録の編集・削除ができるよう実装しました。 |

| カレンダー画面 | 日記登録画面 |
| --- | --- |
|<img src="https://github.com/user-attachments/assets/9f3f43c2-2c29-4a27-bdf3-335cb2d24a92"  width="100%"/> | <img src="https://github.com/user-attachments/assets/cb39b588-2cb6-4e09-a3c7-0fb00a1a0eff"  width="100%"/> |
| 登録したお世話ログをカレンダー形式で確認できます。日付をクリックすると該当日の記録一覧が表示されるように実装しました。 | タグづけや画像を使ってより詳細な闘病日記や異変の記録を残せるように日記投稿機能を実装しました。 |

| まとめ登録画面 | 日記・まとめ一覧画面 |
| --- | --- |
|<img src="https://github.com/user-attachments/assets/dc97918e-061f-4698-ae57-b10b6a82da38"  width="100%"/> | <img src="https://github.com/user-attachments/assets/32b2ad3a-1e2d-42e9-bfcd-40a2db6efa35"  width="100%"/> |
| 作成した日記を1つのファイルに集約できるような「まとめ」機能を作成しました。作成時に紐付けしたい日記選択ができます。 | 登録した記録・まとめの一覧表示画面です。投稿記事をクリックすると詳細ページに遷移できるように実装しました。 |

| 日記詳細画面 | まとめ詳細画面 |
| --- | --- |
|<img src="https://github.com/user-attachments/assets/9faeb853-68e1-487c-a2b5-205f4f05b2ef"  width="100%"/> | <img src="https://github.com/user-attachments/assets/6fa6547f-aa86-46e1-b2e2-fe7eaebe6144"  width="100%"/> |
| 登録した日記の詳細画面です。投稿者はこのページから日記の編集・削除ができるように実施しました。また、日記のお気に入り登録やコメント登録もできるように実装しました。 | 登録したまとめの詳細画面です。このまとめに紐づいている日記の一覧が確認できます。各日記をクリックすると日記の詳細ページに遷移するよう実装しました。 |

| コメント投稿画面 | 検索画面 |
| --- | --- |
|<img src="https://github.com/user-attachments/assets/9e5a3d03-128e-4252-b1d7-c40191f13095"  width="100%"/> | <img src="https://github.com/user-attachments/assets/c84c9c06-fdf0-41f4-8df3-e8b6bdfa4b9b"  width="100%"/> |
| 日記の詳細画面にて「コメント投稿する」ボタンをクリックすると、コメントを投稿できるように実装しました。 | 検索ウィンドウにキーワードを入力するとサジェストが表示されるように実装しました。入力したキーワードに紐づく日記、まとめが検索できます。 |

| マイページ画面 | ユーザー詳細画面 |
| --- | --- |
|<img src="https://github.com/user-attachments/assets/8bd555db-7f71-43af-874c-0fc786abc997"  width="100%"/> | <img src="https://github.com/user-attachments/assets/e128501f-5220-498a-8eab-2d8b1a679964"  width="100%"/> |
| 登録した日記・まとめ・ブックマークした記録一覧が確認できるように実装しました。プロフィール編集から、ニックネームやアドレスの変更も可能です。 | 他のユーザーの詳細ページです。そのユーザーの登録した日記・まとめ・ブックマーク一覧に加え、フォローボタンを設置しました。 |


# 使用技術
| Category | TechnologyStack | 
| --- | --- | 
| Frontend | TypeScript, Next.js, TailwindCSS |
| Backend | TypeScript, Next.js, Prisma |
| Infrastructure | Vercel, Supabase |
| Database | PostgreSQL | 
| Design | Figma |
| etc. | Git, GitHub |

# システム構成図

# ER図

# 今後の展望

