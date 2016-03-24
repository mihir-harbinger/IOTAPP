'use strict';
var React = require('react-native');

var {
	TouchableHighlight,
	StyleSheet,
	ListView,
	View,
	Text
} = React;

var API = require('../API/api');

module.exports = React.createClass({

	getInitialState: function(){
		return{
			rawData: null,
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			loaded: false
		}
	},
	componentDidMount: function(){
		this.fetchData();
	},
	fetchData: function(){

		var _this = this;

		var result = API.fetchRoomList();
		this.setState({ 
			rawData: result, 
			dataSource: this.state.dataSource.cloneWithRows(result),
			loaded: true
		});				
		return;
		promise.then((data) => {
				console.log('hi');
				_this.setState({ 
					rawData: result, 
					dataSource: _this.state.dataSource.cloneWithRows(result),
					loaded: true, 
				});				
			})
		
	},
	render: function(){
		if(!this.state.loaded){
			return this.renderLoadingView();
		}

		return(
			<View style={styles.container}>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={this.renderAvailableRoom}
					style={styles.listView}
				>
				</ListView>
			</View>
		)
	},
	renderLoadingView: function(){
		return(
			<View style={styles.container}>
				<Text>Loading...</Text>
			</View>
		)
	},
	renderAvailableRoom: function(room){
		return(
			<TouchableHighlight style={{flex: 1, padding: 10}}>
				<Text>{"Capacity: "+room.capacity}</Text>
				<Text>{"Name: "+room.room_name}</Text>
			</TouchableHighlight>
		)
	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	listView: {
		flex: 1
	}
});