const app = getApp()
const $http = require('../../unit/http')
const $areaList = require('../../plugs/area.js')
Page({
  data: {
    areaList: $areaList.default,
    selectedArea: [{
        code: '110000',
        name: '北京市'
      },
      {
        code: '110100',
        name: '北京市'
      },
      {
        code: '110101',
        name: '东城区'
      }
    ],
    selectedStrArea: '选择地区',
    isArea: false,
    isDefault: false,
    mobile: '13511505050',
    address: '中山路28号',
    linkMan: 'xuhaibing',
    code: '2300000'
  },
  onLoad() {

  },
  isArea() {
    this.setData({
      isArea: !this.data.isArea
    });
  },
  onAreaChange(event) {
    let selectedStrArea = '';
    for (let item of event.detail.values) {
      selectedStrArea += item.name
    }
    this.setData({
      selectedStrArea: selectedStrArea,
      selectedArea: event.detail.values
    })
  },
  onAreaConfirm(event) {
    let selectedStrArea = '';
    for (let item of event.detail.values) {
      selectedStrArea += item.name
    }
    this.setData({
      selectedStrArea: selectedStrArea,
      selectedArea: event.detail.values,
      isArea: !this.data.isArea
    })
  },
  onDefaultAddress() {
    this.setData({
      isDefault: !this.data.isDefault
    })
  },
  onSave() {
    let data = {
      address: this.data.address,
      cityId: this.data.selectedArea[1].code,
      linkMan: this.data.linkMan,
      mobile: this.data.mobile,
      provinceId: this.data.selectedArea[0].code,
      code: this.data.code,
      districtId: this.data.selectedArea[2].code,
      isDefault: this.data.isDefault
    }
    console.log(data)
    $http.post('/user/shipping-address/add', data)
      .then(response => {
        console.log(response)
      })
  }
})
