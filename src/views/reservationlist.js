'use strict';
var React = require('react-native');

var {
	TouchableNativeFeedback,
	InteractionManager,
  	TouchableHighlight,
  	ScrollView,
  	StyleSheet,
  	ListView,
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
var MeetingItem = require('../components/meetingitem');

module.exports = React.createClass({
	getInitialState: function(){
		return{
			rawData: [],
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			loaded: true,
			isReloadRequired: false
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
		this.setState({ rawData: [], isReloadRequired: false, loaded: false });

		Parse.Cloud.run('fetchBookingListForUserCloudFunction', {
			user_id: Parse.User.current().getUsername()
		}).then(

			function(result){
				var cleanData = [];
				for(var i=0;i<result.length;i++){
					cleanData.push(result[i].toJSON());
				}

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
		return(
    		<View style={styles.container}>
          		<ToolbarAfterLoad
          			navIcon={require('../../assets/images/arrow_back.png')}
	        		title={'Reservation List'}
    	    		navigator={this.props.navigator}
        			sidebarRef={this}
        			isChildView={true}
      			/>
      			{this.state.loaded ? this.renderListView() : this.renderLoadingView()}
  			</View>
		)
	},
	renderListView: function(){
		return(
			<ScrollView style={styles.body}>
				<ListView 
    				dataSource={this.state.dataSource}
        			renderRow={this.renderReservation}
        			style={styles.listView}
        		/>
			</ScrollView>
		)
	},
	renderLoadingView: function(){
		return <LoadingView />
	},
	renderReloadView: function(){
		return <ReloadView loadData={this.loadData} />
	},
	renderReservation: function(item){
		return <MeetingItem item={item} navigator={this.props.navigator} />
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
	listView:{
		flex: 1
	},
});