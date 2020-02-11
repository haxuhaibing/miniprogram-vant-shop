//cart.js
const app = getApp()
const $http = require('../../unit/http')
Page({
  data: {
    cateList: [],
    mainActiveIndex: 0,
    activeId: null,
    goodsList: []
  },
  onLoad: function() {
    $http.get('/shop/goods/category/all')
      .then(response => {
        let cate = response.data.map(item => {
          return {
            text: item.name,
            id: item.id
          }
        })
        $http.post('/shop/goods/list', {
            categoryId: cate[0].id
          })
          .then(response => {
            this.setData({
              goodsList: response.data
            });

          })
        this.setData({
          cateList: cate
        })

      })
  },
  onClickNav({
    detail = {}
  }) {
    let id = this.data.cateList[detail.index].id
    $http.post('/shop/goods/list', {
        categoryId: id
      })
      .then(response => {
        this.setData({
          goodsList: response.data
        });

      })
    this.setData({
      mainActiveIndex: detail.index || 0
    });
  },
  onClickItem({
    detail = {}
  }) {
    const activeId = this.data.activeId === detail.id ? null : detail.id;

    this.setData({
      activeId
    });
  }

})
