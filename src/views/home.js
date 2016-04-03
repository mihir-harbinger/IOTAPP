'use strict';
var React = require('react-native');

var {
  	PullToRefreshViewAndroid,
  	DrawerLayoutAndroid,
  	TouchableHighlight,
  	InteractionManager,
  	TimePickerAndroid,
  	DatePickerAndroid,
  	ScrollView,
  	StyleSheet,
  	Dimensions,
  	TextInput,
  	ListView,
  	Platform,
  	Image,
  	Text,
  	View
} = React;

//get libraries
var Parse = require('parse/react-native').Parse;
var Moment = require('moment');

//get components
var ToolbarAfterLoad = require('../components/toolbarAfterLoad');
var LoadingView = require('../components/loadingview');
var ReloadView = require('../components/reloadview');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Room = require('../components/room');

//get dimensions
const {height, width} = Dimensions.get('window');

module.exports = React.createClass({

	getInitialState: function(){
		return{
			rawData: [],
			dataSource: new ListView.DataSource({
          		rowHasChanged: (row1, row2) => row1 !== row2
        	}),
			loaded: true,
			isReloadRequired: false,
			selectedDate: Moment(),
			selectedInTime: roundToNextSlot(Moment()),
			selectedOutTime: roundToNextSlot(Moment()).add(30, "minutes")
		}
	},
	componentWillMount: function(){

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
		this.setState({ rawData: [], isReloadRequired: false, loaded: false });

		Parse.Cloud.run('fetchListOfRooms', {}).then(

			function(result){

				//Convert ParseObject to JSON; then push into an array.
				var cleanData = [];
				for(var i=0;i<result.length;i++){
					cleanData.push(result[i].toJSON());
				}

				console.log("[HOME API] Success: ", cleanData);

				_this.setState({ 
					rawData: _this.state.rawData.concat(cleanData),
					dataSource: _this.state.dataSource.cloneWithRows(cleanData),
					loaded: true,
					isReloadRequired: false,
				});
			},
			function(error){
				_this.setState({ isReloadRequired: true, loaded: false })
				console.log("[HOME API] Error: "+ JSON.stringify(error, null, 2));
			}
		);
	},
	render: function(){
		if(this.state.isReloadRequired){
			return this.renderReloadView();
		}
		if(!this.state.loaded){
			return this.renderLoadingView();
		}

		return(
      		<DrawerLayoutAndroid
        		drawerWidth={width-60}
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
					<PullToRefreshViewAndroid 
                		style={styles.container}
                		refeshing={this.state.isRefreshing}
                		onRefresh={this.reloadData}
                		enabled={this.state.isEnabled}
              		>
	        			<ScrollView style={styles.body}>
	        				<View style={styles.panel} elevation={3}>
	        					<View style={styles.leftSection}>
	        						<TouchableHighlight 
	        							onPress={this.onPressChangeDate.bind(this, { date: new Date(this.state.selectedDate.format("YYYY-MM-DD")), minDate: new Date() })}
	        							underlayColor={'#3f9cc5'}
	        						>
		        						<View style={styles.dateWrapper}>
		        							<View style={styles.date}>
		        								<Text style={styles.dateNumber}>
		        									{this.state.selectedDate.format("D")}
		        								</Text>
		        							</View>
		        							<View style={styles.stackItems}>
				        						<Text style={styles.dayText}>
				        							{this.state.selectedDate.format("dddd")}
				        						</Text>
				        						<Text style={styles.monthYearText}>
				        							{this.state.selectedDate.format("MMM YYYY")}
				        						</Text>        							
		        							</View>
		        						</View>
	        						</TouchableHighlight>
	        					</View>
	        					<View style={styles.rightSection}>
	        						<View style={[styles.stackItems, {padding: 10}]}>
		        						<Text style={styles.dayText}>In-Out Time</Text>
		        						<View style={styles.inOutTimeWrapper}>
		        							<TouchableHighlight 
		        								onPress={this.onPressChangeInOutTime.bind(this, "IN", {hour: this._parseHour(this.state.selectedInTime), minute: this._parseMinute(this.state.selectedInTime)})}
		        								underlayColor={'#3f9cc5'}
		        							>
		        								<Text style={styles.monthYearText}>
		        									{this.state.selectedInTime.format("HH:mm")}
		        								</Text>
		        							</TouchableHighlight>
		        							<Text style={styles.monthYearText}> - </Text>
		        							<TouchableHighlight 
		        								onPress={this.onPressChangeInOutTime.bind(this, "OUT", {hour: this._parseHour(this.state.selectedInTime), minute: this._parseMinute(this.state.selectedInTime)})}
		        								underlayColor={'#3f9cc5'}
		        							>
		        								<Text style={styles.monthYearText}>
		        									{this.state.selectedOutTime.format("HH:mm")}
		        								</Text>
											</TouchableHighlight>
		        						</View>
		        					</View>
	        					</View>
	        				</View>
	        				<View style={styles.content}>
	        					<Text>hi</Text>
	        				</View>
	        			</ScrollView>
	        		</PullToRefreshViewAndroid>	
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
			<View style={[styles.container, {backgroundColor: '#ffffff'}]}>
				<View style={styles.sidebarHeader}>
					<Image source={require('../../assets/images/backdrop.png')} style={styles.canvas} />
				</View>
				<View style={styles.sidebarBody}>
					<TouchableHighlight underlayColor={'#f5f5f5'} onPress={this.onPressReservationList}>
						<View style={styles.sidebarItem}>
							<Icon name="list" size={26} color="#999999" />
							<Text style={styles.sidebarItemtext}>Reservation List</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight underlayColor={'#f5f5f5'}>
						<View style={styles.sidebarItem}>
							<Icon name="error-outline" size={26} color="#999999" />
							<Text style={styles.sidebarItemtext}>Important Meetings</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight underlayColor={'#f5f5f5'}>
						<View style={styles.sidebarItem}>
							<Icon name="settings" size={26} color="#999999" />
							<Text style={styles.sidebarItemtext}>Configuration</Text>
						</View>
					</TouchableHighlight>
				</View>
			</View>
	    );
	},
	onPressChangeDate: async function(options){
		const {action, year, month, day} = await DatePickerAndroid.open(options);
		if (action === DatePickerAndroid.dismissedAction) {
			return;
		}
		var dateString = year + "-" + ((month+1)<10 ? "0"+(month+1) : month+1) + "-" + (day < 10 ? "0"+day : day);
		var date = new Date(dateString);
		this.setState({ selectedDate: Moment(date) });		
	},
	onPressChangeInOutTime: async function(mode, options){
		var {action, minute, hour} = await TimePickerAndroid.open(options);

		if(!(action === TimePickerAndroid.timeSetAction)){
			return;
		}

		if(minute>0 && minute<30){
			minute=30;
		}
		else if(minute>30){
			
			minute=0;
			
			if(hour===23){
				hour=0;
			}
			else{
				hour++;
			}
		}

		switch(mode){
			case "IN"	: 	if(Date.parse('01/01/2011 ' + Moment(hour + ":" + minute, "H:m").format("H:m:s")) > Date.parse('01/01/2011 ' + Moment(this.state.selectedOutTime).format("H:m:s"))){
								break;
							}
							this.setState({ selectedInTime: Moment(hour + ":" + minute, "H:m") });
							break;
			case "OUT"	: 	if(Date.parse('01/01/2011 ' + Moment(this.state.selectedInTime).format("H:m:s")) > Date.parse('01/01/2011 ' + Moment(hour + ":" + minute, "H:m").format("H:m:s"))){
								break;				
							}
							this.setState({ selectedOutTime: Moment(hour + ":" + minute, "H:m") });
							break;
		}		
	},	
	onPressReservationList: function(){
		this.refs['DRAWER'].closeDrawer();
		this.props.navigator.push({ name: 'reservationlist' })	
	},
	_parseHour: function(time){
		time = time.format("H:m");
		return parseInt(time.slice(0, time.indexOf(":")));
	},
	_parseMinute: function(time){
		time = time.format("H:m");
		return parseInt(time.substr(time.indexOf(":") + 1));
	},	
});

