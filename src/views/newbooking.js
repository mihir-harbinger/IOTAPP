'use strict';
var React = require('react-native');

var {
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
var LoaderImage = require('../../assets/images/rolling.gif');
var BlankImage = require('../../assets/images/1x1.png');
var Icon = require('react-native-vector-icons/MaterialIcons');

module.exports = React.createClass({
	getInitialState: function(){
		return{
			title: '',
			description: '',
			errorTitle: '',
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
	        		title={''}
    	    		navigator={this.props.navigator}
        			sidebarRef={this}
        			isChildView={true}
      			/>
    			<View style={styles.body} keyboardShouldPersistTaps={true}>
    				<View style={styles.panel} elevation={3}>
    					<Text style={{color: '#ffffff'}}>Title</Text>
    					<TextInput
							underlineColorAndroid={'#E1F5FE'} 
							style={styles.inputTitle}
							autoFocus={true}
							autoCapitalize={'words'}
							autoCorrect={false}
							onChangeText={(text) =>this.setState({title: text, errorTitle: ''})}
    					/>
    					<Text style={styles.errorMessage}>{this.state.errorTitle}</Text>
						<TextInput 
							underlineColorAndroid={'#E1F5FE'} 
							placeholder={'Description'}
							placeholderTextColor={'#B3E5FC'}
							style={styles.input}
							autoCapitalize={'sentences'}
							autoCorrect={false}
							onChangeText={(text) =>this.setState({description: text})}
						>
						</TextInput>

    				</View>
					<View style={{padding: 10}}>
						<View style={styles.detailWrapper}>
							<View style={styles.heading}>
								<Icon name="label" size={20} color="#cccccc" />
							</View>
							<View style={styles.info}>
								<Text>{this.props.data.room_name}</Text>
							</View>
						</View>    					
						<View style={styles.detailWrapper}>
							<View style={styles.heading}>
								<Icon name="event-available" size={20} color="#cccccc" />
							</View>
							<View style={styles.info}>
								<Text>{Moment(this.props.params.date, "D-M-YYYY").format("MMMM Do YYYY")}</Text>
							</View>
						</View>
						<View style={styles.detailWrapper}>
							<View style={styles.heading}>
								<Icon name="access-time" size={20} color="#cccccc" />
							</View>
							<View style={styles.info}>
								<Text>{Moment(this.props.params.inTime, "H.m").format("H:mm") + " - " + Moment(this.props.params.outTime, "H.m").format("H:mm")}</Text>
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
							onPress={this.onPressConfirm}
						>
							<Text style={[styles.button, {color: this.state.buttonColor}]}>CONFIRM</Text>
						</TouchableHighlight>
						<Image source={this.state.loader} style={styles.loaderImage} />
					</View>
    			</View>
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
	onPressConfirm: function(){

		if(this.state.disableSubmit){
			return;
		}

		if(!this.state.title){
			this.setState({errorTitle: 'You need a cool title!'});
			return;
		}

		var _this = this;
		this.setState({ disableSubmit: true, buttonColor: '#939393', loader: LoaderImage });

		var _bookFromTime = parseFloat(Moment(this.props.params.inTime, "H.m").subtract(Moment().utcOffset(), "minutes").format("H.mm"));
		var _bookToTime = parseFloat(Moment(this.props.params.outTime, "H.m").subtract(Moment().utcOffset(), "minutes").format("H.mm"));
		var _bookDate = Moment(this.props.params.date, "D-M-YYYY").format("D-M-YYYY");
		var _userId = Parse.User.current().getUsername();
		var _title = this.state.title;
		var _description = this.state.description;
		var _statusId = 1;

		Parse.Cloud.run('bookRoomFromAppCloudFunction', {
			book_fromtime: _bookFromTime,
			book_totime: _bookToTime,
			book_date: _bookDate,
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
	panel: {
		paddingRight: 10,
		paddingBottom: 10,
		paddingLeft: 75,
		backgroundColor: '#4FC3F7',
	},	
	inputTitle: {
		color: '#ffffff',
		padding: 4,
		height: 55,
		fontSize: 26,
	},
	input: {
		padding: 4,
		height: 45,
		fontSize: 16,
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold'
	},
	description: {
		marginTop: 2,
		color: '#939393'
	},
	detailWrapper: {
		borderBottomWidth: 1,
		borderBottomColor: '#f5f5f5',
		flexDirection: 'row',
		paddingTop: 10,
		paddingBottom: 10
	},
	heading: {
		width: 70,
		paddingLeft: 10
	},
	info: {
		flex: 1
	},
	bold: {
		fontWeight: 'bold'
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
		color: '#1A237E',
		fontSize: 12,
		marginLeft: 3,
		marginBottom: 10
	},
	loaderImage: {
		width: 13, 
		height: 13, 
		marginTop: 9
	}
});