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

//get libraries
var Parse = require('parse/react-native').Parse;

//get components
var ToolbarBeforeLoad = require('../components/toolbarBeforeLoad');
var ToolbarAfterLoad = require('../components/toolbarAfterLoad');
var Room = require('../components/room');

module.exports = React.createClass({

	getInitialState: function(){
		return{
			dataSource: new ListView.DataSource({
          		rowHasChanged: (row1, row2) => row1 !== row2
        	}),
			loaded: false,
			isRefreshing: false,
			isEnabled: true
		}
	},
	componentDidMount: function(){
		this.fetchData();
	},
	fetchData: function(){

		var _this = this;
		this.setState({ isRefreshing: true, isEnabled: false });

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
						isRefreshing: false,
						isEnabled: true
					});					
				}
			},
			function(error){
				_this.setState({ isRefreshing: false, isEnabled: true })
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
        				onRefresh={this.fetchData}
        				enabled={this.state.isEnabled}
      				>	
            			<ScrollView style={styles.body}>
            				<View style={styles.wrapper}>
            					<Text style={styles.hint}>Book on the go</Text>
            				</View>
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
      			<View style={styles.loadingScene}>
					<Image source={require('../../assets/images/loader.gif')} style={styles.loader}></Image>
				</View>
			</View>
		)
	},
	renderRoom: function(room){
		return(
			<Room data={room} />
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
	body: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		padding: 10
	},
	listView: {
		flex: 1
	},
	loadingScene: {
		flex: 1,
		backgroundColor: '#fefefe',
		alignItems: 'center',
		justifyContent: 'center'
	},
	loader: {
		width: 400,
		height: 300
	},
	wrapper:{
		padding: 15,
		backgroundColor: '#ffffff',
		marginBottom: 15
	},
	hint: {
		color: '#cccccc',
	}
});