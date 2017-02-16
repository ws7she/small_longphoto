// pages/easy/easy.js
var fontHeight,
  startMoveX, endMoveX, startMoveY, endMoveY,
  indexMove, indexScale, indexSkew,
  startScaleX, endScaleX, startScaleY, endScaleY,
  startSkewX, endSkewX, startSkewY, endSkewY;
var fontColor = "#333333", keyMove = false, keyScale = false, keySkew = false;
Page({
  data: {
    complex: {
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
    lastTapPic: 0,
    lastTapFont: 0,
    coverStatus: "none"
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

  // 选择图片
  chooseImage: function (e) {
    var _this = this, left = 0, top = 0, scaleX = 1, scaleY = 1, skew = 0;
    var picHeight, originalHeight, originalWidth, picUrl;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        picUrl = res.tempFilePaths[0];
        left = left + 10;
        top = top + 10;
        wx.getImageInfo({
          src: picUrl,
          success: function (res) {
            originalWidth = res.width;//图片原始宽  
            originalHeight = res.height;//图片原始高 
            picHeight = (200 * originalHeight) / originalWidth;
            _this.data.listAll.push({
              type: "picture",
              url: picUrl,
              height: picHeight,
              left: left,
              top: top,
              scaleX: scaleX,
              scaleY: scaleY,
              skew: skew
            });
            _this.setData({
              listAll: _this.data.listAll
            });
          }
        });
      }
    });
  },
  // 更换图片
  changePic: function (e) {
    var curTime = e.timeStamp, lastTime = this.data.lastTapPic, _this = this, index = e.currentTarget.dataset.index, arr = this.data.listAll;
    if (lastTime > 0) {
      if (curTime - lastTime < 300) {
        wx.chooseImage({
          count: 1, // 默认9  
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
            arr[index].url = res.tempFilePaths[0];
            wx.getImageInfo({
              src: arr[index].url,
              success: function (res) {
                var originalWidth = res.width;//图片原始宽  
                var originalHeight = res.height;//图片原始高 
                var picHeight = (200 * originalHeight) / originalWidth;
                arr[index].height = picHeight;
                _this.setData({
                  listAll: arr
                })
              }
            });
          }
        })
      }
    }
    this.setData({
      lastTapPic: curTime
    })
  },
  deleteThis: function (e) {
    var index = e.currentTarget.dataset.index, arr = this.data.listAll;
    arr.splice(index, 1);
    this.setData({
      listAll: arr
    })
  },
  // 插入文字 -- 展示图层
  showFont: function (e) {
    this.setData({
      coverStatus: "block"
    });
  },
  // 插入文字 -- 编辑
  fontBlur: function (e) {
    var left = 0, top = 0, scaleX = 1, scaleY = 1,skew = 0;
    if (e.detail.value.length != 0) {
      var obj = e.detail;
      obj.type = "font";
      obj.value = e.detail.value;
      obj.color = fontColor;
      obj.left = left;
      obj.top = top;
      obj.scaleX = scaleX;
       obj.scaleY = scaleY;
      obj.skew = skew;
      this.data.listAll.push(obj);
    }
  },
  chooseFont: function (e) {
    this.setData({
      listAll: this.data.listAll,
      complex: { fontVal: '' },
      coverStatus: "none"
    });
  },
  chooseCancel: function () {
    this.setData({
      complex: { fontVal: '' },
      coverStatus: "none"
    });
  },
  // 选择颜色
  chooseColor: function (e) {
    fontColor = e.currentTarget.dataset.color
  },
  // 修改文字
  changeFont: function (e) {
    var curTime = e.timeStamp, lastTime = this.data.lastTapFont, _this = this, index = e.currentTarget.dataset.index, arr = this.data.listAll;
    if (lastTime > 0) {
      if (curTime - lastTime < 300) {
        this.setData({
          complex: { fontVal: arr[index].value },
          listAll: arr,
          coverStatus: "block"
        });

      }
    }
    this.setData({
      lastTapFont: curTime
    })
  },
  // 移动
  moveStart: function (e) {
    var touch = e.touches[0];
    startMoveX = touch.clientX;
    startMoveY = touch.clientY;
    indexMove = e.currentTarget.dataset.index
    keyMove = true;
  },
  scaleThis: function (e) {
    var touch = e.touches[0];
    startScaleX = touch.clientX;
    startScaleY = touch.clientY;
    indexScale = e.currentTarget.dataset.index
    keyScale = true;
  },
  skewThis: function (e) {
    var touch = e.touches[0];
    startSkewX = touch.clientX;
    startSkewY = touch.clientY;
    indexSkew = e.currentTarget.dataset.index
    keySkew = true;
  },
  moveMove: function (e) {
    var arr = this.data.listAll;
    var touch = e.touches[0];
    if (keyMove && !keyScale && !keySkew) {
      endMoveX = parseFloat(touch.clientX);
      endMoveY = parseFloat(touch.clientY);
      arr[indexMove].left = parseFloat(endMoveX - startMoveX);
      arr[indexMove].top = parseFloat(endMoveY - startMoveY);
      this.setData({
        listAll: arr
      });
    } else if (!keyMove && keyScale && !keySkew) {
      endScaleX = parseFloat(touch.clientX);
      endScaleY = parseFloat(touch.clientY);
      var x = 200, y = arr[indexScale].height;
      arr[indexScale].scaleX = parseFloat(endScaleX - startScaleX) / 200 + 1;
      arr[indexScale].scaleY = parseFloat(endScaleY - startScaleY) / y + 1;
      this.setData({
        listAll: arr
      });
    } else if (!keyMove && !keyScale && keySkew) {
      endSkewX = parseFloat(touch.clientX);
      endSkewY = parseFloat(touch.clientY);
      var a = Math.abs(endSkewX - startSkewX),
        b = Math.abs(endSkewY - startSkewY),
        c = Math.sqrt(a * a + b * b),
        deg = Math.round((Math.asin(b / c) / Math.PI * 180));
      if (startSkewX <= endSkewX && startSkewY <= endSkewY) {
        deg = deg;
      } else if (startSkewX >= endSkewX && startSkewY <= endSkewY) {
        deg = 180 - deg;
      } else if (startSkewX >= endSkewX && startSkewY >= endSkewY) {
        deg = 180 + deg;
      } else if (startSkewX <= endSkewX && startSkewY >= endSkewY) {
        deg = 360 - deg;
      }
      arr[indexSkew].skew = deg;
      this.setData({
        listAll: arr
      });
    }
  },
  moveEnd: function () {
    keyMove = false;
    keyScale = false;
    keySkew = false;
  },
  // canvas生成
  makePic: function () {
    wx.navigateTo({ url: '../canvas/comCanvas?list=' + JSON.stringify(this.data.listAll) });
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
})