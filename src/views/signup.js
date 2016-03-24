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
			passwordConfirmation: '',
			error: '',
			loader: HiddenLoader
		}
	},
	render: function(){
		return(
			<View style={styles.container}>
				<View style={styles.header}>
					<Icon name="account-circle" size={50} color="#0288D1" />
					<Text style={styles.title}>quick sign up</Text>
				</View>
				<View style={styles.body}>
					<Text style={styles.inputDescriptor}>You'll need a username</Text>
					<TextInput
						autoCapitalize={'none'}
						style={styles.input}
						autoCorrect={false}
						keyboardType={'email-address'}
						underlineColorAndroid={'#90CAF9'}
						onChangeText={(text) => this.setState({username: text, error: ''})}
					 />
					 <Text style={styles.inputDescriptor}>And a password</Text>
					<TextInput
						autoCapitalize={'none'}
						style={styles.input}
						autoCorrect={false}
						secureTextEntry={true}
						underlineColorAndroid={'#90CAF9'}
						onChangeText={(text) =>this.setState({password: text, error: ''})}
					 />
					 <Text style={styles.inputDescriptor}>Confirm password</Text>
					<TextInput
						autoCapitalize={'none'}
						style={styles.input}
						autoCorrect={false}
						secureTextEntry={true}
						underlineColorAndroid={'#90CAF9'}
						onChangeText={(text) =>this.setState({passwordConfirmation: text, error: ''})}
					 />					 
					 <Button 
					 	text={'SIGN UP'} 
					 	onPressColor={'#1565C0'}
					 	onRelaxColor={'#0288D1'} 
					 	onPress={this.onSignupPress}
					 />
					 <Text style={styles.errorMessage}>{this.state.error}</Text>
					 <Image source={this.state.loader} style={styles.loader}></Image>
				</View>
			</View>
		)
	},
	onSignupPress: function(){
		var _this=this;
		if(this.state.username===""){
			return this.setState({
				error: 'Username is mandatory'
			});
		}
		if(this.state.password===""){
			return this.setState({
				error: 'You need a password!'
			});
		}		
		if(this.state.passwordConfirmation===""){
			return this.setState({
				error: 'Please confirm your password'
			});
		}
		if(this.state.password !== this.state.passwordConfirmation){
			return this.setState({
				error: 'Passwords do not match. Please try again.'
			});
		}

		// DB.users.add({
		// 	username: this.state.username,
		// 	password: this.state.password
		// });

		Parse.User.logOut();

		var user = new Parse.User();
		user.set('username', this.state.username);
		user.set('password', this.state.password);
		console.log('calling api...');
		this.setState({ loader: VisibleLoader, error: '' })
		user.signUp(null, {
			success: (user) => { console.log(user);this.props.navigator.immediatelyResetRouteStack([{name: 'home'}]); },
			error: (user, error) => { 

				var errorText;
				switch(error.code){
					case 101: 	errorText="Invalid username or password.";
								break;
					case 100: 	errorText="Unable to connect to the internet.";
								break;
					case 202: 	errorText="\""+_this.state.username+"\" has already been taken";
								break;
					default : 	errorText="Something went wrong.";
								break;
				}
				console.log(error);
				this.setState({ error: errorText, loader: HiddenLoader });
			}
		});
		//this.props.navigator.immediatelyResetRouteStack([{name: 'home'}]);		
	}
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: 30,
		paddingRight: 30,
		backgroundColor: '#ffffff'
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
		color: '#0288D1',
		fontSize: 30,
	},
	input: {
		padding: 4,
		height: 45,
		fontSize: 22,
		marginBottom: 20,
		textAlign: 'center'
	},
	inputDescriptor: {
		color: '#444444',
		alignSelf: 'center'
	},
	signupMessage: {
		color: '#ffffff',
		alignSelf: 'center',
		margin: 20,
	},
	errorMessage: {
		color: '#e53935',
		alignSelf: 'center',
		margin: 10
	},
	loader: {
		height: 11,
		width: 43,
		alignSelf: 'center',
	}
});