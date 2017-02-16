// pages/easy/easy.js
var fontHeight, startX, endX, pos;
var fontSize = 16, fontColor = "#333333", textAlign = "left", fontUnder = "normal", fontBold = "normal", fontItalic = "normal", key = false;
Page({
  data: {
    easy: {
      fontVal: "",
    },
    listAll: [],
    fontHeight: '16',
    focus: false
  },
  easyFocus: function () {
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
    var height, windowWidth, originalHeight, originalWidth, picUrl;
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
            height = (windowWidth * originalHeight) / originalWidth;
            _this.data.listAll.push({
              type: "picture",
              url: picUrl,
              windowWidth: windowWidth,
              height: height,
              left: 0,
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
      var obj = e.detail;
      obj.type = "font";
      obj.value = e.detail.value;
      obj.height = fontHeight;
      obj.top = e.currentTarget.offsetTop + 15;
      obj.left = e.currentTarget.offsetLeft + 7;
      this.data.listAll.push(obj);
      this.setData({
        listAll: this.data.listAll,
        easy: { fontVal: '' }
      });
    }
  },
  // textarea自适应
  textAdjust: function (e) {
    fontHeight = e.detail.height + 13;
    console.log(fontHeight)
    this.setData({
      fontHeight: e.detail.height + 13
    })
  },
  textAdjustTop: function (e) {
    var arr = this.data.listAll;
    var index = e.currentTarget.dataset.index;
    if (arr[index].value != e.detail.value) {
      arr[index].height = e.detail.lineHeight * e.detail.lineCount + 13;
      this.setData({
        listAll: arr
      })
    }
  },
  editFont: function (e) {
    var arr = this.data.listAll;
    var index = e.currentTarget.dataset.index;
    if (arr[index].value != e.detail.value) {
      arr[index].value = e.detail.value;
      this.setData({
        listAll: arr
      })
    }
  },
  // 图片位置
  picPos: function (e) {
    var arr = this.data.listAll;
    var index = e.currentTarget.dataset.index;
    var picTop = e.currentTarget.offsetTop;
    arr[index].top = picTop;
    console.log(picTop)
    this.setData({
      listAll: arr
    });
  },
  // canvas生成
  makePic: function () {
    wx.navigateTo({ url: '../canvas/canvas?list=' + JSON.stringify(this.data.listAll) });
  }
})