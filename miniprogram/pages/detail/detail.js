//cart.js
const app = getApp()
const $http = require('../../unit/http')
Page({
  data: {
    bannerList: [],
    basicInfo: [],
    properties: [],
    propertyChildIds: [],
    content: '',
    isSku: true,
    number: 1,
    selected: [],
    propertiesPrice: [],
    logistics: []
  },
  onLoad: function(options) {
    let id = options.index;
    id = 139088
    $http.get('/shop/goods/detail', {
        id: id
      })
      .then(response => {
        console.log(response)
        if (response.code == 0) {
          this.setData({
            bannerList: response.data.pics,
            basicInfo: response.data.basicInfo,
            content: response.data.content,
            properties: response.data.properties,
            logistics: response.data.logistics
          })

          //获取
          let propertyChildIds = [];
          let selected = [];
          for (let a of this.data.properties) {
            propertyChildIds.push(a.id + ':' + a.childsCurGoods[0].id);
            selected.push(0)
          }
          this.setData({
            propertyChildIds,
            selected
          })
          //获取多规格价钱
          this.getPropertiesPrice();
        }

      })
  },
  onShowSku() {
    this.setData({
      isSku: true
    })
  },
  onHideSku() {
    this.setData({
      isSku: false
    })
  },
  onCount(value) {
    this.setData({
      number: value.detail
    })
  },
  onBuy() {
    let data = {}
    let goodsJsonStr = [{
      "goodsId": this.data.basicInfo.id,
      "number": this.data.number,
      "propertyChildIds": this.data.propertyChildIds.join(","),
      "logisticsType": 0,
      "inviter_id": '',
      "days": [this.data.basicInfo.dateAdd, this.data.basicInfo.dateUpdate]
    }];
    data.goodsJsonStr = goodsJsonStr;
    data.goodsList = [{
      "pic": this.data.basicInfo.pic,
      "name": this.data.basicInfo.name,
      "number": this.data.number,
      "propertiesPrice": this.data.propertiesPrice.propertyChildNames,
      "price": this.data.propertiesPrice.originalPrice
    }];
    data.logistics = this.data.logistics
    wx.setStorageSync('creatOrder', data)
    wx.navigateTo({
      url: '../buy/buy'
    })
  },
  onProperty(event) {
    let index = event.currentTarget.dataset.index;
    let propertyChildIds = this.data.propertyChildIds;
    let selected = this.data.selected;
    selected[index] = event.currentTarget.dataset.sindex;
    propertyChildIds[index] = event.currentTarget.dataset.parent + ':' + event.currentTarget.dataset.id;
    this.setData({
      propertyChildIds: propertyChildIds,
      selected: selected
    })
    //获取多规格价钱
    this.getPropertiesPrice();
  },
  getPropertiesPrice() {
    //获取多规格价钱
    $http.post('/shop/goods/price', {
        goodsId: this.data.basicInfo.id,
        propertyChildIds: this.data.propertyChildIds
      })
      .then(response => {
        this.setData({
          propertiesPrice: response.data
        })
      })
  }
})
