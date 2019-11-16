
const moment = require('../../utils/moment.js');
const app = getApp();
moment.locale('en', {
  longDateFormat: {
    l: "YYYY-MM-DD",
    L: "YYYY-MM-DD HH:mm"
  }
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    page: 1,
    searchText: '',
    suggests: [],
    picker: ['day', 'week', 'month'],
    PhotoPicker: ['squareMedium', 'medium', 'large', 'original'],
    index: 0,
    photoIndex: 1,
    date: moment(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 2).getTime()).format('l'),
    photoQuality: app.globalData.photoQuality,
    floorstatus: false,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    model: app.globalData.model,
    skinStyle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qq.showNavigationBarLoading();
    let that = this;
    let today = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"); //创建星期数组
    let day = today[new Date().getDay()];
    that.setData({
      day
    }, () => {
      that.getPixi();
    })
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
      wx.setBackgroundColor({
        backgroundColor: '#000000'
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
      wx.setBackgroundColor({
        backgroundColor: '#ffffff', // 窗口的背景色为白色
      })
      qq.setTabBarStyle({
        backgroundColor: '#ffffff',
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let {
      searchText
    } = this.data;
    if (searchText) {
      return this.seachByKeyword()
    };
    wx.vibrateShort();
    this.getPixi()
  },

  getPixi: function (isPull) {
    let that = this;
    let {
      page,
      images,
      suggests,
      index,
      picker, date, model
    } = that.data
    wx.request({
      url: 'https://api.pixivic.com/ranks?date=' + date + '&page=' + page + '&mode=' + model + '&pageSize=10&from=extrastu',
      success(res) {
        qq.hideNavigationBarLoading();
        page = page + 1;
        images = images.concat(res.data.data.data);
        suggests = []
        that.setData({
          images,
          page,
          suggests
        })
        if (isPull) {
          qq.stopPullDownRefresh();
        }
      }
    })
  },
  preview(e) {
    wx.vibrateShort();
    let url = e.currentTarget.dataset.src;
    let index = e.currentTarget.dataset.index;
    let ImageLinkArray = [];
    let arr = [];
    let { photoQuality } = this.data;
    for (let a of this.data.images[index].imageUrls) {
      ImageLinkArray.push(a[photoQuality])
    }

    for (let i of ImageLinkArray) {
      let a = this.urlReplace(i);
      arr.push(a)
    }
    wx.previewImage({
      current: url,
      urls: arr,
      fail: function () {
        console.log('fail')
      },
      complete: function () {
        console.info("点击图片了");
      },
    })
  },
  textInput(e) {
    this.setData({
      searchText: e.detail.value,
    }, () => {
      if (e.detail.value) {
        this.getSearchSuggest()
      } else {
        this.getPixi()
      }
    })
  },
  searchByClick: function () {
    let {
      searchText
    } = this.data;
    this.setData({
      images: [],
      page: 1
    }, () => {
      if (searchText) {
        return this.seachByKeyword()
      }
      this.getPixi();
    })
  },
  seachByKeyword: function () {
    let that = this;
    let {
      searchText,
      page,
      images,
      model
    } = that.data;
    wx.showLoading({
      title: 'loading',
    });
    wx.vibrateShort();
    wx.request({
      url: 'https://api.pixivic.com/illustrations?keyword=' + searchText + '&pageSize=10&page=' + page + '&from=extrastu',
      success(res) {
        wx.hideLoading();
        page = page + 1;
        images = images.concat(res.data.data)
        that.setData({
          images,
          page
        })
      }
    })
  },
  getSearchSuggest: function () {
    let that = this;
    let {
      searchText,
      suggests
    } = that.data;
    wx.request({
      url: 'https://api.pixivic.com/keywords/' + searchText + '/suggestions' + '?from=extrastu',
      success(res) {
        console.log(res.data.data);
        that.setData({
          suggests: res.data.data
        })
      }
    })
  },
  setKeyword: function (e) {
    let that = this;
    let {
      searchText,
    } = that.data;
    that.setData({
      searchText: e.currentTarget.dataset.text
    }, () => {
      that.searchByClick()
    })
  },
  urlReplace: function (str) {
    return str.replace('i.pximg.net', 'i.pixiv.cat')
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value,
      images: [],
      page: 1,
      suggests: []
    }, () => {
      this.getPixi()
    })
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value,
      images: [],
      page: 1,
      suggests: []
    }, () => {
      this.getPixi()
    })
  },
  PickerPhotoChange(e) {
    let { PhotoPicker, photoIndex } = this.data;
    this.setData({
      photoIndex: e.detail.value,
      images: [],
      page: 1,
      suggests: [],
      photoQuality: PhotoPicker[e.detail.value]
    }, () => {
      this.getPixi()
    })
  },
  // 监听页面滚动
  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      }, () => {
        qq.setNavigationBarTitle({
          title: 'Pixi'
        })
      });
    } else {
      this.setData({
        floorstatus: false
      }, () => {
        qq.setNavigationBarTitle({
          title: ''
        })
      });
    }
  },
  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    wx.vibrateShort();
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
})