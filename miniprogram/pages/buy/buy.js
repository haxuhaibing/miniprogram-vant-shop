//cart.js
const app = getApp()
const $http = require('../../unit/http')
Page({
  data: {
    goodsJsonStr: [],
    goodsList: [],
    logistics: [],
    addressInfo: [],
    logisticsPrice: null,
    totalPrice: null,
    remark: null,
    peisongType: ['快递', '到店自取', '快跑者'],
    peisongText: '快递',
    peisongValue: 'kd',
    isShowPeisong: false
  },
  onLoad: function() {
    let {
      goodsJsonStr,
      goodsList,
      logistics
    } = wx.getStorageSync('creatOrder');

    this.setData({
      goodsJsonStr,
      goodsList,
      logistics
    })
    //计算合计
    let totalPrice = 0;
    for (let item of this.data.goodsList) {
      totalPrice += item.propertiesPrice.price * item.number
    }
    this.setData({
      totalPrice: totalPrice
    })
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
  onSubmit() {
    let goodsJsonStr = [];

    for (let item of this.data.goodsJsonStr) {
      goodsJsonStr.push({
        "goodsId": item.goodsId,
        "number": item.number,
        "propertyChildIds": item.propertyChildIds,
        "logisticsType": 0,
        "inviter_id": '',
        "days": item.days
      })
    }

    console.log(goodsJsonStr)

    let query = {
      goodsJsonStr: JSON.stringify(goodsJsonStr),
      address: this.data.addressInfo.address,
      autoDeliver: '',
      calculate: '',
      cityId: this.data.addressInfo.cityId,
      code: this.data.addressInfo.code,
      couponId: '',
      dadaLat: '',
      dadaLng: '',
      dadaShopNo: '',
      deductionScore: '',
      districtId: this.data.addressInfo.districtId,
      expireMinutes: '',
      extJsonStr: '',
      idcard: '',
      isCanHx: '',
      kjid: '',
      linkMan: this.data.addressInfo.linkMan,
      mobile: this.data.addressInfo.mobile,
      payOnDelivery: 2,
      peisongType: this.data.peisongValue,
      pingtuanOpenId: '',
      provinceId: this.data.addressInfo.provinceId,
      remark: this.data.remark
    }
    console.log(query)
    // $http.post('/order/create', query)
    //   .then(response => {
    //     console.log(response)
    //   })
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
  }

})
