// pages/order/order.js
const $http = require('../../unit/http')
Page({
  data: {
    tabs: [{
      title: '全部'
    }, {
      title: '待付款'
    }, {
      title: '待发货'
    }, {
      title: '待收货'
    }, {
      title: '待评价'
    }, {
      title: '已评价'
    }, {
      title: '已关闭'
    }],
    active: 0,
    status: 0,
    goodsMap: [],
    orderList: [],
    filterList: []
  },
  onLoad: function(options) {
    this.setData({
      active: options.active
    })
    let status = this.getStatus(options.active);
    let filter = []
    $http.post('/order/list')
      .then(response => {
        this.setData({
          goodsMap: response.data.goodsMap,
          orderList: response.data.orderList
        })
        if (status == -2) {
          filter = this.data.orderList
        } else {
          filter = this.data.orderList.filter(item => item.status == status)
        }
        this.setData({
          filterList: filter
        })
      })


  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  getStatus(id) {
    let status = -2;
    switch (id) {
      case 0:
        status = -2; //全部
        break;
      case 1:
        status = 0; //待支付
        break;
      case 2:
        status = 1; //已支付待发货
        break;
      case 3:
        status = 2; //已发货待确认
        break;
      case 4:
        status = 3; //确认收货待评价
        break;
      case 5:
        status = 4; //已评价
        break;
      case 6:
        status = -1; //已关闭
        break;
      default:
    }
    return status
  },
  onTabs(event) {
    let status = this.getStatus(event.detail.name);
    let filter = []
    if (status == -2) {
      filter = this.data.orderList
    } else {
      filter = this.data.orderList.filter(item => item.status == status)
    }
    this.setData({
      filterList: filter,
      active: event.detail.name
    })

  }

})
