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
|<img src="https://github.com/user-attachments/assets/057cb08b-d21d-4f6a-9790-e090ecb62a60" /> | <img src="https://github.com/user-attachments/assets/83c27171-367d-402e-859c-4aed94b7bb9b"  /> |
| トップページ(/)をLPにし、アプリケーションの内容が分かるようにしました。| Supabase Authを用いてユーザー登録機能を実装しました。<ユーザー登録後は、愛犬情報も紐づけて登録できるように実装しています。 |

| ログイン画面 | ダッシュボード画面 |
| --- | --- |
|<img src="https://github.com/user-attachments/assets/8a624b52-3d57-4092-9627-035574d2474a" /> | <img src="https://github.com/user-attachments/assets/00654836-0a47-429c-9ff5-957c5fc08a1f"/> |
| アドレスとパスワードでの認証機能を実装しました。 | 愛犬の基本情報やログイン日に行うお世話の記録の一覧が確認できます。体重変動が可視化されるようにグラフ表示を実装しました。 |

| お世話記録の登録画面 | お世話記録の詳細画面 |
| --- | --- |
|<img src="https://github.com/user-attachments/assets/fd883dc5-2b80-47e0-a934-e21acd6db386"/>| <img src="https://github.com/user-attachments/assets/e263b117-8c3b-4167-a529-79345e316632"/> |
| お世話のカテゴリーを選択するとモーダルが開き、テキストや画像で記録を取れるように実装しました。 | 登録したお世話記録は詳細ページで確認できます。このページから記録の編集・削除ができるよう実装しました。 |

| カレンダー画面 | 日記登録画面 |
| --- | --- |
|<img src="https://github.com/user-attachments/assets/2befddac-7ab7-46a6-81e1-b49d34acfbd3"  /> | <img src="https://github.com/user-attachments/assets/1a3bb26f-9a51-42e1-8f44-2297aac5ea55"  /> |
| 登録したお世話ログをカレンダー形式で確認できます。日付をクリックすると該当日の記録一覧が表示されるように実装しました。 | タグづけや画像を使って、闘病日記や異変の詳細な記録を残せるように日記投稿機能を実装しました。 |

| まとめ登録画面 | 日記・まとめ一覧画面 |
| --- | --- |
|<img src="https://github.com/user-attachments/assets/ba29af3b-d04f-41a8-8947-2eb8a09ba23f"  /> | <img src="https://github.com/user-attachments/assets/16a8ed25-bc86-4a83-9355-66ed536291ed"  /> |
| 作成した日記を1つのファイルに集約できるような「まとめ」機能を作成しました。作成時に紐付けしたい日記選択ができます。 | 登録した記録・まとめの一覧表示画面です。投稿記事をクリックすると詳細ページに遷移できるように実装しました。 |

| 日記詳細画面 | まとめ詳細画面 |
| --- | --- |
|<img src="https://github.com/user-attachments/assets/90e2e3b1-75da-40b5-b5eb-a402c00df8d2"/> | <img src="https://github.com/user-attachments/assets/1e1d5fd5-a7c7-4c75-bfa0-4435fa931d3e" /> |
| 登録した日記の詳細画面です。投稿者はこのページから日記の編集・削除ができるように実施しました。また、日記のお気に入り登録やコメント登録もできるように実装しました。 | 登録したまとめの詳細画面です。このまとめに紐づいている日記の一覧が確認できます。各日記をクリックすると日記の詳細ページに遷移するよう実装しました。 |

| コメント投稿画面 | 検索画面 |
| --- | --- |
|<img src="https://github.com/user-attachments/assets/d67937d0-3187-4666-9965-5f2afce601a0" /> | <img src="https://github.com/user-attachments/assets/53673e43-4fbb-4a99-9539-549dd7cf66ea"/> |
| 日記の詳細画面にて「コメント投稿する」ボタンをクリックすると、コメントを投稿できるように実装しました。 | 検索ウィンドウにキーワードを入力するとサジェストが表示されるように実装しました。入力したキーワードに紐づく日記、まとめが検索できます。 |

| マイページ画面 | ユーザー詳細画面 |
| --- | --- |
|<img src="https://github.com/user-attachments/assets/318949ac-6abf-4d23-8648-8c73961981c1"/> | <img src="https://github.com/user-attachments/assets/b66204ae-47d9-4a37-a7fd-b47ef6bf276f"  /> |
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

