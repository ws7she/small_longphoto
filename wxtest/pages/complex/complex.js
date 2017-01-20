// pages/easy/easy.js
var fontHeight, startX, endX, pos;
var fontSize = 16, fontColor = "#333333", textAlign = "left", fontUnder = "normal", fontBold = "normal", fontItalic = "normal", key = false;
Page({
  data: {
    easy: {
      fontVal: "",
      btnPos: "140"
    },
    font: {
      btnPos: "125",
      numPos: "135",
      fontSize: "16"
    },
    colorList: ["#333333", "#999999", "#fe4365", "#fc9d9a", "#c8c8a9", "#83af98"],
    listAll: [],
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
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
            _this.data.listAll.push({
              type: "picture",
              detail: {
                url: picUrl,
                windowWidth: windowWidth,
                picHeight: picHeight,
                left: left,
                top: top
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
      var top = e.currentTarget.offsetTop + 15;
      var left = e.currentTarget.offsetLeft + 7;
      this.data.listAll.push({
        type: "font",
        detail: {
          value: e.detail.value,
          // fontHeight: fontHeight,
          fontColor: fontColor,
          fontSize: fontSize,
          textAlign: textAlign,
          fontUnder: fontUnder,
          fontItalic: fontItalic,
          fontBold: fontBold,
          left: left,
          top: top
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
  // 选择颜色
  chooseColor: function (e) {
    fontColor = e.currentTarget.dataset.color
    console.log(fontColor)
  },
  // canvas生成
  makePic: function () {
    wx.navigateTo({ url: '../canvas/canvas?list=' + JSON.stringify(this.data.listAll) });
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
        if (disX < 25) {
          fontSize = 10;
          this.setData({
            'font.fontSize': fontSize,
          })
        } else if (disX >= 25 && disX < 75) {
          fontSize = 12;
          this.setData({
            'font.fontSize': fontSize,
          })
        } else if (disX >= 75 && disX < 125) {
          fontSize = 14;
          this.setData({
            'font.fontSize': fontSize,
          })
        } else if (disX >= 125 && disX < 175) {
          fontSize = 16;
          this.setData({
            'font.fontSize': fontSize,
          })
        } else if (disX >= 175 && disX < 225) {
          fontSize = 18;
          this.setData({
            'font.fontSize': fontSize,
          })
        } else if (disX >= 225 && disX < 275) {
          fontSize = 20;
          this.setData({
            'font.fontSize': fontSize,
          })
        } else if (disX >= 275 && disX <= 300) {
          fontSize = 22;
          this.setData({
            'font.fontSize': fontSize,
          })
        }
      }
    }
  },
  fontEnd: function () {
    key = false;
  },
  // 段落左对齐
  alignLeft: function () {
    textAlign = "left";
  },
  // 段落居中对齐
  alignMiddle: function () {
    textAlign = "center";
  },
  // 段落右对齐
  alignRight: function () {
    textAlign = "right";
  },
  // 文字加粗
  textBold: function () {
    fontBold = "bold"
  },
  // 文字倾斜
  textItalic: function () {
    fontItalic = "italic"
  },
  // 文字下划线
  textUnder: function () {
    fontUnder = "underline"
  }
})