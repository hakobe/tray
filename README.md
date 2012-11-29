# tray

tray はドラッグアンドドロップでアップロードした画像が12枚のパネルに表示される、お手軽な画像アップローダです。

![画面の例](https://raw.github.com/hakobe/tray/master/README/tray_img1.png)

## 特徴
- 画像を12枚のパネルに表示
- ドラッグアンドドロップによる画像のアップロード
- リアルタイムでのパネルの同期
- アップロードの仕方を工夫して楽しめる

## インストールと実行
```sh
$ brew install node
$ brew install redis

$ git clone https://github.com/hakobe/tray.git
$ cd tray
$ npm install
$ node app.js
```

## 画面の例
### いつも最新の12個だけを保持
![画面の例](https://raw.github.com/hakobe/tray/master/README/tray_img1.png)

### 無地の色画像をうめてみる
![画面の例](https://raw.github.com/hakobe/tray/master/README/tray_img3.png)

### 1つの画像を12個に分割して工夫すると..
![画面の例](https://raw.github.com/hakobe/tray/master/README/tray_img2.png)
