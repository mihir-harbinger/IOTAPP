var React = require('react-native');

var {
  	TouchableHighlight,
  	TimePickerAndroid,
  	DatePickerAndroid,
  	ScrollView,
  	StyleSheet,
  	TextInput,
  	ListView,
  	Platform,
  	Picker,
  	Image,
  	Text,
  	View
} = React;

//get libraries
var Parse = require('parse/react-native').Parse;
var Moment = require('moment');

//get components
var ToolbarBeforeLoad = require('../components/toolbarBeforeLoad');
var ToolbarAfterLoad = require('../components/toolbarAfterLoad');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Room = require('../components/room');

module.exports = React.createClass({
	getInitialState: function(){
		return{
			rawData: [],
			loaded: false,
			isReloadRequired: false,
			selectedIndex: '',
			selectedDate: Moment(),
			minDate: new Date(),
			selectedInHour: parseInt(roundToNextSlot(Moment()).format("HH"), 10),
			selectedInMinute: parseInt(roundToNextSlot(Moment()).format("mm"), 10),
			selectedOutHour: parseInt(Moment(roundToNextSlot(Moment())).add(30, "minutes").format("HH"), 10),
			selectedOutMinute: parseInt(Moment(roundToNextSlot(Moment())).add(30, "minutes").format("mm"), 10)
		}
	},
	componentDidMount: function(){
		this.loadData();
	},
	loadData: function(){

		var _this = this;
		this.API();

		setTimeout(function(){
			if(_this.isMounted()){
				if(_this.state.loaded===false){
					_this.setState({
						isReloadRequired: true,
					})
				}
			}
		}, 10000);
	},
	API: function(){
		var _this = this;
		this.setState({ isReloadRequired: false, loaded: false });

		Parse.Cloud.run('fetchListOfRooms', {}).then(

			function(result){

				//Convert ParseObject to JSON; then push into an array.
				var cleanData = [];
				for(var i=0;i<result.length;i++){
					cleanData.push(result[i].toJSON());
				}

				console.log("[NEW BOOKING API] Success: ", cleanData);

				if(_this.isMounted()){
					_this.setState({ 
						rawData: cleanData,
						loaded: true,
						isReloadRequired: false,
						selectedIndex: cleanData[0].room_mac_id,
					});					
				}
			},
			function(error){
				_this.setState({ isReloadRequired: true, loaded: false })
				console.log("[NEW BOOKING API] Error: "+ JSON.stringify(error, null, 2));
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
    		<View style={styles.container}>
          		<ToolbarAfterLoad
          			navIcon={require('../../assets/images/arrow_back.png')}
	        		title={'New Booking'}
    	    		navigator={this.props.navigator}
        			sidebarRef={this}
        			isChildView={true}
      			/>
    			<ScrollView style={styles.body}>
    				<View style={styles.wizardWrapper}>
    					<View style={styles.wizardStep}>
	    					<View style={styles.wizardStepTitle}>
	    						<View style={{flex: 1}}>
	    							<Icon name="looks-one" size={30} color="#4FC3F7" />
	    						</View>
	    						<View style={{flex: 5}}>
	    							<Text style={{color: '#4FC3F7', fontSize: 15, marginTop: 3.7}}>Set Meeting Title</Text>
	    						</View>
	    					</View>
	    					<View style={styles.wizardstepAction}>
	    						<View style={{flex: 1}}>
	    							<Icon name="looks-one" size={30} color="#ffffff" />
	    						</View>
	    						<View style={{flex: 5}}>
	    							<TextInput 
	    								underlineColorAndroid={'#cccccc'} 
	    								style={styles.input}
	    								autoCapitalize={'words'}
	    								autoCorrect={false}
	    							>
	    							</TextInput>
	    						</View>    					
	    					</View>
    					</View>
    					<View style={styles.wizardStep}>
	    					<View style={styles.wizardStepTitle}>
	    						<View style={{flex: 1}}>
	    							<Icon name="looks-two" size={30} color="#4FC3F7" />
	    						</View>
	    						<View style={{flex: 5}}>
	    							<Text style={{color: '#4FC3F7', fontSize: 15, marginTop: 3.7}}>Set Meeting Description</Text>
	    						</View>
	    					</View>
	    					<View style={styles.wizardstepAction}>
	    						<View style={{flex: 1}}>
	    							<Icon name="looks-two" size={30} color="#ffffff" />
	    						</View>
	    						<View style={{flex: 5}}>
	    							<TextInput 
	    								underlineColorAndroid={'#cccccc'} 
	    								style={styles.input}
	    								autoCapitalize={'sentences'}
	    								autoCorrect={false}
	    							>
	    							</TextInput>
	    						</View>    					
	    					</View>
    					</View>
    					<View style={styles.wizardStep}>
	    					<View style={styles.wizardStepTitle}>
	    						<View style={{flex: 1}}>
	    							<Icon name="looks-3" size={30} color="#4FC3F7" />
	    						</View>
	    						<View style={{flex: 5}}>
	    							<Text style={{color: '#4FC3F7', fontSize: 15, marginTop: 3.7}}>Select Conference Room</Text>
	    						</View>
	    					</View>
	    					<View style={styles.wizardstepAction}>
	    						<View style={{flex: 1}}>
	    							<Icon name="looks-3" size={30} color="#ffffff" />
	    						</View>
	    						<View style={{flex: 5}}>
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
	    					<View style={styles.wizardStepTitle}>
	    						<View style={{flex: 1}}>
	    							<Icon name="looks-4" size={30} color="#4FC3F7" />
	    						</View>
	    						<View style={{flex: 5}}>
	    							<Text style={{color: '#4FC3F7', fontSize: 15, marginTop: 3.7}}>Select Desired Date</Text>
	    						</View>
	    					</View>
	    					<View style={styles.wizardstepAction}>
	    						<View style={{flex: 1}}>
	    							<Icon name="looks-4" size={30} color="#ffffff" />
	    						</View>
	    						<View style={{flex: 5}}>
				    				<View style={styles.timeWrapper}>
				    					<TouchableHighlight onPress={this.onPressSetDate.bind(this, 'min', {date: this.state.minDate, minDate: new Date()})} style={styles.selectedDateTimeTouchable} underlayColor={'#e5e5e5'}>
				    						<Text style={styles.dateTime}>{this.state.selectedDate.format("MMMM Do YYYY")}</Text>
				    					</TouchableHighlight>
				    				</View>
	    						</View>    					
	    					</View>
    					</View>
    					<View style={styles.wizardStep}>
	    					<View style={styles.wizardStepTitle}>
	    						<View style={{flex: 1}}>
	    							<Icon name="looks-5" size={30} color="#4FC3F7" />
	    						</View>
	    						<View style={{flex: 5}}>
	    							<Text style={{color: '#4FC3F7', fontSize: 15, marginTop: 3.7}}>Select In-Out Time</Text>
	    						</View>
	    					</View>
	    					<View style={styles.wizardstepAction}>
	    						<View style={{flex: 1}}>
	    							<Icon name="looks-5" size={30} color="#ffffff" />
	    						</View>
	    						<View style={{flex: 5}}>
				    				<View style={styles.timeWrapper}>
				    					<TouchableHighlight onPress={this.onPressSetInOutTime.bind(this, "IN", {hour: this.state.selectedInHour, minute: this.state.selectedInMinute})} style={styles.selectedDateTimeTouchable} underlayColor={'#e5e5e5'}>
				    						<Text style={styles.dateTime}>IN: <Text style={styles.selectedDateTime}>{this.getInHour()+":"+this.getInMinute()}</Text></Text>
				    					</TouchableHighlight>
				    					<TouchableHighlight onPress={this.onPressSetInOutTime.bind(this, "OUT", {hour: this.state.selectedOutHour, minute: this.state.selectedOutMinute})} style={styles.selectedDateTimeTouchable} underlayColor={'#e5e5e5'}>
				    						<Text style={styles.dateTime}>OUT: <Text style={styles.selectedDateTime}>{this.getOutHour()+":"+this.getOutMinute()}</Text></Text>
				    					</TouchableHighlight>				    					
				    				</View>
	    						</View>    					
	    					</View>
    					</View>    					
    				</View>
    			</ScrollView>
  			</View>
		)
	},
	renderLoadingView: function(){
		return(
			<View style={styles.container}>
          		<ToolbarBeforeLoad
          			navIcon={require('../../assets/images/arrow_back.png')}
	        		title={'New Booking'}
	        		navigator={this.props.navigator}
	        		componentRef={this}
	        		isChildView={true}
      			/>			
      			<View style={styles.loadingScene}>
					<Image source={require('../../assets/images/loader.gif')} style={styles.loader}></Image>
				</View>
			</View>
		)
	},
	renderReloadView: function(){
		return(
			<View style={styles.container}>
          		<ToolbarBeforeLoad
	        		title={'Home'}
	        		navigator={this.props.navigator}
	        		componentRef={this}
	        		isChildView={true}
      			/>
      			<View style={styles.reloadScene}>
      				<View style={styles.centerWeighted}>
      					<Image source={require('../../assets/images/uh_oh_transparent.png')} style={styles.errorImage}></Image>
      					<Text style={styles.errorMessageReload}>Oops! Something went wrong :(</Text>
      					<Icon name="replay" size={25} color="#999999" style={styles.reloadArrow} onPress={ this.loadData } />
      				</View>
				</View>
			</View>
		);
	},	
	renderRoomList: function(){
		return this.state.rawData.map(function(room){
			return(
 				<Picker.Item label={room.room_name} value={room.room_mac_id} key={room.room_mac_id}></Picker.Item>
			);
		});		
	},
	onPressSetInOutTime: async function(mode, options){
		const {action, minute, hour} = await TimePickerAndroid.open(options);
		if(!(action === TimePickerAndroid.timeSetAction)){
			return;
		}
		switch(mode){
			case "IN"	: 	this.setState({ selectedInHour: parseInt(hour, 10), selectedInMinute: parseInt(minute, 10) });
							break;
			case "OUT"	: 	this.setState({ selectedOutHour: parseInt(hour, 10), selectedOutMinute: parseInt(minute, 10) });
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
		console.log(dateString);
		this.setState({ selectedDate: Moment(date) });

	},
	getInHour: function(){
		return this.state.selectedInHour === 0 ? "00" : this.state.selectedInHour;
	},
	getInMinute: function(){
		return this.state.selectedInMinute === 0 ? "00" : this.state.selectedInMinute;
	},
	getOutHour: function(){
		return this.state.selectedOutHour === 0 ? "00" : this.state.selectedOutHour;
	},
	getOutMinute: function(){
		return this.state.selectedOutMinute === 0 ? "00" : this.state.selectedOutMinute;
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
		backgroundColor: '#f5f5f5',
		padding: 10
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
	reloadScene:{
		flex: 1,
		backgroundColor: '#ffffff',
	},
	centerWeighted: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'		
	},
	errorImage: {
		width: 300,
		height: 225
	},
	wizardWrapper: {
		backgroundColor: '#ffffff',
	},
	wizardStep: {
		borderBottomWidth: 1,
		borderBottomColor: '#f5f5f5',
		padding: 15,
	},
	wizardStepTitle: {
		flexDirection: 'row',
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
})