//index.js
//获取应用实例
// var wxAuto = require('js/wxAutoImageCal.js')
var app = getApp();
var fontHeight, startX, startY, endX, endY, moveX, moveY;
var key = false;
var ctx = wx.createCanvasContext('canva')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    imgStatus: "none",
    index: {
      status: "block"
    },
    canvas: {
      status: "none",
      url: ""
    },
    easy: {
      status: "none",
      fontVal: '',
      fontColor: '#333',
      fontStyle: 'static',
      fontSize: '14px',
      textAlign: 'left',
      textUnderline: 'none',
      btnPos:'125'
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
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });
  },
  tapEasy: function () {
    this.setData({
      easy: { status: "block" },
      index: { status: "none" }
    })
  },
  tapComplex: function () {
    this.setData({
      complex: { status: "block" },
      index: { status: "none" }
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
            ctx.save();
            ctx.drawImage(picUrl, 0, 0, windowWidth, picHeight)
            ctx.restore();
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
  },
  // textarea自适应
  textAdjust: function (e) {
    fontHeight = e.detail.height + 14;
  },
  // canvas生成
  makePic: function () {
    ctx.draw();
    var _this = this;
    var imgUrl;
    this.setData({
      canvas: { status: "block" },
      easy: { status: "none" }
    });
    wx.canvasToTempFilePath({
      canvasId: 'canva',
      success(res) {
        // imgUrl = res.tempFilePath;
        console.log(res.tempFilePath);
        // _this.setData({
        //   canvas: { url: imgUrl }
        // })
      }
    });
  },
  fontStart: function (e) {
    var touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    key = true;
  },
  fontMove: function (e) {
    if (key) {
      var touch = e.touches[0];
      endX = touch.clientX;
      endY = touch.clientY;
      var disX = endX - endY;
      if( disX > 0 && disX < 30) {

      }
      key = false;
    }
  }
})
