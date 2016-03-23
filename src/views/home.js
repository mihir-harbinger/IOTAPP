'use strict';
var React = require('react-native');

var {
	StyleSheet,
	View,
	Text
} = React;

module.exports = React.createClass({
	render: function(){
		return(
			<View style={styles.container}>
				<Text>Home</Text>
			</View>
		)
	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
});