'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:GalleryCtrl
 * @description
 * # GalleryCtrl
 * Controller of the mytodoApp
 */
var gallery = angular.module('mytodoApp');

//pulling data from chute album
gallery.factory('dataFactory', function($http){
  var result;
  var data = function(url, callback){
     $http.get(url).success(function(data) {
       result = data;
       callback(result);
      });
  };

  return data;
});
gallery.controller('GalleryCtrl', function ($scope, $http, $localStorage, Lightbox, dataFactory) {

       function getPhotos(url){
        dataFactory(url, function(results){
          //check for duplicates
          if ($localStorage.photos !== undefined){
           if(JSON.parse($localStorage.photos)[0].url ==  results.data[0].url + "/fit/400x300"){
              $scope.photos = JSON.parse($localStorage.photos);
              return;
            }//end if
          }
          $scope.data = results;
          updateDisplay();
        });
      }

      function updateDisplay(){
        $localStorage.id == null ? $localStorage.id = 0:null;
        //if reach the end of api
        if ($localStorage.nextPage === null){
          restart();
        }

        //if gallery not exist
        if ($localStorage.photos === undefined ||$localStorage.photos[0] == undefined ){
          $scope.photos = [];
        } else { //copy the existing database to $scope.photos
          $scope.photos = JSON.parse($localStorage.photos);
        }
        var photoLinks = $scope.data.data;
        for (var key in photoLinks){
          var photo = {};
          photo.url = photoLinks[key].url + "/fit/400x300";
          photo.id = ++$localStorage.id;
          $scope.photos.push(photo);
        }
        //update storage version of photos
        $localStorage.photos = angular.toJson($scope.photos);
        $localStorage.nextPage = $scope.data.pagination.next_page;
      }

      //intialize gallery
      var first_url = 'https://api.getchute.com/v2/albums/aus6kwrg/assets?per_page=5&page=1';
      getPhotos(first_url);

      $scope.add = function add() {
        $http.get($localStorage.nextPage).
            success(function(data, status, headers, config) {
              $scope.urls_from_chute = data.data;
              for (var key in $scope.urls_from_chute){
                var photo = {};
                photo.url = $scope.urls_from_chute[key].url + "/fit/400x300";
                photo.id = ++$localStorage.id;
                $scope.photos.push(photo);
              }
              //update storage version of photos
              $localStorage.photos = angular.toJson($scope.photos);
              $localStorage.nextPage = data.pagination.next_page;
            }).error(function(data, status, headers, config) {
              // log error
            });
      };

      //clear all current products and load next batch
      $scope.clear = function clear() {
          $scope.photos = [];
          delete $localStorage.photos;
          getPhotos($localStorage.nextPage);
      };

      $scope.restart = function restart() {
        $scope.photos = [];
        $localStorage.$reset();
        getPhotos(first_url);
      };

      $scope.openLightboxModal = function(index){
        Lightbox.openModal($scope.photos, index);
      }
    });


    gallery.directive('scroller', function () {
      return {
        restrict: 'A', link: function (scope, elem, attrs) {
            elem.bind('scroll', function () {
                var div = $(this);
                  console.log(div.height());
                 if (div[0].scrollHeight - div.scrollTop() == div.height())
                {
                    scope.$apply('add()');
                }
            });
        }
    };
    });

