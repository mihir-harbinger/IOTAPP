'use strict';
var React = require('react-native');

var {
	TouchableHighlight,
	StyleSheet,
	View,
	Text
} = React;

module.exports = React.createClass({

	render: function(){
		return(
			<TouchableHighlight style={styles.wrapper} underlayColor={'#939393'}>
				<View style={styles.container}>
					<Text style={styles.title}>{this.props.data.room_name}</Text>
					<Text style={styles.location}>{this.props.data.room_location == 'GP' ? 'Global Port' : this.props.data.room_location}</Text>
				</View>
			</TouchableHighlight>
		);
	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 15,
		backgroundColor: '#ffffff',
		borderRadius: 2
	},
	wrapper: {
		marginBottom: 10,
		borderRadius: 2
	},
	title: {
		fontSize: 22,
		color: '#a7a7a7'
	}
})