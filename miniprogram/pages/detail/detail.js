//cart.js
const app = getApp()
const $http = require('../../unit/http')
Page({
  data: {
    bannerList: [],
    evaluateList: [],
    basicInfo: [],
    properties: [],
    propertyChildIds: [],
    content: '',
    isSku: false,
    number: 1,
    selected: [],
    propertiesPrice: [],
    logistics: [],
    time: '',
    pintuanInfo: [],
    couponsList: [],
    isCoupons: false,
    pintuanId: '',
    isPintuan: false
  },
  onLoad: function(options) {
    let id = options.id;
    id = 267890;
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
        //发起拼团
        this.originatePintuan();
        //拼团
        if (this.data.basicInfo.pingtuan) {
          this.getPingtuan();
        }
        //评价
        this.getEvaluate();
        //优惠券
        this.getCoupons();
        //
        this.getPindanPersion();

      })
  },
  onShowSku() {
    this.setData({
      isSku: true,
      isPintuan: false
    })
  },
  onPintuanSku() {
    this.setData({
      isSku: true,
      isPintuan: true
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
    data.goodsJsonStr = [{
      "goodsId": this.data.basicInfo.id,
      "number": this.data.number,
      "propertyChildIds": this.data.propertyChildIds.join(","),
      "logisticsType": 0,
      "inviter_id": '',
      "days": [this.data.basicInfo.dateAdd, this.data.basicInfo.dateUpdate]
    }];
    data.goodsList = [{
      "pic": this.data.basicInfo.pic,
      "name": this.data.basicInfo.name,
      "number": this.data.number,
      "propertiesPrice": this.data.propertiesPrice.propertyChildNames,
      "price": this.data.propertiesPrice.originalPrice
    }];
    data.logistics = this.data.logistics;
    //获取拼团id
    let pingtuanOpenId = 0;
    if (pingtuanOpenId) {

    }
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
  getPingtuan() {
    $http.get('/shop/goods/pingtuan/sets', {
        goodsId: this.data.basicInfo.id
      })
      .then(response => {
        let data = response.data[0];
        this.setData({
          pintuanInfo: data
        })

        let time = new Date(data.dateEnd).getTime() - new Date().getTime();
        if (time > 0) {
          this.setData({
            time: time
          })
        } else {
          this.setData({
            time: 0
          })
        }
      })
  },
  getPropertiesPrice() {
    //获取多规格价钱
    $http.post('/shop/goods/price', {
        goodsId: this.data.basicInfo.id,
        propertyChildIds: this.data.propertyChildIds
      })
      .then(response => {
        console.log(response)
        this.setData({
          propertiesPrice: response.data
        })
      })
  },
  onFinishedTime() {
    this.setData({
      time: 0
    });
  },
  //获取优惠券列表
  getCoupons() {
    $http.get('/discounts/coupons', {
        //refId: this.data.basicInfo.id
      })
      .then(response => {
        if (response.code == 700) {
          this.setData({
            couponsList: []
          })
          return
        }
        this.setData({
          couponsList: response.data
        })
      })
  },
  //是否显示优惠券列表
  onIsCoupons() {
    this.setData({
      isCoupons: !this.data.isCoupons
    })
  },
  //领取优惠券
  onPullCoupons(event) {
    let id = event.currentTarget.dataset.id;
    $http.post('/discounts/fetch', {
        id: id
      })
      .then(response => {
        if (response.code == 0) {
          wx.showToast({
            title: '领取成功！',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: response.msg,
            icon: 'none',
            image: '../../images/fail.png',
            duration: 2000
          })
        }
      })
  },
  getEvaluate() {
    $http.post('/shop/goods/reputation', {
        goodsId: this.data.basicInfo.id,
        page: 1,
        pageSize: 10
      })
      .then(response => {
        //console.log(response)
        if (response.code !== 0) {
          // this.$toast(res.msg)
          return;
        }
        this.setData({
          evaluateList: response.data
        })
      })
  },
  getPindanPersion() {
    $http.post('/shop/goods/pingtuan/list/v2', {
        goodsId: this.data.basicInfo.id,
        page: 1,
        pageSize: 1
      })
      .then(response => {
        console.log(response)
      })

    $http.get('/shop/goods/pingtuan/joiner', {
        tuanId: '8610'
      })
      .then(response => {
        console.log(response)
      })
  },
  //发起拼团
  originatePintuan() {
    $http.post('/shop/goods/pingtuan/open', {
        goodsId: this.data.basicInfo.id
      })
      .then(response => {
        console.log(response)
        this.setData({
          pintuanId: response.data.pingtuanId
        })
      })
  }
})
