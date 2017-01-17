//index.js
//获取应用实例
var app = getApp();
var fontHeight, startX, endX, pos, fontSize, fontColor, textAlign, textUnder;
var key = false;
Page({
  data: {
  },
  tapEasy: function () {
    wx.navigateTo({ url: '../easy/easy'});
  },
  tapComplex: function () {
    wx.navigateTo({ url: '../complex/complex'});
  },

})

