/*
*   Author: Mihir Karandikar
*   Started on: Tue Mar 22 2016
*/

'use strict';

var React = require('react-native');
var AppRegistry = React.AppRegistry;
var IOTAPP = require('./src/main');

AppRegistry.registerComponent('IOT', () => IOTAPP);