//index.js
const app = getApp()

Page({
  data: {
    bannerList: [],
    kanjiaList: [],
    pintuanList: [],
    goodsList: [],
    miaoshaList:[]
  },
  onLoad: function() {
    //获取banner
    wx.request({
      url: 'https://api.it120.cc/xiaochengxu/banner/list',
      success: (res) => {
        this.setData({
          bannerList: res.data.data
        })
      }
    })
    //获取banner
    wx.request({
      url: 'https://api.it120.cc/xiaochengxu/shop/goods/list',
      success: (res) => {
        let allList = res.data.data
        this.setData({
          miaoshaList:allList.filter(item => item.miaosha),
          kanjiaList: allList.filter(item => item.kanjia && !item.pingtuan),
          pintuanList: allList.filter(item => item.pingtuan),
          goodsList: allList.filter(item => !item.kanjia && !item.pingtuan)
        })
      }
    })
  }

})
