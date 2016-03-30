var React = require('react-native');

var {
	TouchableNativeFeedback,
	InteractionManager,
  	TouchableHighlight,
  	TimePickerAndroid,
  	DatePickerAndroid,
  	ScrollView,
  	StyleSheet,
  	TextInput,
  	ListView,
  	Platform,
  	Picker,
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
			loaded: false,
			isReloadRequired: false,
			title: '',
			description: '',
			selectedIndex: '',
			selectedDate: new Date(),
			selectedInTime: roundToNextSlot(Moment()).format("H:m"),
			selectedOutTime: roundToNextSlot(Moment()).add(30, "minutes").format("H:m"),
			errorTitle: '',
			errorDescription: '',
			disableSubmit: false,
			buttonColor: '#0288D1'
		}
	},
	componentDidMount: function(){
		InteractionManager.runAfterInteractions(() => {  
			this.setState({
				rawData: this.props.data,
				loaded: true
			})    
		});
	},
	render: function(){
		if(!this.state.loaded){
			return this.renderLoadingView();
		}

		return(
    		<View style={styles.container}>
          		<ToolbarAfterLoad
          			navIcon={require('../../assets/images/arrow_back.png')}
	        		title={'New Booking'}
    	    		navigator={this.props.navigator}
        			sidebarRef={this}
        			isChildView={true}
      			/>
    			<ScrollView style={styles.body} keyboardShouldPersistTaps={true}>
    				<View style={styles.wizardWrapper}>
    					<View style={styles.wizardStep}>
	    					<Text style={styles.wizardStepText}>Meeting Title</Text>
	    					<View style={styles.wizardstepAction}>
	    						<View style={{flex: 1}}>
	    							<TextInput 
	    								underlineColorAndroid={'#cccccc'} 
	    								style={styles.input}
	    								autoCapitalize={'words'}
	    								autoCorrect={false}
	    								onChangeText={(text) =>this.setState({title: text, errorTitle: ''})}
	    							>
	    							</TextInput>
	    							<Text style={styles.errorMessage}>{this.state.errorTitle}</Text>
	    						</View>
	    					</View>
    					</View>
    					<View style={styles.wizardStep}>
	    					<Text style={styles.wizardStepText}>Meeting Description</Text>
	    					<View style={styles.wizardstepAction}>
	    						<View style={{flex: 1}}>
	    							<TextInput 
	    								underlineColorAndroid={'#cccccc'} 
	    								style={styles.input}
	    								autoCapitalize={'sentences'}
	    								autoCorrect={false}
	    								onChangeText={(text) =>this.setState({description: text, errorDescription: ''})}
	    							>
	    							</TextInput>
	    							<Text style={styles.errorMessage}>{this.state.errorDescription}</Text>
	    						</View>
	    					</View>
    					</View>
    					<View style={styles.wizardStep}>
	    					<Text style={styles.wizardStepText}>Conference Room</Text>
	    					<View style={styles.wizardstepAction}>
	    						<View style={{flex: 1}}>
				    				<Picker 
				    					mode={"dropdown"} 
				    					selectedValue={this.state.selectedIndex}
				    					onValueChange={(index) => this.setState({ selectedIndex: index })}
				    				>
				    					{this.renderRoomList()}
				    				</Picker>
	    						</View>
	    					</View>
    					</View>
    					<View style={styles.wizardStep}>
	    					<Text style={styles.wizardStepText}>Desired Date</Text>
	    					<View style={styles.wizardstepAction}>
	    						<View style={{flex: 1}}>
				    				<View style={styles.timeWrapper}>
				    					<TouchableHighlight onPress={this.onPressSetDate.bind(this, 'min', {date: this.state.selectedDate, minDate: new Date()})} style={styles.selectedDateTimeTouchable} underlayColor={'#e5e5e5'}>
				    						<Text style={styles.dateTime}>{Moment(this.state.selectedDate).format("MMMM Do YYYY")}</Text>
				    					</TouchableHighlight>
				    				</View>
	    						</View>
	    					</View>
    					</View>
    					<View style={styles.wizardStep}>
    						<View style={{flexDirection: 'row'}}>
    							<Text style={styles.wizardStepText}>In-Out Time </Text>
    							<TouchableHighlight 
    								onPress={this.onPressHelp}
    								underlayColor={'#e5e5e5'}
    							>
    								<Text style={styles.wizardStepText}>[?]</Text>
    							</TouchableHighlight>
    						</View>
	    					<View style={styles.wizardstepAction}>
	    						<View style={{flex: 1}}>
				    				<View style={styles.timeWrapper}>
				    					<TouchableHighlight 
				    						onPress={this.onPressSetInOutTime.bind(this, "IN", {hour: this._parseHour(this.state.selectedInTime), minute: this._parseMinute(this.state.selectedInTime)})} 
				    						style={styles.selectedDateTimeTouchable} 
				    						underlayColor={'#e5e5e5'}
				    					>
				    						<Text style={styles.dateTime}>IN: <Text style={styles.selectedDateTime}>{this._prettyPrintTime(this.state.selectedInTime)}</Text></Text>
				    					</TouchableHighlight>
				    					<TouchableHighlight 
				    						onPress={this.onPressSetInOutTime.bind(this, "OUT", {hour: this._parseHour(this.state.selectedOutTime), minute: this._parseMinute(this.state.selectedOutTime)})} 
				    						style={styles.selectedDateTimeTouchable} 
				    						underlayColor={'#e5e5e5'}
				    					>
				    						<Text style={styles.dateTime}>OUT: <Text style={styles.selectedDateTime}>{this._prettyPrintTime(this.state.selectedOutTime)}</Text></Text>
				    					</TouchableHighlight>				    					
				    				</View>
	    						</View>
	    					</View>
    					</View>
    					<View style={{flex: 1, justifyContent: 'flex-end', padding: 20, flexDirection: 'row'}}>
    						<TouchableHighlight 
    							underlayColor={'#f5f5f5'} 
    							style={styles.buttonTouchable}
    							onPress={this.onPressCancel}
    						>
    							<Text style={[styles.button, styles.gray]}>CANCEL</Text>
    						</TouchableHighlight>
    						<TouchableHighlight 
    							underlayColor={'#f5f5f5'} 
    							style={styles.buttonTouchable}
    							onPress={this.onPressBook}
    						>
    							<Text style={[styles.button, {color: this.state.buttonColor}]}>BOOK NOW</Text>
    						</TouchableHighlight>
    					</View>
    				</View>
    			</ScrollView>
  			</View>
		)
	},
	renderLoadingView: function(){
		return <LoadingView title={'New Booking'} navigator={this.props.navigator} navIcon={require('../../assets/images/arrow_back.png')} />
	},
	renderRoomList: function(){
		return this.state.rawData.map(function(room){
			return(
 				<Picker.Item label={room.room_name} value={room.room_mac_id} key={room.room_mac_id}></Picker.Item>
			);
		});		
	},
	onPressSetInOutTime: async function(mode, options){
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
			case "IN"	: 	this.setState({ selectedInTime: hour + ":" + minute });
							break;
			case "OUT"	: 	this.setState({ selectedOutTime: hour + ":" + minute });
							break;
		}
	},
	onPressSetDate: async function(mode, options){
		const {action, year, month, day} = await DatePickerAndroid.open(options);
		if (action === DatePickerAndroid.dismissedAction) {
			return;
		}
		var dateString = year + "-" + ((month+1)<10 ? "0"+(month+1) : month+1) + "-" + (day < 10 ? "0"+day : day);
		var date = new Date(dateString);
		this.setState({ selectedDate: date });
	},
	onPressCancel: function(){
		var _this = this;
		Alert.alert(
			"Confirmation", 
			"Are you sure you want to cancel?",
            [
              	{text: 'No', onPress: () => console.log('OK Pressed!')},
              	{text: 'Yes', onPress: () => _this.props.navigator.pop()}
            ]
		)
	},
	onPressBook: function(){

		if(this.state.disableSubmit){
			return;
		}

		if(!this.state.title){
			this.setState({errorTitle: 'You need a cool title!'});
			return;
		}
		if(this.state.description.length < 10 && this.state.description.length > 0){
			this.setState({errorDescription: 'Please provide a proper description.'});
			return;
		}

		var _this = this;

		var _bookFromTime = parseFloat(Moment(this.state.selectedInTime, "H:m").subtract(Moment().utcOffset(), "minutes").format("H.mm"));
		var _bookToTime = parseFloat(Moment(this.state.selectedOutTime, "H:m").subtract(Moment().utcOffset(), "minutes").format("H.mm"));
		var _bookDate = Moment(this.state.selectedDate).format("D-M-YYYY");
		var _roomMacId = this.state.selectedIndex;
		var _userId = Parse.User.current().getUsername();
		var _title = this.state.title;
		var _description = this.state.description;
		var _statusId = 1;

		//this.setState({ disableSubmit: true, buttonColor: '#939393' });

		Parse.Cloud.run('searchRoomListForAvailableTime', {
			bookfromtime: _bookFromTime,
			booktotime: _bookToTime,
			bookdate: _bookDate
		}).then(
			function(result){

				var i, j, roomList=[], roomStr='', flag=false, base = "Perhaps, try changing the room? ";
				
				for(i=0;i<result.length;i++){
					if(result[i].room_mac_id===_roomMacId){
						flag=true;
					}
					else{
						roomList.push(result[i].room_name);
					}
				}
				
				if(!flag){
					roomStr = roomList.join(",");
					roomStr = roomList.length > 1 ? base+roomStr+" are available." : base+roomStr+" is available.";
					Alert.alert(
						"Room Unavailable",
						roomStr,
			            [
			              	{text: 'OK', onPress: () => console.log('OK Pressed!')}
			            ]
					)
				}
				console.log("[NEW BOOKING API] Success: "+ JSON.stringify(result, null, 2));
			},
			function(error){
				//this.setState({ disableSubmit: false, buttonColor: '#0288D1' });
				console.log("[NEW BOOKING API] Error: "+ JSON.stringify(error, null, 2));
			}			
		);
		return;

		Parse.Cloud.run('bookRoomFromAppCloudFunction', {
			book_fromtime: _bookFromTime,
			book_totime: _bookToTime,
			book_date: _bookDate,
			room_mac_id: _roomMacId,
			user_id: _userId,
			title: _title,
			description: _description,
			status_id: _statusId
		}).then(
			function(result){
				_this.props.navigator.replace({name: 'success', data: { date: Moment(_bookDate, "D-M-YYYY").format("MMMM Do YYYY"),}});
				console.log("[NEW BOOKING API] Success: "+ JSON.stringify(result, null, 2));
			},
			function(error){
				this.setState({ disableSubmit: false, buttonColor: '#0288D1' });
				console.log("[NEW BOOKING API] Error: "+ JSON.stringify(error, null, 2));
			}
		);
	},
	onPressHelp: function(){
		var _this = this;
		Alert.alert(
			"What's wrong with the time?",
			"Your time is automatically adjusted to the next half-hour slot.",
            [
              	{text: 'OK', onPress: () => console.log('Cancel Pressed!')}
            ]
		);		
	},
	_parseHour: function(time){
		return parseInt(time.slice(0, time.indexOf(":")));
	},
	_parseMinute: function(time){
		return parseInt(time.substr(time.indexOf(":") + 1));
	},
	_prettyPrintTime: function(time){
		var hour = this._parseHour(time);
		var minute = this._parseMinute(time);

		hour = hour < 9 ? "0" + hour : hour.toString();
		minute = minute < 9 ? "0" + minute : minute.toString();
		return hour + ":" + minute;
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
	wizardWrapper: {
		backgroundColor: '#ffffff',
	},
	wizardStep: {
		borderBottomWidth: 1,
		borderBottomColor: '#f5f5f5',
		padding: 20,
	},
	wizardStepTitle: {
		flexDirection: 'row',
	},
	wizardStepText: {
		color: '#939393', 
		fontSize: 15, 
		marginTop: 4
	},
	wizardstepAction: {
		flexDirection: 'row'
	},
	selectedDateTimeTouchable: {
		padding: 10
	},
	dateTime:{
		color: '#000000',
		fontSize: 16
	},
	selectedDateTime: {
		color: '#999999',
		fontSize: 16
	},
	timeWrapper: {
		flexDirection: 'row',
		marginBottom: 5
	},
	input: {
		padding: 4,
		height: 40,
		fontSize: 16,
	},
	note: {
		color: '#939393',
		fontSize: 12,
		fontStyle: 'italic'
	},
	button: {
		borderRadius: 2,
		marginTop: 5,
		marginRight: 10,
		marginBottom: 5,
		marginLeft: 10,
		fontSize: 15
	},
	buttonTouchable: {
		borderRadius: 2
	},
	blue: {
		color: '#0288D1',
	},
	gray: {
		color: '#939393',
	},
	errorMessage: {
		color: '#ef5350',
		fontSize: 12,
		marginLeft: 3,
	}
})