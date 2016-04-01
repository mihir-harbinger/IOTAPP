'use strict';
var React = require('react-native');
var {
	StyleSheet,
	ScrollView,
	View,
	Text
} = React;

var ToolbarAfterLoad = require('../components/toolbarAfterLoad');

module.exports = React.createClass({
	render: function(){
		return(
    		<View style={styles.container}>
          		<ToolbarAfterLoad
          			navIcon={require('../../assets/images/arrow_back.png')}
	        		title={this.props.data.title}
    	    		navigator={this.props.navigator}
        			sidebarRef={this}
        			isChildView={true}
      			/>
    			<ScrollView style={styles.body}>
    				<View style={styles.body}>
    					<Text style={styles.title}>{this.props.data.title}</Text>
    					<Text>{JSON.stringify(this.props.data, null, 2)}</Text>
    				</View>
    			</ScrollView>
  			</View>
  		);
	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	body: {
		flex: 1,
		padding: 10,
		backgroundColor: '#ffffff'
	},	
})