function TimeManager() {
  this.init();
}

TimeManager.prototype = {
  init: function() {
    this.defaultSpeed = {
      walk: 1.2,
      jog:  2.5,
      run:  5.0
    };
    this.remainingTime = 0;
    this.addTime = 0;
  },

  // フォームから移動速度を取得する
  // だがしかし使ってない
  changeSpeedPara: function() {
    var param = document.forms['speedparaform'].speedpara.value;
    this.defaultSpeed.walk = param;
    console.log(this.defaultSpeed.walk);
  },

  // 現在時刻を文字列形式にして出力
  getCurrentTime: function() {
    var date = new Date();
    return date.getHours() + ":" + ("0"+(date.getMinutes())).slice(-2);
  },

  // 目標時刻をフォームから取得し
  // Dateオブジェクトに変換する
  getTargetTime: function() {
    var date = new Date();
    var form = document.forms['target_time_form']
    var target_date = form.target_date.value;
    var target_time = form.target_time.value;
    console.log(target_date);
    td = target_date.split("-");
    tmp = target_time.split(":");
    return new Date(td[0], td[1]-1, td[2], tmp[0], tmp[1]);
  },

  // 出発時刻（~分後）が変更されたときに
  // フォームから値を取り出して
  // 残り時間を再計算する
  addStartTime: function() {
    this.addTime = document.forms['start_time_form'].start_time.value;
    console.log(this.addTime);
    this.calcRemainingTime();
  },

  // 残り時間[秒]を計算する
  calcRemainingTime: function() {
    var startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() + this.addTime);
    console.log(this.getTargetTime().getMinutes());
    console.log(startDate.getMinutes());
    this.remainingTime = (this.getTargetTime().getTime() - startDate.getTime()) / 1000;
  },

  // 目標時刻のデフォルトの値をフォームに埋め込む
  // 大半がHTMLが解釈できるフォーマットへの変換
  setDefaultTargetTime: function() {
    var currentDate = new Date();
    var y0 = ("0000" + (currentDate.getFullYear())).slice(-4);
    var m0 = ("00"   + (currentDate.getMonth() + 1)).slice(-2);
    var d0 = ("00"   + (currentDate.getDate())).slice(-2);
    var dateString = y0 + '-' + m0 + '-' + d0;
    var timeString = this.getCurrentTime();
    var form = document.forms['target_time_form'];
    form.target_date.value = dateString;
    form.target_time.value = timeString;        
  }
};
