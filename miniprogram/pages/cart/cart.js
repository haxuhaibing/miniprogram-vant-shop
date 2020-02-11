//cart.js
const app = getApp()
const $http = require('../../unit/http')
Page({
  data: {
    cartList: [],
    checkedList: [],
    totalPrice: 0
  },
  onLoad: function() {
    $http.get('/shopping-cart/info')
      .then(response => {
        let data = response.data.items;
        this.setData({
          cartList: data
        })
      })
  },
  onChecked(event) {
    this.setData({
      checkedList: event.detail
    });
  }

})
