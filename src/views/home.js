'use strict';
var React = require('react-native');

var {
  PullToRefreshViewAndroid,
  DrawerLayoutAndroid,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  TextInput,
  ListView,
  Platform,
  Image,
  Text,
  View
} = React;

var ToolbarBeforeLoad = require('../components/toolbarBeforeLoad');
var ToolbarAfterLoad = require('../components/toolbarAfterLoad');
var Parse = require('parse/react-native').Parse;
var API = require('../API/api');

module.exports = React.createClass({

	getInitialState: function(){
		return{
			dataSource: new ListView.DataSource({
          		rowHasChanged: (row1, row2) => row1 !== row2
        	}),
			loaded: false,
			isRefreshing: false
		}
	},
	componentDidMount: function(){
		this.fetchData();
	},
	fetchData: function(){

		var _this = this;
		this.setState({ isRefreshing: true });

		Parse.Cloud.run('fetchListOfRooms', {}).then(

			function(result){

				//Convert ParseObject to JSON; then push into an array.
				var cleanData = [];
				for(var i=0;i<result.length;i++){
					cleanData.push(result[i].toJSON());
				}

				console.log("[API] Success: ", cleanData);

				if(_this.isMounted()){
					_this.setState({ 
						dataSource: _this.state.dataSource.cloneWithRows(cleanData),
						loaded: true,
						isRefreshing: false
					});					
				}
			},
			function(error){
				console.log("[API] Error: "+ JSON.stringify(error, null, 2));
			}
		);
	},
	render: function(){
		if(!this.state.loaded){
			return this.renderLoadingView();
		}

		return(
      		<DrawerLayoutAndroid
        		drawerWidth={300}
        		drawerPosition={DrawerLayoutAndroid.positions.Left}
        		renderNavigationView={this.renderNavigationView}
        		ref={'DRAWER'}
      		>
        		<View style={styles.container}>
	          		<ToolbarAfterLoad
    	        		title={'Home'}
        	    		navigator={this.props.navigator}
            			sidebarRef={this}
          			/>
	      			<PullToRefreshViewAndroid 
    	    			style={styles.container}
        				refeshing={this.state.isRefreshing}
        				onRefresh={this.reloadData}
        				enabled={this.state.isEnabled}
      				>	
            			<ScrollView>
              				<ListView 
	            				dataSource={this.state.dataSource}
                    			renderRow={this.renderRoom}
                    			style={styles.listView}
                    		/>
            			</ScrollView>
          			</PullToRefreshViewAndroid>
      			</View>
      		</DrawerLayoutAndroid>
    	);
	},
	renderLoadingView: function(){
		return(
			<View style={styles.container}>
          		<ToolbarBeforeLoad
	        		title={'Home'}
	        		navigator={this.props.navigator}
	        		componentRef={this}
      			/>			
				<Text>Loading...</Text>
			</View>
		)
	},
	renderRoom: function(room){
		return(
			<TouchableHighlight>
			<View style={{flex: 1, padding: 10, backgroundColor: '#cccccc'}}>
				<Text>{"Capacity: "+room.room_capacity}</Text>
				<Text>{"Name: "+room.room_name}</Text>
			</View>
			</TouchableHighlight>
		)
	},
	renderNavigationView: function(){
	    return(
			<View style={[styles.container, {backgroundColor: '#cccccc'}]}></View>
	    );

	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	listView: {
		flex: 1
	}
});