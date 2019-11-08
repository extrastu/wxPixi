
const moment = require('../../utils/moment.js');
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
    index: 0,
    date: moment(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 2).getTime()).format('l'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPixi();
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
    }
    this.getPixi()
  },

  getPixi: function () {
    let that = this;
    let {
      page,
      images,
      suggests,
      index,
      picker, date
    } = that.data
    wx.showLoading({
      title: 'loading',
    });
    wx.vibrateShort()
    wx.request({
      url: 'https://api.pixivic.com/ranks?date=' + date + '&page=' + page + '&mode=' + picker[index] + '&pageSize=10&from=extrastu',
      success(res) {
        wx.hideLoading();
        page = page + 1;
        images = images.concat(res.data.data.data);
        suggests = []
        that.setData({
          images,
          page,
          suggests
        })
      }
    })
  },
  preview(e) {
    let url = e.currentTarget.dataset.src;
    let index = e.currentTarget.dataset.index;
    let ImageLinkArray = [];
    let arr = [];
    for (let a of this.data.images[index].imageUrls) {
      ImageLinkArray.push(a.large)
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
      this.getSearchSuggest()
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
      images
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
})