function roundToNextSlot(start){
	var ROUNDING = 30 * 60 * 1000; /*ms*/
	start = Moment(Math.ceil((+start) / ROUNDING) * ROUNDING);
	return start;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	body: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	content: {
		flex: 1,
		padding: 10
	},
	listView: {
		flex: 1
	},
	hint: {
		fontSize: 15,
		color: '#0288D1',
	},
	canvas: {
		flex: 1,
		alignSelf: 'stretch',
    	width: null,
    	position: 'relative'
	},
	roomListTitle: { 
		padding: 15, 
		borderBottomColor: '#e8e8e8', 
		borderBottomWidth: 1
	},
	sidebarHeader: {
		flex: 1,
		backgroundColor: '#ffffff'
	},
	sidebarBody: {
		flex: 2
	},
	sidebarItem: {
		margin: 15,
		flexDirection: 'row'
	},
	sidebarItemtext: {
		fontSize: 17,
		marginLeft: 20,
		color: '#888888'
	},
	panel: {
		padding: 10,
		backgroundColor: '#4FC3F7',
		flexDirection: 'row'
	},
	leftSection: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	dateWrapper: {
		flexDirection: 'row',
		padding: 10
	},
	dayText: {
		fontSize: 15,
		color: '#ffffff'
	},
	dateNumber: {
		fontSize: 30,
		color: '#4FC3F7'
	},
	stackItems: {
		paddingLeft: 10,
		marginTop: 2
	},
	monthYearText: {
		fontSize: 20,
		color: '#ffffff'
	},
	rightSection: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'		
	},
	inOutTimeWrapper: {
		flexDirection: 'row'
	},
	time: {
		fontSize: 25,
		color: '#ffffff'
	},
	date: {
		width: 50,
		height: 50,
		borderRadius: 25,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#ffffff',
	}
});