var React = require('react-native');

var {
	StyleSheet,
	Image,
	View
} = React;

var ToolbarBeforeLoad = require('./toolbarBeforeLoad');

module.exports = React.createClass({

	render: function(){
		return(
			<View style={styles.container}>
	      		<ToolbarBeforeLoad
	      			navIcon={this.props.navIcon}
	        		title={this.props.title}
	        		navigator={this.props.navigator}
	        		isChildView={false}
	  			/>			
	  			<View style={styles.loadingScene}>
					<Image source={require('../../assets/images/loader.gif')} style={styles.loader}></Image>
				</View>
			</View>
		);
	}	
});

const styles = StyleSheet.create({
	container: {
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
	}
});