// pages/canvas/canvas.js
var ctx = wx.createCanvasContext('myCanvas');
Page({
  data: {
    actionSheetHidden: true,
    list: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(JSON.parse(options.list))
    this.setData({
      list: JSON.parse(options.list)
    })
    var listAll = this.data.list
    console.log(this.data.list)
    for (var i in listAll) {
      if (listAll[i].type == "picture") {
        ctx.save();
        ctx.drawImage(listAll[i].detail.url, listAll[i].detail.left, listAll[i].detail.top, listAll[i].detail.windowWidth, listAll[i].detail.picHeight)
        ctx.restore();
      } else if(listAll[i].type == "font") {
        ctx.setFillStyle(listAll[i].detail.fontColor);
        ctx.fillText(listAll[i].detail.value, listAll[i].detail.left, listAll[i].detail.top);
      }
    }
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
  }
})