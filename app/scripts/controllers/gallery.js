'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:GalleryCtrl
 * @description
 * # GalleryCtrl
 * Controller of the mytodoApp
 */
angular.module('mytodoApp')
  .controller('GalleryCtrl', function ($scope, $http) {
        
        $scope.photos = [];
        //pulling data from chute album
        $http.get('https://api.getchute.com/v2/albums/aus6kwrg/assets?per_page=5&page=1').
          success(function(data) {
            
            $scope.urlsFromChute = data.data;
            
            for (var key in $scope.urlsFromChute){
              $scope.photos.push({src: $scope.urlsFromChute[key].url + '/fit/450x300'});              
            }             
          
           	
            $scope.nextPage = (data['pagination']['next_page']);
            
          }).error(function() {
            // log error
          });            
                    
        //pull all images of next page and update $scope.next_page
        $scope.add = function add() {
          $http.get($scope.nextPage).
            success(function(data) {
              $scope.urlsFromChute = data.data;

              for (var key in $scope.urlsFromChute){
                $scope.photos.push({src: $scope.urlsFromChute[key].url + '/fit/500x300'});              
              }  
              $scope.nextPage = (data['pagination']['next_page']);

            }).error(function() {
              // log error
            });             
        };

        $scope.remove = function remove() {
            var random = Math.random();
            $scope.photos.splice((random * $scope.photos.length), 1);            
        };
    });

