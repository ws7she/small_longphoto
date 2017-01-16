//index.js
//获取应用实例
// var wxAuto = require('js/wxAutoImageCal.js')
var app = getApp();
var fontHeight, startX, endX, moveX, pos;
var key = false;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    imgStatus: "none",
    index: {
      status: "block"
    },
    url: "",
    canvas: {
      status: "none",
      url: ""
    },
    easy: {
      status: "none",
      fontVal: "",
      btnPos: "140",
      fontColor: "#333",
      fontStyle: "static",
      fontSize: "14px",
      textAlign: "left",
      textUnderline: "none",
    },
    complex: {
      status: "none",
    },
    font: {
      btnPos: "125",
      numPos: "135",
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
    var ctx = wx.createCanvasContext('haha')
    ctx.setFillStyle('red');
    ctx.fillRect(10, 10, 150, 75);
    ctx.draw();
  },
  save: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'haha',
      success: function success(res) {
        that.setData({
          url: res.tempFilePath
        })
        wx.getSavedFileList({
          success: function (res) {
            console.log(res.fileList)
          }
        })
      },
      complete: function complete(res) {
        console.log(res);
      },
      fail: function fail(res) {
        console.log("error");
      }
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
      easy: { status: "none" }
    });
    wx.canvasToTempFilePath({
      canvasId: 'canva',
      success(res) {
        imgUrl = res.tempFilePath;
        console.log(res.tempFilePath);
        _this.setData({
          'canvas.status': "block",
          'canvas.url': imgUrl
        })
      }
    });
  },
  fontStart: function (e) {
    var touch = e.touches[0];
    startX = touch.clientX;
    pos = parseInt(this.data.font.btnPos);
    key = true;
  },
  fontMove: function (e) {
    if (key) {
      var touch = e.touches[0];
      endX = parseInt(touch.clientX);
      var disX = parseInt(endX - startX) + pos;
      if (disX > 0 && disX < 300) {
        this.setData({
          'font.btnPos': disX,
          'font.numPos': disX + 10
        })
      }
    }
  },
  fontEnd: function () {
    key = false;
  }
})
