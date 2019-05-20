function PlaceDB() {
  this.init(name);
};

PlaceDB.prototype = {
  init: function() {
    this._name = "PlaceDB";
    this._db = window.openDatabase(this._name, "1.0", this._name, 100);
  },

  errorCallBack: function(err) {
    console.warn("Error occured while executing SQL: " + err.code);
  },

  // プロンプトから地名を取得する
  getNameFromPrompt: function(tx, results) {
    var name = prompt("この地点の名前を入力してください");
    if (name == null) {
      throw "No Name Error."
    }
    return name;
  },

  // 地図の中心点と地名を取得し
  // データベースに登録
  register: function(gm) {
    alert("この地点を登録します");
    var latlng = gm.map.getCenter();
    console.log("lat: " + latlng.lat());
    console.log("lng: " + latlng.lng());
    this._db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS '+ this._name + ' (id unique, name, lat, lng)');
      tx.executeSql('SELECT * FROM ' + this._name, [], function(tx, results) {
        var len = results.rows.length;
        var name = PlaceDB.prototype.getNameFromPrompt();
        tx.executeSql('INSERT INTO ' + this._name + ' (id, name, lat, lng) VALUES (?, ?, ?, ?)',
          [len + 1, name, latlng.lat(), latlng.lng()]);
      }, this.errorCallBack);
    }, this.errorCallBack);
  },

  // データベースから登録地を取得し genList に渡す
  show: function() {
    this._db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS NameTable (id unique, name, lat, lng)');
      tx.executeSql('SELECT * FROM ' + this._name, [], PlaceDB.prototype.genList, this.errorCallBack);
    }, this.errorCallBack);
  },

  // データベースから取得した登録地を
  // HTML形式に変換して表示
  genList: function(tx, results) {
    var field = document.getElementById("placelist");
    var len = results.rows.length;
    console.log("data num = " + len);
    var htmlText = "";
    for (var i = 0; i < len; ++i) {
      htmlText +=
        '<div style="border: solid 3px lavender; margin: 10px; padding-left: 10%; float: center;">' +
        '　地点名: ' + results.rows.item(i).name + '<br>' +
        '　緯度: ' + results.rows.item(i).lat + '<br>' +
        '　経度: '+ results.rows.item(i).lng + '<br>' +
        '</div>';
    }
    field.innerHTML = htmlText;
  },

  // 表示した登録地リストを隠す
  // 使ってない
  hideList: function() {
    var field = document.getElementById("placelist");
    field.innerHTML = "<br>";
  },

  // 登録地から選ぶときに
  // データベースから登録地を取得し
  // セレクトボックスを生成し表示
  genSelectBox: function(pointName, onChangeFunc) {
    this._db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS NameTable (id unique, name, lat, lng)');
      tx.executeSql('SELECT * FROM ' + this._name, [], function(tx, results) {
        var field = document.getElementById(pointName + "pointselector");
        var len = results.rows.length;
        console.log("data num: " + len);
        var htmlText =
          '<div id="' + pointName + 'pointselector">' +
          '<form name="' + pointName + 'pointform">' +
          '<select name="' + pointName + 'point" required="true" onChange="' + onChangeFunc + '()" class="form-control input-lg">' +
          '<option value="" >選択してください</option>';
        for (var i = 0; i < len; ++i) {
          var pos = results.rows.item(i).lat + "," +  results.rows.item(i).lng;
          htmlText += '<option value="' + pos + '">' + results.rows.item(i).name + '</option>';
        }
        htmlText += '</select></form></div><br>'
        field.innerHTML = htmlText;
      }, this.errorCallBack);
    }, this.errorCallBack);
  }
};
