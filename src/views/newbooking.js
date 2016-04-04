'use strict';
var React = require('react-native');

var {
	TouchableNativeFeedback,
  	TouchableHighlight,
  	ScrollView,
  	StyleSheet,
  	TextInput,
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
var LoaderImage = require('../../assets/images/rolling.gif');
var BlankImage = require('../../assets/images/1x1.png')

module.exports = React.createClass({
	getInitialState: function(){
		return{
			title: '',
			description: '',
			errorTitle: '',
			errorDescription: '',
			disableSubmit: false,
			buttonColor: '#0288D1',
			loader: BlankImage
		}
	},
	render: function(){
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
    							onPress={this.onPressCheckAvailability}
    						>
    							<Text style={[styles.button, {color: this.state.buttonColor}]}>CHECK AVAILABILITY</Text>
    						</TouchableHighlight>
    						<Image source={this.state.loader} style={styles.loaderImage} />
    					</View>
    			</ScrollView>
  			</View>
		)
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
	onPressCheckAvailability: function(){

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
		this.setState({ disableSubmit: true, buttonColor: '#939393', loader: LoaderImage });

		var _bookFromTime = parseFloat(Moment(this.state.selectedInTime, "H:m").subtract(Moment().utcOffset(), "minutes").format("H.mm"));
		var _bookToTime = parseFloat(Moment(this.state.selectedOutTime, "H:m").subtract(Moment().utcOffset(), "minutes").format("H.mm"));
		var _bookDate = Moment(this.state.selectedDate).format("D-M-YYYY");
		var _roomMacId = this.state.selectedIndex;
		var _userId = Parse.User.current().getUsername();
		var _title = this.state.title;
		var _description = this.state.description;
		var _statusId = 1;
		var flag=false;

		Parse.Cloud.run('searchRoomListForAvailableTime', {
			bookfromtime: _bookFromTime,
			booktotime: _bookToTime,
			bookdate: _bookDate
		}).then(
			function(result){
				var i, roomList=[], roomStr='', messageString, messageTitle;
				
				for(i=0;i<result.length;i++){
					if(result[i].room_mac_id===_roomMacId){
						flag=true;
					}
					else{
						roomList.push(result[i].room_name);
					}
				}
				if(!flag){
					roomStr = roomList.join(", ");
					if(roomList.length<1){
						messageTitle = "No room available"
						messageString = "Perhaps, try another time slot?"
					}
					else{
						messageTitle = "Room available"
						messageString="Perhaps, try another room? " + (roomList.length > 1 ? roomStr+" are available " : roomStr+" is available ") + "in the same time slot.";
					}

					Alert.alert(
						messageTitle,
						messageString,
			            [
			              	{text: 'OK', onPress: () => _this.setState({ disableSubmit: false, buttonColor: '#0288D1', loader: BlankImage })}
			            ]
					)
				}
				else{
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
							_this.setState({ disableSubmit: false, buttonColor: '#0288D1', loader: BlankImage });
							console.log("[NEW BOOKING API] Error: "+ JSON.stringify(error, null, 2));
						}
					);					
				}
				console.log("[NEW BOOKING API] Success: "+ JSON.stringify(result, null, 2));
			},
			function(error){
				flag=false;
				_this.setState({ disableSubmit: false, buttonColor: '#0288D1', loader: BlankImage });
				console.log("[NEW BOOKING API] Error: "+ JSON.stringify(error, null, 2));
			}			
		);
	},
});

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
	},
	loaderImage: {
		width: 13, 
		height: 13, 
		marginTop: 9
	}
});