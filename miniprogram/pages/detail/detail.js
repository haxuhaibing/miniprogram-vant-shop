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
    pintuanInfo: {},
    isSku: false,
    number: 1,
    selected: [],
    propertiesPrice: [],
    logistics: [],
    time: 0,
    pintuanInfo: [],
    couponsList: [],
    isCoupons: false,
    pintuanId: '',
    isPintuan: false,
    pintuanList: [],
    pintuanJoiner: []
  },
  onLoad: function(options) {
    let id = options.id;
    id = 267889; //测试
    $http.get('/shop/goods/detail', {
        id: id
      })
      .then(response => {
        console.log('获取商品详情', response)
        let basicInfo = response.data.basicInfo;
        basicInfo.content = response.data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
        if (response.code == 0) {
          this.setData({
            bannerList: response.data.pics || [],
            basicInfo: basicInfo || {},
            properties: response.data.properties || [],
            logistics: response.data.logistics || {}
          })
          //is have property
          if (response.properties) {
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
            //get property list
            this.getPropertiesPrice();
          }
        }
        //isPintuan
        if (this.data.basicInfo.pingtuan) {
          //发起拼团
          this.originatePintuan();
          //拼团
          this.getPingtuan();
          //获取可参与拼单列表
          this.getPindanJoinList();
        }
        //get evaluate
        this.getEvaluate();
        //get coupons
        this.getCoupons();
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
        console.log('获取优惠券列表', response)
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
  //获取评价
  getEvaluate() {
    $http.post('/shop/goods/reputation', {
        goodsId: this.data.basicInfo.id,
        page: 1,
        pageSize: 10
      })
      .then(response => {
        console.log('获取评价', response)
        if (response.code == 0) {
          this.setData({
            evaluateList: response.data
          })
        }

      })
  },
  //获取可参与拼单列表
  getPindanJoinList() {
    $http.post('/shop/goods/pingtuan/list/v2', {
        goodsId: this.data.basicInfo.id
      })
      .then(response => {
        let data = response.data.result;
        data = data.map(item => {
          return {
            "apiExtUser": item.apiExtUser,
            "time": new Date(item.dateEnd).getTime() - new Date(item.dateAdd).getTime(),
            "goodsId": item.goodsId,
            "helpNumber": item.helpNumber,
            "id": item.id,
            "pingtuanId": item.pingtuanId,
            "status": item.status,
            "statusStr": item.statusStr,
            "uid": item.uid
          }
        })
        this.setData({
          pintuanList: data
        })
      })

  },
  //发起拼团
  originatePintuan() {
    $http.post('/shop/goods/pingtuan/open', {
        goodsId: this.data.basicInfo.id
      })
      .then(response => {
        console.log('发起拼团', response)
        this.setData({
          pintuanId: response.data.id
        })
      })
  },
  //提交订单
  onCreateOrder() {
    let data = {}
    data.goodsJsonStr = [{
      "goodsId": this.data.basicInfo.id,
      "number": this.data.number,
      "propertyChildIds": this.data.propertyChildIds.join(","),
      "logisticsType": 0,
      "inviter_id": ''
    }];
    if (this.data.basicInfo.pingtuan) {
      data.goodsList = [{
        "pic": this.data.basicInfo.pic,
        "name": this.data.basicInfo.name,
        "number": this.data.number,
        "propertiesPrice": this.data.propertiesPrice || []
      }];
    } else {
      data.goodsList = [{
        "pic": this.data.basicInfo.pic,
        "name": this.data.basicInfo.name,
        "number": this.data.number,
        "price": this.data.basicInfo.minPrice
      }];
    }
    //商品基本信息
    data.basicInfo = this.data.basicInfo;
    data.basicInfo.number = this.data.number
    //物流信息
    data.logistics = this.data.logistics;
    //团购订单
    if (this.data.isPintuan) {
      data.pintuanId = this.data.pintuanId;
    }
    wx.setStorageSync('creatOrder', data);
    this.setData({
      isSku: false
    })
    wx.navigateTo({
      url: '../buy/buy'
    })
  }
})
