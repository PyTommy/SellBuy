# SellBuy
<img width="100%" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/homeBig.JPG"  />

## アプリ概要
ユーザー同士がモノの売買を行うためのアプリケーションです。<br>
フロントエンドにはReactを用い、バックエンドにはExpress.jsやMongoDBを用いました。

[Link to Heroku](https://sellbuy.herokuapp.com/products)

<br>



## 作成の動機
私は国際生比率が約50%の別府にある大学に通っていました。その大学では、学生同士のモノの売買が盛んであり、そのためのツールはフェイスブックの売買グループでした。<br>
私もその売買グループを使用したことがあるのですが、カテゴリー別に検索できなかったり、「SOLD OUT」の表示を手動操作しなければいけなかったりと、不便だなと感じていました。また、国際生はメルカリといった日本のフリマアプリをあまり使用していませんでした。<br>
そこで、**「Facebookの売買グループより便利な英語で使えるフリマアプリをまずは大学周辺地域で流行らす！！」**ということを目標にSellBuyの開発に取り組み始めました。<br>


<br>


## 使用技術
- Scss
- React 16
- Redux
- Express.js
- MongoDB


<br>


## 機能紹介

### 認証ページ
<p align="center">
  <img width="300px" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/signup.JPG"  />
  <img width="300px" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/login.JPG"  />
</p>
<br>

[jsonwebtoken]("https://github.com/auth0/node-jsonwebtoken")や[bcryptjs]('https://www.npmjs.com/package/bcryptjs')を用いて、ユーザー認証機能を作りました。

<br>

<br>

### 商品検索ページ
<p align="center">
  <img width="300px" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/home.JPG"  />
   <img width="300px" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/search.JPG"  />
</p>

<br>

カテゴリーや検索ワードを指定し、商品を閲覧することができます。
また、[react-infinite-scroller](https://www.npmjs.com/package/react-infinite-scroller)を用いて無限スクロール、[rmc-pull-to-refresh](https://www.npmjs.com/package/rmc-pull-to-refresh)を用いてPull to Refreshを導入しています。


<br>

### 商品詳細ページ
<p align="center">
  <img width="300px" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/detailAuth.JPG"  />
  <img width="300px" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/comment.JPG"  />
</p>

<br>

このページでは、<br>

- 商品の購入
- 購入のキャンセル（購入者のみ）
- 購入の拒否 (出品者のみ)
- 商品編集画面への移動 (出品者のみ)
- 商品の削除 (出品者のみ)
- 出品者や購入者のプロフィールへ移動
- Like
- コメント

が出来ます。


<br>

### プロフィールページ
<p align="center">
  <img width="300px" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/userProgile.JPG"  />
</p>

<br>

このページから、

- 対象ユーザーへのメッセージ送信フォーム画面への移動
- 対象ユーザーのFacebookページへの移動 (登録されていない場合、非表示)
- 対象ユーザーの出品物の閲覧

が可能です。

<br>

### 商品販売フォーム
<p align="center">
  <img width="300px" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/sell.JPG"  />
  <img width="300px" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/sell2.JPG"  />
</p>

<br>

このページから、商品を出品することができます。
[react-dropzone](https://www.npmjs.com/package/react-dropzone)を使い、パソコンのファイルをドロップできるようにしました。また、クロッピングのために、[react-image-crop](https://www.npmjs.com/package/react-image-crop)というライブラリを使用しました。
<br>
バックエンドでは、[sharp](https://www.npmjs.com/package/sharp)を用いて、resizing、jpeg化、バイナリーデータ化を行い、mongoDBに画像データを保存しています。

<br>


### マイプロダクトページ
<p align="center">
  <img width="300px" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/mylist.JPG"  />
</p>

- Likeした商品
- 購入した商品
- 出品中の商品

を閲覧することができます。


<br>

### 通知ページ
<p align="center">
  <img width="300px" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/notification.JPG"  />
</p>

自分への通知を確認し、関連する商品の詳細ページへ移動することができます。<br>
通知は、以下の条件で特定のユーザーに送信されます
  + コメント =>「出品者」&&「他にその商品にコメントした人」
  + 商品の購入またはキャンセル => 「出品者」
  + 購入の拒否 => 「購入者」

<br>

<br>

### Inboxページ
<p align="center">
  <img width="300px" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/inbox.JPG"  />
    <img width="300px" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/reply.JPG"  />
</p>

<br>

受信または送信したメッセージを閲覧することができます。また、送信者へ返信することも出来ます。

<br>

### マイページ
<p align="center">
  <img width="300px" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/mypage.JPG"  />
</p>

ユーザーネーム、プロファイル画像、メールアドレス、パスワードの変更やログアウトすることができます。