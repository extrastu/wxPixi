//logs.js
const app = getApp();
const util = require('../../utils/util.js')

Page({
  data: {
    picker: ['day', 'week', 'month'],
    PhotoPicker: ['squareMedium', 'medium', 'large', 'original'],
    index: 0,
    photoIndex: 1,
    photoQuality: 'medium',
    skinStyle: "",
    height:app.globalData.DevHeight-app.globalData.CustomBar*2
  },
  onLoad: function () {
    wx.vibrateShort();
    qq.showShareMenu({
      showShareItems: ['qq','qzone', 'wechatFriends','wechatMoment']
    });
  },
  onShow: function () {
    wx.vibrateShort();
    let skinStyle = app.globalData.skin ? app.globalData.skin : '';
    this.setData({
      skinStyle
    })
    if (skinStyle === 'dark') {
      qq.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000000',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
      qq.setTabBarStyle({
        backgroundColor: '#000000',
      })
      qq.setBackgroundColor({
        backgroundColor: '#000000', // 窗口的背景色为白色
      })
    } else {
      qq.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
      qq.setBackgroundColor({
        backgroundColor: '#ffffff', // 窗口的背景色为白色
      })
      qq.setTabBarStyle({
        backgroundColor: '#ffffff',
      })
    }
  },
  PickerChange(e) {
    let { picker, index } = this.data;
    this.setData({
      index: e.detail.value,
    }, () => {
      app.globalData.model = picker[e.detail.value]
    });
  },
  PickerPhotoChange(e) {
    let { PhotoPicker, photoIndex } = this.data;
    this.setData({
      photoIndex: e.detail.value,
      photoQuality: PhotoPicker[e.detail.value]
    }, () => {
      app.globalData.photoQuality = PhotoPicker[e.detail.value]
    })
  },
  switchChange: function (e) {
    var that = this
    var style
    if (e.detail.value == true) {
      app.globalData.skin = "dark"
    } else {
      app.globalData.skin = ""
    }
    that.setData({
      skinStyle: app.globalData.skin
    })
    if (e.detail.value) {
      qq.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000000',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
      qq.setTabBarStyle({
        backgroundColor: '#000000',
      })
    } else {
      qq.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
      qq.setTabBarStyle({
        backgroundColor: '#ffffff',
      })
    }
    //保存到本地
    wx.setStorage({
      key: "skin",
      data: app.globalData.skin
    })
  },
})
