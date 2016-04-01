const data = [
	{in: 1.3, out: 2},
	{in: 3, out: 4},
	{in: 15.3, out: 16},
	{in: 16, out: 16.3},
	{in: 17, out: 18}
];

function getMap(intervals){

	var map = [];
	for(var i=0;i<intervals;i++){
		map.push({index: i, flag: true});
	}
	return map;
}

module.exports = function(){
	var i, j, _in, _out, flag=true;
	var map = getMap(48);
	var sampleIN=3, sampleOUT=4;

	// console.log(JSON.stringify(map, null, 2));
	// return;
	
	for(i=0;i<data.length;i++){
		_in = Math.ceil(data[i].in * 2);
		_out = Math.ceil(data[i].out * 2) - 1;

		//console.log(_in, _out);

		for(j=_in;j<=_out;j++){
			map[j].flag = false;
		}
	}

	_in = Math.ceil(sampleIN * 2);
	_out = Math.ceil(sampleOUT * 2) - 1;

	for(i=_in;i<=_out;i++){
		if(!map[i].flag){
			flag=false;
			break;
		}
	}

	console.log(flag);
	
}();