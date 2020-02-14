//index.js
const app = getApp()
const $http = require('../../unit/http')
Page({
  data: {
    bannerList: [],
    kanjiaList: [],
    pintuanList: [],
    goodsList: [],
    miaoshaList: []
  },
  onLoad: function() {
    //获取banner
    $http.get('/banner/list')
      .then(response => {
        this.setData({
          bannerList: response.data
        })
      })
    //获取banner
    $http.post('/shop/goods/list')
      .then(response => {
        console.log(response)
        let allList = response.data
        this.setData({
          miaoshaList: allList.filter(item => item.miaosha),
          kanjiaList: allList.filter(item => item.kanjia && !item.pingtuan),
          pintuanList: allList.filter(item => item.pingtuan),
          goodsList: allList.filter(item => !item.kanjia && !item.pingtuan)
        })
      })
  }

})
