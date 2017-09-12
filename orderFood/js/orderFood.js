/**
 * Created by bjwsl-001 on 2017/8/9.
 */

var app = angular.module('kflModule',
    ['utilityModule']);

//设置状态
app.config(function ($stateProvider,
                     $urlRouterProvider,
                     $ionicConfigProvider) {
  $ionicConfigProvider
      .tabs.position('bottom');

  $stateProvider
      .state('kflStart', {
        url: '/ofStart',
        templateUrl: 'tpl/start.html'
      })
      .state('kflMain', {
        url: '/ofMain',
        templateUrl: 'tpl/main.html',
        controller: 'mainCtrl'
      })
      .state('kflDetail', {
        url: '/ofDetail/:did',
        templateUrl: 'tpl/detail.html',
        controller: 'detailCtrl'
      })
      .state('kflOrder', {
        url: '/ofOrder/:detail/:price',
        templateUrl: 'tpl/order.html',
        controller: 'orderCtrl'
      })
      .state('kflMyOrder', {
        url: '/ofMyOrder',
        templateUrl: 'tpl/myOrder.html',
        controller: 'myOrderCtrl'
      })
      .state('kflSettings', {
        url: '/ofSettings',
        templateUrl: 'tpl/settings.html',
        controller: 'settingsCtrl'
      })
      .state('kflCart', {
        url: '/ofCart',
        templateUrl: 'tpl/myCart.html',
        controller: 'cartCtrl'
      })
  $urlRouterProvider
      .otherwise('/ofStart')

})

//创建一个父控制器
app.controller('parentCtrl', [
  '$scope', '$state',
  function ($scope, $state) {
    $scope.jump = function (desState, arg) {
      $state.go(desState, arg);
    }
  }
]);

//给Main创建一个控制器
app.controller('mainCtrl',
    ['$scope', '$kflHttp',
      function ($scope, $kflHttp) {
        $scope.dishList = [];
        $scope.hasMore = true;
        $scope.inputTxt = {kw: ''};

        $kflHttp.sendRequest(
            'data/dish_getbypage.php?start=0',
            function (data) {
              console.log(data);
              $scope.dishList = data;
            }
        )

        $scope.loadMore = function () {
          $kflHttp.sendRequest(
              'data/dish_getbypage.php?start=' + $scope.dishList.length,
              function (data) {
                if (data.length < 5) {
                  $scope.hasMore = false;
                }
                $scope.dishList = $scope.dishList.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
              }
          )
        }

        $scope.$watch(
            'inputTxt.kw',
            function () {
              //根据用户的输入，发起网络请求-搜索
              if ($scope.inputTxt.kw.length > 0) {
                $kflHttp.sendRequest(
                    'data/dish_getbykw.php?kw=' + $scope.inputTxt.kw,
                    function (data) {
                      if (data.length > 0) {
                        $scope.dishList = data;
                      }
                    }
                )
              }
            }
        );

      }
    ])

//给detail创建一个控制器
app.controller('detailCtrl',
    ['$scope', '$kflHttp', '$stateParams', '$ionicPopup',
      function ($scope, $kflHttp, $stateParams, $ionicPopup) {
        console.log($stateParams);
        $scope.id = $stateParams.did;
        $kflHttp.sendRequest(
            'data/dish_getbyid.php?did=' + $scope.id,
            function (data) {
              console.log(data);
              $scope.dish = data[0];
            }
        )

        $scope.addToCart = function () {
          //发起网络请求
          $kflHttp.sendRequest(
              'data/cart_update.php?' +
              'uid=1&did=' + $scope.id + "&count=-1",
              function (data) {
                console.log(data);
                if (data.msg == 'succ') {
                  //弹窗显示添加到购物车成功
                  $ionicPopup.alert({
                    title: '提示信息',
                    template: '添加成功！'
                  })
                }
              }
          )
        }

      }

    ])

