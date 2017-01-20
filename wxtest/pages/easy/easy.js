// pages/easy/easy.js
var fontHeight, startX, endX, pos;
var fontSize = 16, fontColor = "#333333", textAlign = "left", fontUnder = "normal", fontBold = "normal", fontItalic = "normal", key = false;
Page({
  data: {
    easy: {
      fontVal: "",
    },
    listAll: [],
    fontHeight : '16',
    focus:false
  },
  easyFocus:function() {
    this.setData({
      focus: true
    })
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
    this.setData({
      fontHeight :　e.detail.height + 16
    })
  },
  // canvas生成
  makePic: function () {
    wx.navigateTo({ url: '../canvas/canvas?list=' + JSON.stringify(this.data.listAll) });
  }
})