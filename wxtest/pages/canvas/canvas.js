// pages/canvas/canvas.js
var ctx = wx.createCanvasContext('myCanvas');
var windowWidth;
Page({
  data: {
    actionSheetHidden: true,
    list: [],
    canvasHei: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.getSystemInfo({
      success: function (res) {
        windowWidth = res.windowWidth;
      }
    });
    this.setData({
      list: JSON.parse(options.list)
    })
    
    var listAll = this.data.list
    var canvasHei = 0;
    for (var i in listAll) {
      canvasHei = listAll[i].height + canvasHei;
      if (listAll[i].type == "picture") {
        ctx.save();
        ctx.drawImage(listAll[i].url, listAll[i].left, listAll[i].top, listAll[i].windowWidth, listAll[i].height)
        ctx.restore();
      } else if (listAll[i].type == "font") {

        ctx.setFontSize(16);
        // ctx.fillText(listAll[i].value, listAll[i].left, listAll[i].top);
        this.canvasTextAutoLine(listAll[i].value, listAll[i].top, 26, 20, 7)
      }
    }
    this.setData({
       canvasHei: canvasHei
    })
    ctx.draw();
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
  listenerButton: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  listenerActionSheet: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  canvasTextAutoLine: function (str, lineHeight, width, height, align) {
    var lineWidth = 0;
    var canvasWidth = windowWidth;
    var lastSubStrIndex = 0;
    for (var i = 0; i < str.length; i++) {
      lineWidth += 16;
      if (lineWidth > canvasWidth) {//减去initX,防止边界出现的问题
        ctx.fillText(str.substring(lastSubStrIndex, i), align, lineHeight);
        lineHeight += height;
        lineWidth = width;
        lastSubStrIndex = i;
      }
      if (i == str.length - 1) {
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), align, lineHeight);
      }
    }
  }
})