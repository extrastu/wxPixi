// components/backTop/backTop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    baseUrl: {
      type: String,
      default: '../../public/images/top.png'
    }, 
  },

  /**
   * 组件的初始数据
   */
  data: {
    floorstatus:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取滚动条当前位置
    onPageScroll: function (e) {
      console.log(e)
      if (e.scrollTop > 100) {
        this.setData({
          floorstatus: true
        });
      } else {
        this.setData({
          floorstatus: false
        });
      }
    },

    //回到顶部
    goTop: function (e) {  // 一键回到顶部
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
    },
  }
})
