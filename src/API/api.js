'use strict';

var Parse = require('parse/react-native').Parse;

module.exports = {

	fetchRoomList: function(){
		// Parse.Cloud.run('searchRoomListForAvailableTime', {bookfromtime: 13, booktotime: 14, bookdate: '24-3-2016'}, {
		// 	success: function(result){
		// 		_this.setState({ 
		// 			rawData: result, 
		// 			dataSource: _this.state.dataSource.cloneWithRows(result),
		// 			loaded: true, 
		// 		});
		// 		console.log("Success: "+ JSON.stringify(result, null, 2));
		// 	},
		// 	error: function(error){
		// 		console.log("Error: "+ JSON.stringify(error, null, 2));
		// 	}
		// });		
		Parse.Cloud.run('fetchListOfRooms', {}, {
			success: function(result){
				console.log("[API] Success: "+ JSON.stringify(result, null, 2));
				//return Promise.resolve(result);
				return result;
			},
			error: function(error){
				console.log("[API] Error: "+ JSON.stringify(error, null, 2));
				//return Promise.resolve(error);
				return error;
			}
		});
	}
}