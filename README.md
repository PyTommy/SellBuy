# SellBuy

## アプリ概要
ユーザー同士がモノの売買を行うためのアプリケーションです。フロントエンドにはReactを用い、バックエンドにはExpress.jsやMongoDBを用いました。

[Link to Heroku]("https://sellbuy.herokuapp.com/products")

## 作成の動機
私は国際生比率が約50%の別府にある大学に通っていました。その大学では、学生同士のモノの売買が盛んであり、そのためのツールはフェイスブックの売買グループでした。<br>
私もその売買グループを使用したことがあるのですが、カテゴリー別に検索できなかったり、「SOLD OUT」の表示を手動操作しなければいけなかったりと、不便だなと感じていました。また、国際生はメルカリといった日本のフリマアプリをあまり使用していませんでした。<br>
そこで、**「Facebookの売買グループより便利な英語で使えるフリマアプリをまずは大学周辺地域で流行らす！！」**ということを目標にSellBuyの開発に取り組み始めました。<br>

## 使用技術
- Scss
- React 16
- Redux
- Express.js
- MongoDB

## 機能紹介


## 課題点

<img src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/sellbuyBig.JPG"  />

## Images
<p align="center">
<img width="300px" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/sellbuyMobile.JPG"  />
  <img width="300px" src="https://github.com/PyTommy/SellBuy/blob/readmeImages/readmeImages/sellbuySell.JPG"  />
</p>


## Features
- Responsive design.
- **Login / Signup**.
- Automatically logged in as long as **web token** is still valid.
- Updating user profile(username, email, password, avatar).
- **Image upload** (Saved as binary data on mongoDB)
- **CRUD** operations for products.
- Filtering products by text or category.
- Comment.
- Like.
- Messaging (HTTP).
- Nortification (HTTP)
  + Commenting on a product triggers sending notification to product  owner and the others who commented on the same product.
  + Purchasing or cancelling a product triggers sending notification to  product owner.
  + Rejecting a purchase triggers sending notification to the purchaser.

## Technologies
- Sass
- React & Hooks
- Redux
- Express.js
- MongoDB
- Jest (some routes of REST API)
