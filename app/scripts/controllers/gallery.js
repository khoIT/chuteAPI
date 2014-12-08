'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:GalleryCtrl
 * @description
 * # GalleryCtrl
 * Controller of the mytodoApp
 */
angular.module('mytodoApp')
  .controller('GalleryCtrl', function ($scope, $http, $localStorage, Lightbox) {

      if (typeof $localStorage.photos === 'undefined'){
          $scope.photos = [];
          //pulling data from chute album
          $http.get('https://api.getchute.com/v2/albums/aus6kwrg/assets?per_page=5&page=1').
            success(function(data, status, headers, config) {
              //if storage not exist then create new photos array

              $scope.urls_from_chute = data["data"];
              for (var key in $scope.urls_from_chute){
                var photo = {};
                photo.url = $scope.urls_from_chute[key]["url"] + "/fit/450x300";
                photo.id = $scope.photos.length+1;
                $scope.photos.push(photo);
              }
              //update storage version of photos
              $localStorage.photos = JSON.stringify($scope.photos);
              $localStorage.nextPage = data["pagination"]["next_page"];

            }).error(function(data, status, headers, config) {
              // log error
            });
        } else {
         $scope.photos = JSON.parse($localStorage.photos);
        }
        //pull all images of next page and update $scope.next_page
        $scope.add = function add() {
          $http.get($localStorage.nextPage).
            success(function(data, status, headers, config) {
              $scope.urls_from_chute = data["data"];
              for (var key in $scope.urls_from_chute){
                var photo = {};
                photo.url = $scope.urls_from_chute[key]["url"] + "/fit/450x300";
                photo.id = $scope.photos.length+1;
                $scope.photos.push(photo);
              }
              //update storage version of photos
              $localStorage.photos = angular.toJson($scope.photos);
              $localStorage.nextPage = data["pagination"]["next_page"];
            }).error(function(data, status, headers, config) {
              // log error
            });
        };

        $scope.remove = function remove() {
            var random = Math.random();
            $scope.photos.splice(
                (random * $scope.photos.length), 1
            )
            $localStorage.photos = angular.toJson($scope.photos);
        };
        $scope.openLightboxModal = function (index) {
          Lightbox.openModal($scope.photos, index);
        };
    });

