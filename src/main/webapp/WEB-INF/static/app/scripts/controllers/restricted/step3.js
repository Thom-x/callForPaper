'use strict';

angular.module('CallForPaper')
	.controller('Step3Ctrl', ['$scope', function($scope) {
		$scope.$watch(function(){
 			var financial = $scope.$parent.formData.help.financial;
 			var hotel = $scope.$parent.formData.help.hotel;
 			var hotelDate = $scope.form.hotelDate.$valid;
 			var travel = $scope.$parent.formData.help.travel;
 			var travelFrom = $scope.form.travelFrom.$valid;
 			if(financial === true)
 			{
 				if(!hotel && !travel)
 				{
 					return false;
 				}
 				else
 				{
 					return !(hotel && !hotelDate) && !(travel && !travelFrom);
 				}
 			}
 			else if(financial === false)
 			{
 				return true;
 			}
 			else
 			{
 				return false;
 			}
		},function(isValid){
			$scope.$parent.formData.steps.isValid[2]= isValid;
		})

		$scope.verify = false;
		$scope.doVerify = function()
		{
			$scope.verify = true;
			if($scope.$parent.formData.steps.isValid[2] && $scope.$parent.formData.steps.isValid[1] && $scope.$parent.formData.steps.isValid[0])
			{
				$scope.$parent.processForm();
			}
		}
	}]);
