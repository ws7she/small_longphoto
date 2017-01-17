//index.js
//获取应用实例
var app = getApp();
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

