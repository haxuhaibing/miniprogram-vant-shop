//cart.js
const app = getApp()
const $http = require('../../unit/http')
Page({
  data: {
    bannerList: [],
    basicInfo: [],
    content: ''
  },
  onLoad: function(options) {
    $http.get('/shop/goods/detail', {
        id: options.id
      })
      .then(response => {
        if (response.code == 0) {
          this.setData({
            bannerList: response.data.pics,
            basicInfo: response.data.basicInfo,
            content: response.data.content
          })
        }

      })
  }

})
