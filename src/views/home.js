'use strict';
var React = require('react-native');

var {
	TouchableNativeFeedback,
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
var ToolbarAfterLoad = require('../components/toolbarAfterLoad');
var LoadingView = require('../components/loadingview');
var ReloadView = require('../components/reloadview');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Room = require('../components/room');

//get assets
var OfficeImage = require('../../assets/images/office.png');

module.exports = React.createClass({

	getInitialState: function(){
		return{
			rawData: [],
			dataSource: new ListView.DataSource({
          		rowHasChanged: (row1, row2) => row1 !== row2
        	}),
			loaded: false,
			isRefreshing: false,
			isEnabled: true,
			isReloadRequired: false
		}
	},
	componentDidMount: function(){
		this.loadData();
	},
	loadData: function(){
		
		var _this = this;
		this.API();

		//check if data is loaded
		setTimeout(function(){
			if(_this.isMounted()){
				if(_this.state.loaded===false){
					_this.setState({
						isReloadRequired: true
					})
				}
			}
		}, 10000);
	},
	API: function(){

		var _this = this;
		this.setState({ rawData: [], isRefreshing: true, isEnabled: false, isReloadRequired: false, loaded: false });

		Parse.Cloud.run('fetchListOfRooms', {}).then(

			function(result){

				//Convert ParseObject to JSON; then push into an array.
				var cleanData = [];
				for(var i=0;i<result.length;i++){
					cleanData.push(result[i].toJSON());
				}

				console.log("[HOME API] Success: ", cleanData);

				if(_this.isMounted()){
					_this.setState({ 
						rawData: _this.state.rawData.concat(cleanData),
						dataSource: _this.state.dataSource.cloneWithRows(cleanData),
						isRefreshing: false,
						loaded: true,
						isReloadRequired: false,
						isEnabled: true
					});					
				}
			},
			function(error){
				_this.setState({ isRefreshing: false, isEnabled: true, isReloadRequired: true, loaded: false })
				console.log("[HOME API] Error: "+ JSON.stringify(error, null, 2));
			}
		);
	},
	render: function(){
		if(this.state.isReloadRequired){
			return this.renderReloadView();
		}
		if(this.state.loaded === false && this.state.isReloadRequired === false){
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
	          			navIcon={require('../../assets/images/stack.png')}
    	        		title={'Home'}
        	    		navigator={this.props.navigator}
            			sidebarRef={this}
            			isChildView={false}
          			/>
        			<ScrollView style={styles.body}>
        				<TouchableNativeFeedback onPress={this.onPressNewBooking}>
            				<View style={{flex: 1, backgroundColor: '#ffffff'}} elevation={1}>
	            				<View style={styles.quickBooking}>
	            					<Image 
	            						source={OfficeImage} 
	            						style={styles.canvas}
	            					>
	            					</Image>
	            				</View>
	            				<View style={styles.wrapper}>
		        						<Text style={styles.hint}>BOOK ON THE GO</Text>
		        						<Text style={{marginTop: 5}}>Hi there! Tap on this card to reserve a conference room now. Alternatively, you can go through the list beneath to see available slots.</Text>
	            				</View>
	            			</View>
        				</TouchableNativeFeedback>
        				<View style={styles.roomListTitle}>
        					<Text style={styles.hint}>IOT POWERED ROOMS</Text>
        				</View>
          				<ListView 
            				dataSource={this.state.dataSource}
                			renderRow={this.renderRoom}
                			style={styles.listView}
                		/>
        			</ScrollView>
      			</View>
      		</DrawerLayoutAndroid>
    	);
	},
	renderLoadingView: function(){
		return <LoadingView title={'Home'} navigator={this.props.navigator}  navIcon={require('../../assets/images/stack.png')} />
	},
	renderReloadView: function(){
		return <ReloadView title={'Home'} navigator={this.props.navigator} loadData={this.loadData} />
	},
	renderRoom: function(room){
		return(
			<Room data={room} />
		)
	},
	renderNavigationView: function(){
	    return(
			<View style={[styles.container, {backgroundColor: '#3d4955'}]}>
				<View style={styles.sidebarHeader}>
					
				</View>
				<View style={styles.sidebarBody}></View>
			</View>
	    );
	},
	onPressNewBooking: function(){
		this.props.navigator.push({ name: 'newbooking', data: this.state.rawData })
	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	body: {
		flex: 1,
		backgroundColor: '#e8e8e8',
		padding: 10
	},
	listView: {
		flex: 1
	},
	touchable:{
		marginBottom: 10,
		borderRadius: 2
	},
	wrapper:{
		padding: 15,
		backgroundColor: '#ffffff',
		borderBottomLeftRadius: 2,
		borderBottomRightRadius: 2,
	},
	hint: {
		fontSize: 15,
		color: '#0288D1',
	},
	leftSection: {
		flex: 2,
	},
	rightSection: {
		flex: 1,
		alignItems: 'flex-end',
		justifyContent: 'center'
	},
	bookNowImage: {
		width: 90,
		height: 83
	},
	description: {
		fontSize: 15,
		color: '#a5a5a5'
	},
	location: {
		fontSize: 15,
		color: '#a5a5a5'
	},
	quickBooking: {
		flex: 1,
    	height: 150,
	},
	canvas: {
		flex: 1,
		alignSelf: 'stretch',
    	width: null,
    	position: 'relative'
	},
	overlay: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	},
	roomListTitle: { 
		backgroundColor: '#ffffff', 
		marginTop: 10, 
		padding: 15, 
		borderBottomColor: '#e8e8e8', 
		borderBottomWidth: 1
	},
	sidebarHeader: {
		flex: 1,
		backgroundColor: '#ffffff'
	},
	sidebarBody: {
		flex: 3
	}
});