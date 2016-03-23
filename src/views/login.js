'use strict';
var React = require('react-native');

var {
	StyleSheet,
	TextInput,
	Image,
	View,
	Text
} = React;

var Icon = require('react-native-vector-icons/MaterialIcons');
var Button = require('../components/button');
var Parse = require('parse/react-native').Parse;

var VisibleLoader = require('../../assets/images/loading.gif');
var HiddenLoader = require('../../assets/images/hidden.png');


module.exports = React.createClass({

	getInitialState: function(){
		return{
			username: '',
			password: '',
			error: '',
			loader: HiddenLoader
		}
	},
	render: function(){
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Icon name="gamepad" size={50} color="#ffffff" />
					<Text style={styles.title}>conference</Text>
				</View>
				<View style={styles.body}>
					<Text style={styles.inputDescriptor}>username</Text>
					<TextInput
						autoCapitalize={'none'}
						style={styles.input}
						autoCorrect={false}
						keyboardType={'email-address'}
						underlineColorAndroid={'#E1F5FE'}
						onChangeText={(text) => this.setState({username: text, error: ''})}
					 />
					 <Text style={styles.inputDescriptor}>password</Text>
					<TextInput
						autoCapitalize={'none'}
						style={styles.input}
						autoCorrect={false}
						secureTextEntry={true}
						underlineColorAndroid={'#E1F5FE'}
						onChangeText={(text) =>this.setState({password: text, error: ''})}
					 />
					 <Button 
					 	text={'LOGIN'} 
					 	onPressColor={'#42A5F5'}
					 	onRelaxColor={'#2196F3'} 
					 	onPress={this.onLoginPress}
					 />
					 <Text 
					 	style={styles.signupMessage} 
					 	onPress={this.onSignupPress}
					 >
					 	Don't have an account? Sign up!
					 </Text>
					 <Text style={styles.errorMessage}>{this.state.error}</Text>
					 <Image source={this.state.loader} style={styles.loader}></Image>
				</View>
			</View>
		)
	},
	onLoginPress: function(){

		if(this.state.username===""){
			return this.setState({
				error: 'Username is missing.'
			});
		}
		if(this.state.password===""){
			return this.setState({
				error: 'Password is missing.'
			});
		}		
		this.setState({ loader: VisibleLoader, error: '' });

		Parse.User.logIn(this.state.username, this.state.password, {
			success: (user) => { 
				this.props.navigator.immediatelyResetRouteStack([{name: 'home'}]);
				console.log(user); 
			},
			error: (data, error) => {
				var errorText;

				switch(error.code){
					case 101: 	errorText="Invalid username or password."
								break;
					case 100: 	errorText="Unable to connect to the internet."
								break;
					default : 	errorText="Something went wrong."
								break;
				}
				this.setState({
					error: errorText,
					loader: HiddenLoader
				});
				console.log(data, error);
			}
		});		
	},
	onSignupPress: function(){
		this.props.navigator.push({name: 'signup'});
	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: 30,
		paddingRight: 30,
		backgroundColor: '#4FC3F7'
	},
	header: {
		flex: 1,
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	body: {
		flex: 2,
	},
	footer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 20
	},
	title: {
		color: '#ffffff',
		fontSize: 30,
	},
	input: {
		padding: 4,
		height: 45,
		fontSize: 22,
		color: '#ffffff',
		marginBottom: 20,
		textAlign: 'center'
	},
	inputDescriptor: {
		color: '#ffffff',
		alignSelf: 'center'
	},
	signupMessage: {
		color: '#ffffff',
		alignSelf: 'center',
		margin: 20,
	},
	errorMessage: {
		color: '#1A237E',
		alignSelf: 'center',
		marginBottom: 10
	},
	loader: {
		height: 10,
		width: 40,
		alignSelf: 'center',
	}	
});