var React = require('react-native');

var {
	ToolbarAndroid,
	StyleSheet,
} = React;

module.exports = React.createClass({
	render: function(){
		return(
			<ToolbarAndroid
          		navIcon={require('../../assets/images/stack.png')}
            	title={this.props.title}
            	titleColor='#ffffff'
            	style={styles.toolbar}
            	actions={[{title: 'About App', show: 'never'}, {title: 'Settings', show: 'never'}, {title: 'Logout', show: 'never'}]}
            	onActionSelected={this._onActionSelected}
            	onIconClicked={this._onIconClicked}
          	>
          	</ToolbarAndroid>			
		)		
	},
	_onActionSelected: function(position){
		if(position === 2){
			this.props.navigator.immediatelyResetRouteStack([{name: 'signin'}]);			
		}
	},
	_onIconClicked: function(){
		this.props.sidebarRef.refs['DRAWER'].openDrawer();
	}
});

const styles = StyleSheet.create({
	toolbar:{
    	height: 55,
    	backgroundColor: '#4FC3F7',
  	}	
});