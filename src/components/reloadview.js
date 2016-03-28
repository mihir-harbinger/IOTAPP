var React = require('react-native');

var {
	StyleSheet,
	Image,
	View,
	Text
} = React;

var ToolbarBeforeLoad = require('./toolbarBeforeLoad');
var Icon = require('react-native-vector-icons/MaterialIcons');

module.exports = React.createClass({

	render: function(){
		return(
			<View style={styles.container}>
          		<ToolbarBeforeLoad
	        		title={this.props.title}
	        		navigator={this.props.navigator}
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
	loadData: function(){
		this.props.loadData();
	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1
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
	reloadArrow: {
		alignSelf: 'center',
		margin: 10,
	},
	errorMessageReload: {
		alignSelf: 'center',
		fontSize: 15
	},	
})