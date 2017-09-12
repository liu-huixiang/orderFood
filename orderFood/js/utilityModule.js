/**
 * Created by bjwsl-001 on 2017/8/10.
 */

//在该文件中 创建一个模块utilitModule
//在这个模块中，封装一个服务

var utilityModule =
    angular.module('utilityModule', ['ionic']);

utilityModule.service(
    '$kflHttp',
    ['$http', '$ionicLoading',
      function ($http, $ionicLoading) {

        this.sendRequest =
            function (url,handlerFunc) {
          //发起网络请求 控制加载中窗口的显示和关闭
          $ionicLoading.show({
            template:'加载中....'
          })
          $http.get(url)
              .success(function (data) {
                handlerFunc(data);
                $ionicLoading.hide();
              })
        }
      }])