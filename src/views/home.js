'use strict';
var React = require('react-native');

var {
  	PullToRefreshViewAndroid,
  	DrawerLayoutAndroid,
  	TouchableHighlight,
  	InteractionManager,
  	TimePickerAndroid,
  	DatePickerAndroid,
  	ToastAndroid,
  	ScrollView,
  	StyleSheet,
  	TextInput,
  	ListView,
  	Platform,
  	Alert,
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

module.exports = React.createClass({

	getInitialState: function(){
		return{
			rawData: [],
			dataSource: new ListView.DataSource({
          		rowHasChanged: (row1, row2) => row1 !== row2
        	}),
			loaded: true,
			isReloadRequired: false,
			isEnabled: false,
			isRefreshing: false,
			selectedDate: Moment(),
			selectedInTime: roundToNextSlot(Moment()),
			selectedOutTime: roundToNextSlot(Moment()).add(30, "minutes")
		}
	},
	componentWillMount: function(){
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

		var _bookFromTime = parseFloat(Moment(this.state.selectedInTime, "H:m").subtract(Moment().utcOffset(), "minutes").format("H.m"));
		var _bookToTime = parseFloat(Moment(this.state.selectedOutTime, "H:m").subtract(Moment().utcOffset(), "minutes").format("H.m"));
		var _bookDate = Moment(Moment(this.state.selectedDate).format("D-M-YYYY") + " " + Moment(this.state.selectedInTime, "H:m").format("H.m"), "D-M-YYYY H:m").subtract(Moment().utcOffset(), "minutes").format("D-M-YYYY");

		this.setState({ rawData: [], isReloadRequired: false, loaded: false, isEnabled: false, isRefreshing: true });

		Parse.Cloud.run('checkAvailibilityOfRooms', {
			bookdate: _bookDate,
			reqfromtime: _bookFromTime,
			reqtotime: _bookToTime
		}).then(

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
					isEnabled: true,
					isRefreshing: false
				});
			},
			function(error){
				_this.setState({ isReloadRequired: true, loaded: false, isEnabled: true, isRefreshing: false })
				console.log("[HOME API] Error: "+ JSON.stringify(error, null, 2));
			}
		);
	},
	render: function(){

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
                		onRefresh={this.loadData}
                		enabled={this.state.isEnabled}
              		>
	        			<View style={styles.body}>
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
	        							<View style={{flexDirection: 'row'}}>
    										<Text style={styles.dayText}>In-Out Time </Text>
    										<TouchableHighlight 
    											onPress={this.onPressHelp}
    											underlayColor={'#3f9cc5'}
    										>
    											<Text style={styles.helpText}>[?]</Text>
    										</TouchableHighlight>
    									</View>
		        						<View style={styles.inOutTimeWrapper}>
		        							<TouchableHighlight 
		        								onPress={this.onPressChangeInOutTime.bind(this, "IN", {hour: this._parseHour(this.state.selectedInTime), minute: this._parseMinute(this.state.selectedInTime), is24Hour: true})}
		        								underlayColor={'#3f9cc5'}
		        							>
		        								<Text style={styles.monthYearText}>
		        									{this.state.selectedInTime.format("HH:mm")}
		        								</Text>
		        							</TouchableHighlight>
		        							<Text style={styles.monthYearText}> - </Text>
		        							<TouchableHighlight 
		        								onPress={this.onPressChangeInOutTime.bind(this, "OUT", {hour: this._parseHour(this.state.selectedOutTime), minute: this._parseMinute(this.state.selectedOutTime), is24Hour: true})}
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
	        				<View style={styles.body}>
	        					{ this.state.loaded ? this.renderListView() : this.renderLoadingView() }
	        				</View>
	        			</View>
	        		</PullToRefreshViewAndroid>	
      			</View>
      		</DrawerLayoutAndroid>
    	);
	},
	renderLoadingView: function(){
		if(this.state.isReloadRequired){
			return <ReloadView loadData={this.loadData} />
		}		
		return <LoadingView />
	},
	renderListView: function(){
		if(this.state.rawData.length > 0){
			return(
				<View style={styles.container}>
					<View style={styles.listViewTitle}>
						<Text style={{marginTop: 2}}>AVAILABLE ROOMS</Text>
					</View>
					<ListView 
						dataSource={this.state.dataSource}
						renderRow={this.renderRoom}
						style={styles.listView}
					/>	
				</View>		
			);			
		}
		return(
			<View style={[styles.container, {alignItems: 'center', justifyContent: 'center'}]}>
				<Text>No luck. Perhaps, try a different time slot?</Text>
			</View>		
		);		

	},
	renderRoom: function(room){
		return(
			<Room data={room} params={{date: this.state.selectedDate, inTime: this.state.selectedInTime, outTime: this.state.selectedOutTime, loadData: this.loadData }} navigator={this.props.navigator} />
		)
	},
	renderEmptyView: function(){
		return <Text>hi</Text>
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
							<Text style={styles.sidebarItemtext}>My Reservations</Text>
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
		this.loadData();
	},
	onPressChangeInOutTime: async function(mode, options){
		var {action, minute, hour} = await TimePickerAndroid.open(options);
		var isTimeAdjusted = false

		if(!(action === TimePickerAndroid.timeSetAction)){
			return;
		}

		if(minute>0 && minute<30){
			minute=30;
			isTimeAdjusted = true;
		}
		else if(minute>30){
			
			minute=0;
			
			if(hour===23){
				hour=0;
			}
			else{
				hour++;
			}
			isTimeAdjusted = true;
		}

		switch(mode){
			case "IN":
				if(isTimeAdjusted){
					ToastAndroid.show('Your in-time was adjusted to '+Moment(hour + ":" + minute, "H:m").format("H:mm"), ToastAndroid.LONG);
				}
				this.setState({ selectedInTime: Moment(hour + ":" + minute, "H:m") });
				if((Date.parse('01/01/2011 ' + Moment(hour + ":" + minute, "H:m").format("H:m:s")) >= Date.parse('01/01/2011 ' + Moment(this.state.selectedOutTime).format("H:m:s"))) && Moment(this.state.selectedOutTime).format("H:m") !== "0:0"){
					ToastAndroid.show('Your in-time should be less than out-time', ToastAndroid.LONG);
					break;
				}
				else{
					this.loadData();
				}
				break;

			case "OUT":
				if(isTimeAdjusted){
					ToastAndroid.show('Your out-time was adjusted to '+Moment(hour + ":" + minute, "H:m").format("H:mm"), ToastAndroid.LONG);
				}
				this.setState({ selectedOutTime: Moment(hour + ":" + minute, "H:m") });
				if((Date.parse('01/01/2011 ' + Moment(this.state.selectedInTime).format("H:m:s")) >= Date.parse('01/01/2011 ' + Moment(hour + ":" + minute, "H:m").format("H:m:s"))) && hour + ":" + minute !== "0:0"){
					ToastAndroid.show('Your in-time should be less than out-time', ToastAndroid.LONG);
					break;				
				}
				else{
					this.loadData();
				}
				break;
		}		
	},
	onPressHelp: function(){
		var _this = this;
		Alert.alert(
			"What's wrong with the time?",
			"Your time is automatically adjusted to the nearest half-hour slot.",
            [
              	{text: 'OK', onPress: () => console.log('Cancel Pressed!')}
            ]
		);		
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
	listView: {
		flex: 1
	},
	listViewTitle: {
		padding: 16,
		backgroundColor: '#eeeeee'
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
	helpText: {
		fontSize: 12,
		color: '#ffffff',
		margin: 2
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

//<Text>{Moment(this.state.selectedInTime, "H:m").subtract(Moment().utcOffset(), "minutes").format("H.m") + " " + Moment(this.state.selectedOutTime, "H:m").subtract(Moment().utcOffset(), "minutes").format("H.m")}</Text>