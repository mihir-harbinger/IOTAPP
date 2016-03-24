'use strict';
var React = require('react-native');

var {
	BackAndroid,
	AppRegistry,
	StyleSheet,
	Navigator,
	Image,
	View,
	Text
} = React;

//Get Parse from modules
var Parse = require('parse/react-native');

//Declare top level views
var Splash = require('./views/splash');
var Signin = require('./views/signin');
var Signup = require('./views/signup');
var Home = require('./views/home');

//Registering top level views
var ROUTES = {
	splash: Splash,
	signin: Signin,
	signup: Signup,
	home: Home
};

var _navigator;

module.exports = React.createClass({
	componentWillMount: function(){
		Parse.initialize("NR9dHycpjgUn0Bcem3lH1q0jniHSiynGh5yKe4Ws", "Z1CBwM16Uaa5D6imGgSFmoKmCdwC76p0V2HMa7ab", "oPTU82hoGomzVFRe1E8r9ZTgB3Q6D2UeYaI9MQmQ");
	},
    render: function(){

        return(

        	//Render first view through initialRoute
			<Navigator 
				style={styles.container} 
				initialRoute={{ name: 'home', index: 0 }} 
				renderScene={ this.renderScene } 
				configureScene={ () => { return Navigator.SceneConfigs.PushFromRight; }}
			>
			</Navigator>        	
        )
    },
    renderScene: function(route, navigator){
		
		_navigator = navigator;

		//ROUTES['signin'] => SignIn
		var Component = ROUTES[route.name]; 
		return (
			<Component 
				route={route} 
				navigator={navigator} 
				data={route.data}
			/>
		);    	
    }
});

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1  ) {
     return false;
  }
  _navigator.pop();
  return true;
});