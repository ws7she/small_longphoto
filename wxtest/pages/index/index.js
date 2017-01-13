//index.js
//获取应用实例
// var wxAuto = require('js/wxAutoImageCal.js')
var app = getApp();
var fontHeight;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    easy: {
      status: "none",
      fontVal: ''
    },
    complex: {
      status: "none",
    },
    piclist: [],
    fontlist: [],
    listAll: [],
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  tapEasy: function () {
    this.setData({
      easy: { status: "block" }
    })
  },
  tapComplex: function () {
    this.setData({
      complex: { status: "block" }
    })
  },
  // 选择图片
  chooseImage: function () {
    var _this = this;
    var picHeight, windowWidth, originalHeight, originalWidth, picUrl;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.getSystemInfo({
          success: function (res) {
            windowWidth = res.windowWidth;
          }
        });
        picUrl = res.tempFilePaths[0];
        wx.getImageInfo({
          src: picUrl,
          success: function (res) {
            originalWidth = res.width;//图片原始宽  
            originalHeight = res.height;//图片原始高 
            picHeight = (windowWidth * originalHeight) / originalWidth;
            _this.data.listAll.push({
              type: "picture",
              detail: {
                url: picUrl,
                picHeight: picHeight
              }
            })
            _this.setData({
              listAll: _this.data.listAll
            });
          }
        });
      }
    });
  },
  // 插入文字
  chooseFont: function (e) {
    if (e.detail.value.length != 0) {
      this.data.listAll.push({
        type: "font",
        detail: {
          value: e.detail.value,
          fontHeight: fontHeight
        }
      });
      this.setData({
        listAll: this.data.listAll,
        easy: { fontVal: '' }
      });
    }
    console.log(this.data.listAll)
  },
  // textarea自适应
  textAdjust: function (e) {
    fontHeight = e.detail.height + 14;
    console.log(fontHeight)
  }
  // canvas生成
})
