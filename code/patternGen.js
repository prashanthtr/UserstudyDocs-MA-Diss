

var midi = null;
var output = null;
var cur_acc="";
var pointer = -1,midiKeyboardswitch=0,song;

var kanjira_patterns = [["ta","tum","tumki","."],["ta tum", "tum ta","ta te","ta.",".ta","te.",".te","tum.",".tum"],["ta thum thum ta"],["ta tumki ta tumki"],["tumki. tumki. ta thum thum ta"],["ta ta thum thum ta thum thum ta"]];

	// Some helpers for the demos.
var steller = org.anclab.steller;       // Alias for namespace.
var util = steller.Util;

var AC = new webkitAudioContext();      // Make an audio context.
var src = AC.createBufferSource();
var sh = new steller.Scheduler(AC);     // Create a scheduler and start it running.
sh.running = true;
var models = steller.Models(sh);

var wavs = ['ta', 'te', 'tum','tumki','thum', 'tha','thi','thom','num','dhin','dheem','dham','ri','tham','bheem'];
    var sounds = {};
	
	var leadVolume= 1.0, acmpVolume=1.0, melVolume = 1.0, delay_range=0.03,tempo,accomp_start,tala=1,accomp_flag = 0,kanjira_start=4,input=null, mridangam_in = null,play_on=0;

var generic=1, interval, intonation, duration, strokeDensity,accent,gap,dur_left, genericcity = 1, accomp;


	
	document.getElementById('lead_Volume').addEventListener( "change", function(){
		leadVolume = document.getElementById("lead_Volume").value;
	},false); 
		document.getElementById('acmp_Volume').addEventListener( "change", function(){
		acmpVolume = document.getElementById("acmp_Volume").value;
	}); 	
	
	document.getElementById('mel_Volume').addEventListener( "change", function(){
		melVolume = document.getElementById("acmp_Volume").value;
	}); 	

	
document.getElementById('tempo').addEventListener( "change", function(){		
		tempo = document.getElementById("tempo").value;
		//set delay range to 30ms
		delay_range = (2 *tempo )/ 600;
	}); 


//accompaniment selection controls

document.getElementById('generic').addEventListener( "change", function(){
    genericcity = parseInt(document.getElementById("generic").value);
},false); 


	document.getElementById('generic').addEventListener( "change", function(){
	    generic = parseInt(document.getElementById("generic").value);
	},false); 


	document.getElementById('strokeDensity').addEventListener( "change", function(){
	    strokeDensity = parseInt(document.getElementById("strokeDensity").value);
	},false); 

	document.getElementById('intonation').addEventListener( "change", function(){
	    intonation = parseInt(document.getElementById("intonation").value);
	},false); 

	document.getElementById('duration').addEventListener( "change", function(){
	    duration = parseInt(document.getElementById("duration").value);
	},false); 

	document.getElementById('accent').addEventListener( "change", function(){
	    accent = eval(document.getElementById("accent").value);
	},false); 

	document.getElementById('interval').addEventListener( "change", function(){
	    interval = parseInt(document.getElementById("interval").value);
	},false); 




/*
document.getElementById('accomp_start').addEventListener( 'change', function(){
		kanjira_start = document.getElementById("accomp_start").value;
	}); 	*/



document.getElementById('midiInput').addEventListener( 'click', function(){
		midiKeyboardswitch = 1;
	});

document.getElementById('keyboardInput').addEventListener( 'click', function(){midiKeyboardswitch = 0;
	}); 	


var play_pattern = document.getElementById('play');
			
play_pattern.addEventListener("click", playKanjira , true);

document.getElementById('stop').addEventListener( 'onclick', function(){
		play_on = 0;
	}); 



function init_vars(){
	//initialize tempo, volume, etc..
			leadVolume = document.getElementById("lead_Volume").value;
			acmpVolume = document.getElementById("acmp_Volume").value;
			tempo = document.getElementById("tempo").value;
//					kanjira_start = document.getElementById("accomp_start").value;
			

		song = document.getElementById("track").value;
		
		wavs.push(song);
		// will result in the wavs all being loaded in parallel.
	var loader = sh.fork(wavs.filter(function (w) { return w !== ','; }).map(function (w) {
			return (sounds[w] = sh.models.sample('../audio/' + w + '.wav').connect()).load;
		    }));

		sh.play(loader);
		// Make an action which when played like sh.play(action)


    strokeDensity = parseInt(document.getElementById("strokeDensity").value);
    intonation = parseInt(document.getElementById("intonation").value);    
    duration = parseInt(document.getElementById("duration").value);
    accent = eval(document.getElementById("accent").value);
    interval = parseInt(document.getElementById("interval").value);		
		
}

function playKanjira(){
    //debugger;
    sh.running = true;
    play_on = 1; 
    kanjira(tempo );

}