app.controller('orderCtrl', [
  '$scope', '$stateParams',
  '$httpParamSerializerJQLike',
  '$kflHttp',
  function ($scope, $stateParams,
            $httpParamSerializerJQLike,
            $kflHttp) {
    //接收到cart传递来的参数
    console.log($stateParams);
    //定义一个对象，将表单中用户的输入
    // 绑定到对象中的属性
    $scope.order = {
      userid:1,
      cartDetail:$stateParams.detail,
      totalprice:$stateParams.price
    };

    $scope.submitOrder = function () {
      //可以通过服务 将对象 直接进行表单序列化
      var params =
          $httpParamSerializerJQLike(
              $scope.order);
      console.log(params);
      //发给服务器
      $kflHttp.sendRequest(
          'data/order_add.php?' + params,
          function (data) {
            console.log(data)
            var result = data[0];
            if (result.msg == 'succ') {
              $scope.result =
                  "下单成功，订单编号为" + result.oid;
             /* sessionStorage.setItem(
                  'phone',
                  $scope.order.userPhone
              )*/
            }
            else {
              $scope.result = "下单失败";
            }
          }
      )
    }


  }
])

//给myOrder创建一个控制器，根据手机号去
//查询所有的订单信息
app.controller('myOrderCtrl',
    ['$scope', '$kflHttp',
      function ($scope, $kflHttp) {
        //读取手机号
        var myPhone = sessionStorage.getItem('phone')
        //发起网络请求
        $kflHttp.sendRequest(
            'data/order_getbyuserid.php?userid=1',
            function (result) {
              console.log(result);
              $scope.orderList = result.data;
            }
        )
      }]
)

//给设置页面 添加一个控制器
app.controller('settingsCtrl',
    ['$scope', '$ionicModal',
      function ($scope, $ionicModal) {

        //显示一个自定义的模态窗口
        //①创建一个窗口的对象
        $ionicModal
            .fromTemplateUrl(
            'tpl/about.html',
            {
              scope: $scope
            }
        )
            .then(function (modal) {
              $scope.myModal = modal;
            })

        //②使用对象中show/hide方法
        $scope.showCustomModal =
            function () {
              $scope.myModal.show();
            }

        $scope.hideCustomModal = function () {
          $scope.myModal.hide();
        }

      }]);

app.controller('cartCtrl',
    ['$scope', '$kflHttp',
      function ($scope, $kflHttp) {
        $scope.editMsg = "编辑";
        $scope.editEnable = true;

        $scope.cartList = [];
        $scope.isCartEmpty =false;
        //编辑、完成点击的处理函数
        $scope.toggleEditStatus =
            function () {
              $scope.editEnable = !$scope.editEnable;
              if ($scope.editEnable) {
                $scope.editMsg = "编辑";

              }
              else {
                $scope.editMsg = "完成";
              }
            }

        //初始化购物车所需要用到的数据
        $kflHttp
            .sendRequest(
            'data/cart_select.php?uid=1',
            function (result) {
              console.log(result);
              $scope.cartList = result.data;
              if($scope.cartList.length == 0)
              {
                $scope.isCartEmpty =true;
              }
            }
        )

        $scope.jumpToOrder = function () {
          $scope.jump(
              'kflOrder',
              {
                detail: angular.toJson($scope.cartList),
                price: $scope.calcSum()
              }
          )
          ;
        }

        //定义从购物车减少数据的方法
        $scope.deleteFromCart =
            function (index) {
              if ($scope.cartList[index].
                      dishCount == 1) {
                return
              }
              var path =
                  'data/cart_update.php?uid=1&did='
                  + $scope.cartList[index].did
                  + "&count=" + ($scope.cartList[index].dishCount - 1)
              $kflHttp.sendRequest(
                  path,
                  function (result) {
                    console.log(result)
                    if (result.msg == 'succ') {
                      $scope.cartList[index].dishCount =
                          $scope.cartList[index].dishCount - 1;
                    }
                  }
              )
            }

        //定义从购物车添加数据的方法
        $scope.addToCart =
            function (index) {
              var path = 'data/cart_update.php?uid=1'
                  + '&did=' + $scope.cartList[index].did
                  + '&count=' + (parseInt($scope.cartList[index].dishCount) + 1)
              $kflHttp.sendRequest(
                  path,
                  function (result) {
                    if (result.msg == 'succ') {
                      $scope.cartList[index].dishCount =
                          parseInt($scope.cartList[index].dishCount) + 1
                    }
                  }
              )
            }

        $scope.calcSum = function () {
          var totalPrice = 0;
          for (var i = 0;
               i < $scope.cartList.length; i++) {
            totalPrice += ($scope.cartList[i].dishCount * $scope.cartList[i].price);
          }
          return totalPrice;
        }
      }
    ])





