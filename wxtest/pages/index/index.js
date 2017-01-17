//index.js
//获取应用实例
var app = getApp();
var ctx = wx.createCanvasContext('myCanvas');
var fontHeight, startX, endX, pos, fontSize, fontColor, textAlign, textUnder;
var key = false;
Page({
  data: {
    actionSheetHidden: true,
    motto: 'Hello World',
    userInfo: {},
    imgStatus: "none",
    index: {
      status: "block"
    },
    url: "",
    canvas: {
      status: "-1",
      url: ""
    },
    easy: {
      status: "none",
      fontVal: "",
      btnPos: "140"
    },
    complex: {
      status: "none",
    },
    font: {
      btnPos: "125",
      numPos: "135",
    },
    colorList:["#333333", "#999999", "#fe4365", "#fc9d9a", "#c8c8a9", "#83af98"],
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
  save: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function success(res) {
        var img = res.tempFilePath;
        console.log(img)
        wx.downloadFile({
          url: img,
          type: 'image',
          success: function (res) {
            wx.saveFile({
              tempFilePath: res.tempFilePath,
              success: function success(res) {
                console.log(res)
              },
              fail: function fail(res) {
                console.log(res)
              }
            });
          },
          fail: function fail(res) {
            console.log(res)
          }
        });
      },
      fail: function fail(res) {
        console.log(res)
      }
    })
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
  chooseImage: function (e) {
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
            var left = e.currentTarget.offsetLeft;
            var top = e.currentTarget.offsetTop;
            console.log(e.currentTarget);
            ctx.save();
            ctx.drawImage(picUrl, left, top, windowWidth, picHeight)
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
      var top = e.currentTarget.offsetTop;
      var left = e.currentTarget.offsetLeft + 7;
      this.data.listAll.push({
        type: "font",
        detail: {
          value: e.detail.value,
          fontHeight: fontHeight,
          fontColor:fontColor,
          fontSize:fontSize,
          textAlign:textAlign,
          textUnder:textUnder
        }
      });
      console.log("font" + left, top);
      ctx.setFillStyle(fontColor);
      ctx.fillText(e.detail.value, left, top);
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
  // 选择颜色
  chooseColor:function(e) {
    fontColor = e.currentTarget.dataset.color
    console.log(fontColor)
  },
  // canvas生成
  makePic: function () {
    ctx.draw();
    var _this = this;
    var imgUrl;
    this.setData({
      'easy.status': 'none',
      'canvas.status': "2",
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
  },
  listenerButton: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },

  listenerActionSheet: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  }
})