var kanjira = ( function (){
	
    var currentComposition = sh.delay(1.0);
    var track_delay = parseFloat(document.getElementById("track_delay").value);

    sh.play(sh.loop(sh.dynamic(function (clock) { return currentComposition; })));                    

    function accent_pattern(){

	var strong = 4.0, weak = 0.4;	
	var arr = sarvalaghu(duration);
	document.getElementById("accent").value = arr.join(" ");
	
	var pattern = [], accent_arr=[];
	for(var i=0; i<arr.length;i++){
	    if(arr[i]>3){
		var inPattern = sarvalaghu(arr[i]);
		if(duration % arr[i] == 0 && (genericcity == 1 || genericcity == 2) ){
		    while(arrElementCmp(1,inPattern)){
			inPattern = sarvalaghu(arr[i]);
		    }
		}
		for(var iP = 0; iP < inPattern.length; iP++){
		    pattern.push(inPattern[iP]);
		}
		
	    }
	    else{
		pattern.push(arr[i]); 
	    }
	}

	for(var index = 0; index < pattern.length;index++){
	    accent_arr.push(strong);	    
	    for(var ind2 = 1; ind2 < pattern[index];ind2++){
		accent_arr.push(weak);
	    }
	}

	return accent_arr;
    }

    //returns an array with series of 0s and 1s 0 - note on, 1- note off



    function rhythmAccent(duration,numPauses){
	var acc, arr = [], str = "";
	for(var i=0; i <duration;i++){
	    arr.push(1);
	}
	// Rhythm accents are applied at random positions
	for(var i=0; i<numPauses; i++){
	    acc = wholeRand(0,duration-1);
	    if(arr.length ==0){
		arr[acc] = 0;
	    }
	    else if( arr[acc]!=0 ){
		arr[acc] = 0;
	    }
	    else{
		while(arr[acc] == 0){
		    acc = wholeRand(0,duration-1);
		}
		arr[acc] = 0;
	    }
	    str += acc + " ";
	}
	document.getElementById("rhythmAccents").value = str;
	return arr;
    }


    function sarvalaghu(duration){

	var combinations =[],arr=[]; //combination of 2's, 3's for accompaniment
	//var valid = [4,4],[3,3,2],[2,3,3],[3,2,3],[2,2,2,2],[1,1,1,1,1,1,1,1]; 
	debugger;   
	
	for(var i=1;i<=duration-1;i++){
	    allSums(0,i,arr,combinations);
	}


	function allSums(sum,num){
	    if(sum + num == duration){
		arr.push(num);
		combinations.push(arr.join(","));
		arr = arr.splice(0,arr.length-1);
		return sum;
	    }
	    else if(sum + num > duration){	    
		return sum;
	    }
	    else{
		sum += num;
		arr.push(num);
		for(var i=1;i<=duration-1;i++){
		    sum = allSums(sum,i);  //success		    
		}
		arr = arr.splice(0,arr.length-1);		
		return sum-num;

	    }
	}

	var genericAc = combinations.map(function(str,index){
	    
	    var array = str.split(",");
	    var ele = array[0];
	    if( duration % array.length == 0){	    
		if( numOccurences(ele,array) ==  array.length){  //means all the elements of the string are the same
		    return str;
		}	    		
	    }
	    else{
		
		var binary = array.map(function(num,index){
		    if(duration % num == 0 && num!=1){
			return 1;
		    }
		});
		if( numOccurences(1,binary) == binary.length ){
		    return str;
		}
		
		if(str.match(/1/gi) == null && str.match(/2/gi) != null && str.match(/3/gi) != null ){
		    return str;
		}
	    }
	    
	});

	var validGeneric = [];
	for(var index=0;index<genericAc.length;index++){
	    if(genericAc[index]){
		validGeneric.push(genericAc[index]);
	    }
	}

        
	
	if(genericcity == 3 || genericcity == 4){
	    var nonGeneric = combinations.map(function(str,index){
		
		if(str.match(/1/gi) != null){
		    return str;
		}
	    });
	    
	    var validNonGeneric = [];
	    for(var index = 0; index<nonGeneric.length;index++){
		if(nonGeneric[index]){
		    var flag = 0;
		    for(var index2 = 0; index2< validGeneric.length;index2++){
			if( nonGeneric[index] == validGeneric[index2] ){
			    flag = 1;
			}
		    }
		    if(flag == 0){
			validNonGeneric.push(nonGeneric[index]);
		    }

		}
	    }
	    return validNonGeneric[wholeRand(0,validNonGeneric.length-1)].split(",").map(parseFloat);
	}
	debugger;
	return validGeneric[wholeRand(0,validGeneric.length-1)].split(",").map(parseFloat);

    }

    //non resonant strokes only on the accent beats
    //resonant strokes on all the beats

    var resonant = ["tum","tumki"];
    var nonResonant = ["ta","te"];
    var threeFinger = ["ta"];
    var oneFinger = ["tum","tumki","te"];

    function diction(){
	var duration =8;
	var pattern = [];
	for(var i=0;i<duration;i++){
	    var binary = wholeRand(0,1);
	    if(binary == 0){
		pattern.push(threeFinger[0]);
	    }
	    else{
		pattern.push(oneFinger[wholeRand(0,2)]);
	    }
	}

	//genericcity is true
	/*if(genericcity == 1 || genericcity == 2){ 
	    for(var i=0; i<pattern.length-1;i++){
		if( pattern[i] == pattern[i+1] ){
		    if(pattern[i] == "te"){
			pattern[i+1] = "ta";
		    }
		    else pattern[i+1] = "te";
		}
	    }
	}*/
	return pattern;

    }


    //generate such that diction and 

    function main(){
	
	var oneFinger, threeFinger , str = [], cmp = 0, accent;

	function patternToHands(pattern){
	    var oneFinger=0, threeFinger =0;
	    var arr = pattern.map(function(str){
		if(str == "ta"){
		    return 3;// 3 finger stroke
		}
		else{
		    return 1;//1 finger stroke
		}
	    });
	    
	    function intervalOccurences(ele,arr){
		var counter = 1, interval = [], startPos = -1,prevPos=0;
		var intervalArray = [];
		var temp = arr.map(function(num,index){
		    if(num == ele){
			if(startPos == -1){
			    startPos = index;
			}
			else{
			    if(intervalArray.length == 0){
				intervalArray.push(index-startPos);
				prevPos = index;
			    }
			    else{
				intervalArray.push(index - prevPos);
				prevPos = index;
			    }
			}
		    }
		});

		var sum = 0;
		for(i=0;i<intervalArray.length;i++){
		    sum += intervalArray[i];
		}

		intervalArray.push( arr.length-prevPos + startPos-0 );
		return intervalArray;
	    }
	    
	    oneFinger = intervalOccurences(1,arr);    
	    threeFinger = intervalOccurences(3,arr); 
	    return [oneFinger, threeFinger];
	}
	

	if(genericcity == 1 || genericcity == 2){
	    var cmp = 0;
	    do{
		if(cmp == 0){
		    pattern = diction();
		    var arr = patternToHands(pattern);
		    oneFinger = arr[0];
		    threeFinger = arr[1];
		}
		if(oneFinger.length == threeFinger.length){		
		    //symmetric rotation to be implemented
		    cmp = 1;
		}
		
	    }while(cmp == 0);
	}

	else{
	    pattern = diction();
	}
	
	document.getElementById("pattern").value = pattern.join(" "); //diction(accent_arr);
	return pattern;
    }

    

    function combine_track(cur_acc){

//schedules to play the kanjira accompaniment - but if mridangam event is in, forks the track and adds that schedules that event too	
	var accent_arr = [], rhythmicAccent = [], accompaniment_tempo = [];
	var accentEnabled = parseInt(document.getElementById("accentEnabled").value);
	var strong = 4.0, weak = 0.4;	
	var correctForDiction = parseInt(document.getElementById("correctForDiction").value);
	var accompChange = parseInt(document.getElementById("accompChange").value);

	var numPauses = parseInt(document.getElementById("interval").value);
	var pauses = parseInt(document.getElementById("pauses").value);
	var speed = parseInt(document.getElementById("speed").value);
	if(accentEnabled){
	    accent_arr = accent_pattern();
	}
	else{
	    accent_arr= [weak,weak,weak,weak,weak,weak,weak,weak]; //accent_struct
	}
	
	if(accompChange == 1){
	    accomp = main();	
	}
	else{
	    accomp = ["tum","ta","tum","ta","ta","tum","tum","ta"];
	}
	
	if(pauses == 1){
	    rhythmicAccent = rhythmAccent(duration,numPauses);
	    accomp = accomp.map(function(s,index){
		if(rhythmicAccent[index] == 0){
		    return ".";
		}
		else{
		    return s;
		}
	    });

	}

	if(speed == 1){
	    var numStrokes = parseInt(document.getElementById("numStrokes").value), strokePos, accompaniment=[], arr=[], accent=[] ;
	    for(var iter=0; iter<numStrokes; iter++ ){

		strokePos = wholeRand(0,duration-1);
		if(arr.length ==0){
		    arr.push(strokePos);
		}
		else if( arrElementCmp(strokePos,arr) == 0 ){
		    arr.push(strokePos);
		}
		else{		    
		    do{
			strokePos = wholeRand(0,duration-1);
			if(accomp[strokePos] == "."){
			    while(accomp[strokePos] == "."){
				strokePos = wholeRand(0,duration-1);
			    }
			}
		    }while(arrElementCmp(strokePos,arr) == 1 );
		}
	    }
	    for(var it2=0; it2< duration; it2++){
		if(arrElementCmp(it2,arr)){
 		    var binary = wholeRand(0,1);
		    if(binary == 0) { //double speed
			accompaniment.push("ta");accompaniment_tempo.push(4);
			accompaniment.push("te");accompaniment_tempo.push(4);
			accent.push(weak);accent.push(weak);
		    }
		    else{
			accompaniment.push("ta");accompaniment_tempo.push(8);
			accompaniment.push("te");accompaniment_tempo.push(8);
			accompaniment.push("ta");accompaniment_tempo.push(8);
			accompaniment.push("te");accompaniment_tempo.push(8);
			accent.push(weak);accent.push(weak);accent.push(weak);accent.push(weak);
		    }
		}
		else{
		    accompaniment.push(accomp[it2]);
		    accompaniment_tempo.push(2);
		    accent.push(accent_arr[it2]);
		}
		
	    }
	    accomp = accompaniment;
	    accent_arr = accent;
	}
	else{
	    for(var i =0; i<duration; i++){
		accompaniment_tempo.push(2);
	    }
	}
	
	
	if(correctForDiction){
	    if(accentEnabled){
		var pattern = accomp;
		
		for(var i=0; i<pattern.length-1;i++){
		    if( (arrElementCmp(pattern[i],oneFinger) == 1 && arrElementCmp(pattern[i+1],oneFinger) == 1) || (arrElementCmp(pattern[i],threeFinger) == 1 && arrElementCmp(pattern[i+1],threeFinger) == 1) ){ //consecutive strokes on the same finger
			if(pattern[i+1] != strong){
			    if(pattern[i] == "te" || pattern[i] == "tum" || pattern[i] == "tumki"){
				pattern[i+1] = "ta";
			    }
			    else pattern[i+1] = "te";
			}
			else{
			    if(pattern[i] == "ta"){
				pattern[i+1] = oneFinger[wholeRand(0,2)];
			    }
			    else pattern[i+1] = "ta";
			}

		    }
		}   
	    }
	    
	    /*
	    for(var i=0; i<pattern.length-1;i++){
		if( pattern[i] == pattern[i+1] && pattern[i+1] != strong ){
		    if(pattern[i] == "te" || pattern[i] == "tum" || pattern[i] == "tumki"){
			pattern[i+1] = "ta";
		    }
		    else pattern[i+1] = "te";
		}
	    } */  
	}
	
	//var accomp_tempo = accompaniment_seq[1],times;
	var accomp_tempo,times;	

	var times = 4;
	
	if(accomp.length == 4){
	//sh.play(sh.repeat(8, sh.dynamic(function (clock) { return currentComposition; })));
	    times = 8;
	    accomp_tempo = 2;
	}

	if(accomp.length == 8){
	//sh.play(sh.repeat(4, sh.dynamic(function (clock) { return currentComposition; })));
	    times = 4;
	    accomp_tempo = 4;
	}

	document.getElementById("kanjira_patterns").value = "[" + accomp.join(" ") + "," + accompaniment_tempo[0] + "]";	


 //	return sh.track( sh.repeat( times , sh.track( accomp.map(function(s,index){	
return sh.track( accomp.map(function(s,index){	
		if(s == "."){
			return sh.track(sh.delay(1.0/accompaniment_tempo[index]));
		}
	
		else{	
			return sh.track([sounds[s].trigger(accent_arr[index]), sh.delay(1.0/accompaniment_tempo[index])]);
		}

}));

}



    return function (tempo,cur_acc) {
        currentComposition = sh.track(
            sh.rate(tempo / 60),
            combine_track(cur_acc)
        );
    };

}());


init_vars();

//------------------ Common functions --------------------------//

//generates whole random number between the given intervals
function wholeRand(low,high){
    return low + Math.floor( 0.5 + Math.random()*(high-low));
}

//returns 1 if element found in array and returns 0 if no element is found
function arrElementCmp(element,array){
    var compare = 0;
    for(var index=0;index<array.length;index++){
	if(element == array[index]){compare = 1;}
    }
    return compare;
}

//compares if one array is part of another array
function arrCmp(mainArr,subArr){

    var compare = 0;
    for(index = 0; index<mainArr.length; index++){
	if( mainArr[index].join("") == subArr.join("") ){
	    compare = 1;
	}
    }
    return compare;
}


//returns number of occurences of an element in a array
function numOccurences(ele,array){
    var count = 0;
    for(var index=0;index<array.length;index++){
	if(ele == array[index]){
	    count++;
	}
    }
    return count;
}

