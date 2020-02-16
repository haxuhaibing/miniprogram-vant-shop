//cart.js
const app = getApp()
const $http = require('../../unit/http')
Page({
  data: {
    goodsJsonStr: [],
    goodsList: [],
    logistics: [],
    addressInfo: [],
    logisticsPrice: '',
    totalPrice: '',
    remark: '',
    peisongType: ['快递', '到店自取', '快跑者'],
    peisongText: '快递',
    peisongValue: 'kd',
    isShowPeisong: false,
    pintuanId: '',
    query: []
  },
  onLoad: function() {
    let {
      goodsJsonStr,
      goodsList,
      logistics,
      pintuanId,
      basicInfo
    } = wx.getStorageSync('creatOrder');
    console.log('getStorageSync', wx.getStorageSync('creatOrder'))
    this.setData({
      goodsJsonStr,
      goodsList,
      logistics,
      pintuanId,
      basicInfo
    })
    //计算合计
    let totalPrice = 0;
    if (basicInfo.isPintuan) {
      for (let item of this.data.goodsList) {
        totalPrice += item.propertiesPrice.price * item.number
      }
      this.setData({
        totalPrice
      })
    } else {
      totalPrice = basicInfo.minPrice * basicInfo.number
      this.setData({
        totalPrice
      })
    }

    //计算运费
    if (this.data.logistics.isFree) {
      this.setData({
        logisticsPrice: 0
      })
    }
    $http.get('/user/shipping-address/default/v2')
      .then(response => {
        this.setData({
          addressInfo: response.data.info
        })
      })
  },
  onRemark(event) {
    this.setData({
      remark: event.detail
    })
  },
  onPeisong(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    switch (index) {
      case 1:
        this.setData({
          peisongValue: 'kd',
          peisongText: value
        })
        break;
      case 2:
        this.setData({
          peisongValue: 'zq',
          peisongText: value
        })
        break;
      case 1:
        this.setData({
          peisongValue: 'keloop',
          peisongText: value
        })
        break;
      default:
        this.setData({
          peisongValue: 'kd',
          peisongText: value
        })
    }
  },
  onShowPeisong() {
    this.setData({
      isShowPeisong: !this.data.isShowPeisong
    })
  },
  onSubmit() {
    let goodsJsonStr = [];
    for (let item of this.data.goodsJsonStr) {
      goodsJsonStr.push({
        "goodsId": item.goodsId,
        "number": item.number,
        "propertyChildIds": item.propertyChildIds,
        "logisticsType": 0
      })
    }

    let params = {
      goodsJsonStr: JSON.stringify(goodsJsonStr),
      address: this.data.addressInfo.address,
      cityId: this.data.addressInfo.cityId,
      code: this.data.addressInfo.code,
      couponId: this.data.couponId || '',
      districtId: this.data.addressInfo.districtId,
      extJsonStr: '',
      pingtuanOpenId: this.data.pintuanId || '',
      linkMan: this.data.addressInfo.linkMan,
      kjid: this.data.kjid || '',
      mobile: this.data.addressInfo.mobile,
      peisongType: this.data.peisongValue,
      provinceId: this.data.addressInfo.provinceId,
      remark: this.data.remark || ''
    }

    console.log('提交订单结果', goodsJsonStr, params)
    $http.post('/order/create', params)
      .then(response => {
        console.log('提交订单结果', response)
        if (response.code == 0) {

        } else {
          wx.showToast({
            title: response.msg,
            icon: 'none',
            //image: '../../images/fail.png',
            duration: 1500
          })
        }
      })
  }

})
