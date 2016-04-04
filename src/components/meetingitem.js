'use strict';
var React = require('react-native');

var {
	TouchableHighlight,
	StyleSheet,
	View,
	Text
} = React;

//get libraries
var Moment = require('moment');

var colorMap = {
	A: 'f44336',	B: 'E91E63',	C: '9C27B0',	D: '673AB7',
	E: '3F51B5',	F: '2196F3',	G: '03A9F4',	H: '00BCD4',
	I: '009688',	J: '4CAF50',	K: '8BC34A',	L: 'CDDC39',
	M: 'FDD835',	N: 'FFC107',	O: 'FF9800',	P: 'FF5722',
	Q: '795548',	R: '9E9E9E',	S: '607D8B',	T: '673AB7',
	U: '424242',	V: 'A5D6A7',	W: '01579B',	X: '827717',
	Y: '00838F',	Z: '9E9D24'
};

module.exports = React.createClass({
	render: function(){
		return(
			<TouchableHighlight underlayColor={'#f5f5f5'} onPress={this.onPressMeetingItem}>
				<View style={styles.wrapper}>
					<View style={styles.alphabetIcon}>
						<View style={[styles.circle, {backgroundColor: '#'+colorMap[titleCase(this.props.item.title.charAt(0))]}]}>
							<Text style={styles.alphabet}>{titleCase(this.props.item.title.charAt(0))}</Text>
						</View>
					</View>
					<View style={styles.titleWrapper}>
						<Text style={styles.title}>{this.props.item.title}</Text>
						<Text style={styles.timestamp}>{Moment(this.props.item.book_date, "D-M-YYYY").format("MMMM Do YYYY")}</Text>
					</View>
				</View>
			</TouchableHighlight>
		);
	},
	onPressMeetingItem: function(){
		this.props.navigator.push({name: 'meetingdetails', data: this.props.item});
	}
});

function titleCase(string) { return string.toUpperCase(); }

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#f5f5f5',
		flexDirection: 'row'
	},
	title: {
		fontSize: 18,
		color: '#666666'
	},
	timestamp: {
		color: '#999999',
		marginTop: 3
	},
	alphabetIcon: {
		flex: 1
	},
	titleWrapper: {
		flex: 4
	},
	circle: {
		width: 50,
		height: 50,
		borderRadius: 25	,
		alignItems: 'center',
		justifyContent: 'center',
	},
	alphabet: {
		fontSize: 24,
		color: '#ffffff'
	}
});