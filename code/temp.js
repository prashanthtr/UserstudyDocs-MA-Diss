
//------------------------------- Main -------------------------------------//


var refLoudness, refSpeed, refAccent, refDiction, refWeight;
var manual = getEle("manual");
if(manual){
    refLoudness = loudnessAccent(duration,getEle("refloudPos"),getEle("refRestPos"));
    refSpeed  = speedAccent(duration,getEle("refSpeedPos"));
    refDiction = document.getElementById("diction").split(",");
    /*refDiction = dict.map(function(s){
	return s.split(",");
    });    */
    var temp = accent(refLoudness,refSpeed,refDiction);    
}
else{
    //eka talam
    var refLoudPos = [1,5,9,13], refRestPos = [2,3,4,6,7,8,10,11,12,14,15,16];
    var refSpeedPos = [];
    refDiction = generateBaseValue(duration,"ta");
    refLoudness = loudnessAccent(duration,refLoudPos,refRestPos);
    refSpeed  = speedAccent(duration,refSpeedPos);
    var temp = accent(refLoudness,refSpeed,refDiction);  
}
refAccent = temp[0];
refWeight = temp[1];

//var generator = sh.loop(sh.dynamic(function (clock) {
    
    if(manual){
	pause = parseFloat(document.getElementById("numRhythmAccents").value);
	speed = parseFloat(document.getElementById("numStrokes").value);
    }
    else{	
	//distinguishing thing between different accompaniment
	if(generic == 1){pause = modovr(pause, 2); speed = speed % 4;}
	else if(generic == 2 || generic == 3){pause = modovr(pause, 4); speed = speed % 7;}
	else {pause = modovr(pause, 8); speed = speed % 10;}
    }

    aksharam++;
    aksharam = aksharam % 32;
    
    //change diction once every avarthanam
    if(aksharam == 0){dictionIndex = (dictionIndex+1) % 3;}
    
    var generic = parseFloat(document.getElementById("genericcity").value);
    var stroke = accompaniment(generic,pause,speed,dictionIndex);

    //play
    var strokeSeq = stroke[0];
    var strokeTempo = stroke[1];
    var strokeAccent = stroke[2];
    
 /*   return sh.track( strokeSeq.map(function(s,index){
	try{
	    if(s == "."){
		return sh.delay(1.0/strokeTempo[index]);
	    }
	    
	    else{	
		return sh.track([sounds[s].trigger(strokeAccent[index]), sh.delay(1.0/strokeTempo[index])]);

	    }
	}
	catch(err){
	    debugger;
	}

    }));*/

//}));


//----------------------------- Accent Structure Calculation--------------//


function accent(loudness,speed,diction){

    var s = 1, w=0.5; 
    //speedDouble =  parseFloat(document.getElementById("tate").value);
    
    var weightedArr = speed.map(function(s){
	    if(s.length > 1){
		return speedDouble;
	    }
	    else{
		return 0;
	    }
	    
    });

   var weightedArr = loudness.map(function(s,index){
	    return s + weightedArr[index];
   });

    weightedArr = diction.map(function(s,index){
/*	var weight = 0;
	if( !speed[index].length ){ //not speed double then add weight of note
	    weight = getEle(s);
	}	*/
	var weight = getEle(s) + weightedArr[index];
	if(index == duration - 1){
	    weight -= 0.1;
	}
	return weight;
    });

    var fAccent = weightedArr;
    
    var w1 = parseFloat(document.getElementById("backWeight").value), w2 = parseFloat(document.getElementById("frontWeight").value);

    var contrastedArr = fAccent.map(function(s,index,arr){
	return 1*s - w1*arr[modnum(index,1)] - w2*arr[(index+1)%duration];
    });    
    
    var accentStruct = contrastedArr.map(function(s,index,arr){
	var max = maxi(s,arr[modnum(index,1)],arr[(index+1)%duration]);
	if( max != -1 && max == s){
	    return 1;
	}
	else{
	    return 0;
	}
    });

    return [accentStruct,weightedArr];
}


//----------------------------- Play accompaniment -------------//


function accompaniment(generic, loud, pause, speed, dictionIndex){
    
    var diff = 5;
    var range_up = getEle("rangeUp"), range_down = getEle("rangeDown");
    do{
	//positions of accents
	var speedPos = generateRandArr(duration, speed);
	var loudPos = generateRandArr(duration, loud);
	var pausePos = generateRandArr(duration, pause);
	
	//arrays
	var targetLoud = loudnessAccent(duration,LoudPos,pausePos)
	var targetSpeed = speedAccent(duration, speedPos);
	var targetDiction = strokeSeq(dictionIndex);
	
	//accent structure and weight structure
	var target = accent(targetLoud, targetSpeed, targetDiction);
	var targetAccent = target[0];
	var targetWeight = target[1];

	//distance measure
	diff = patternDistance(refAccent,refWeight, targetAccent,targetWeight);
    }while( (diff <= rangeDown || diff >= rangeUp) && timer<1000);

    if(timer >= 1000){	    
	loudPos = [1,5,9,13]; pausePos = []; speedPos = [];
	targetDiction = strokeSequence(0);
	targetLoud = loudnessAccent(duration,loudPos,pausePos);
	targetSpeed  = speedAccent(duration,speedPos);
    }	
    
    targetDiction = targetDiction.map( function(s,index){
	if(targetLoud[index] == 0){
	    return ".";
	}
	else{
	    return s;
	}
    });
    
    var temp = speedChange(targetDiction, targetLoudness, speedPos);

    document.getElementById("kanjira_patterns").value = "[" + targetDiction.join("|") + "]";		    
    document.getElementById("speedAccent").value = "[" + speedPos.join(",") + "]";	
    document.getElementById("rhythmAccent").value = "[" + pausePos.join(",") + "]";	
    
    targetDiction = multiToSingleDimensionArray(targetDiction);
    targetSpeed = multiToSingleDimensionArray(targetSpeed);
    targetLoud = multiToSingleDimensionArray(targetLoud);

    return [targetDiction, targetSpeed, targetLoud];	
    
}


function patternDistance ( refAccent, refSpeed, refLoudness, targetAccent, targetSpeed, targetLoudness){
    
    
    // measures the distance between two patterns in terms of their accent and composition

    
    //finalAccent = [1,0,0,0,0,1,0,1]
    //tala = [1,0,0,0,1,0,0,0]
    //patternTempo = [2,2,2,2,[4,4],2,2,2]
    //patternLoudness = [s,w,w,w,0,0,s,w,w,];

    var cost, bin=1;   
    
    var costTempo = refSpeed.map(function(s,i){
	if(targetSpeed[i].length > 1 && !s.length){
	    return 1/2 - 1/targetSpeed[i][0];
	}
	else{
	    return 0;
	}
    });

    //loudness increase adds to the cost
    var costLoudness = refLoudness.map(function(s,i){
	return (patternLoudness[i] - s);// non weighted binary value 
    });

    //final distance is a measure of tempo increase, loudness increase provided there is accent on the beat
    var distanceMeasure = targetAccent.map(function(s,index){
	return (s - refAccent[index]) * (costLoudness[index] + costTempo[index]);
    });

    var diff = distanceMeasure.reduce(sum);
    
    function sum(a,b){
	return a + b;
    }

    console.log(diff);
    return diff;	
}



//------------------ Generating different arrays------------------------//

function strokeSeq(index){

    //three common solkattu used for accompaniment
    var Solkattu = [["tum","ta","tum","ta","ta","tum","tum","ta"],["ta","ta","tum","tum","ta","tum","tum","ta"],["ta","tum","tum","ta","ta","tum","tum","ta"]];
    var sol = [Solkattu[index], Solkattu[index].map(function(s){
	if(s == "tum"){
	    return "tumki";
	}
	else return s;
    })];
    return sol[wholeRand(0,1)];
}

/*var accent = function (duration,accentPos){
    var temp = generateBaseValue(duration,0);
    var arr = temp.map(function(s,index){
	if(arrElementCmp(index,accentPos) == 1){
	    return 1;
	}
	else{
	    return 0;
	}
    });
    return arr;
};*/


var speedAccent = function (duration,speedPos){
    var temp = generateBaseValue(duration,2);
    var arr = temp.map(function(s,index){
	if(arrElementCmp(index,speedPos) == 1){
	    return [4,4];
	}
	else{
	    return 2;
	}
    });
    return arr;
};

var loudnessAccent = function (duration,LoudPos,pausePos){
    var s = 1, w=0.5;
    var temp = generateBaseValue(duration,w);
    var arr = temp.map(function(s,index){
	if(arrElementCmp(index,LoudPos) == 1){
	    return s;
	}
	if(arrElementCmp(index,pausePos) == 1){
	    return 0;
	}
	else{
	    return w;
	}
    });
    return arr;
};



function speedChange(strokeSeq, strokeAccent,arr){
    
    var tempStrokeSeq = "", tempStrokeTempo = "", tempStrokeAccent = "", tempLoudnessAccent = "";
    
    arr = arr.map(function(s){
	return s-1;
    });

    for(var i=0; i<duration; i++){
	if(arrElementCmp(i,arr) && strokeAccent[i] != 0){
	    tempStrokeSeq += "ta te,";
	    tempStrokeAccent += "[0.5, 0.5],";
	}
	else{
	    tempStrokeSeq += strokeSeq[i] + ",";
	    tempStrokeAccent += strokeAccent[i] + ",";

	}
    }
    var temp = tempStrokeSeq.split(",");
    temp = temp.splice(0,temp.length-1);
    return [temp,eval( "[" + tempStrokeAccent + "]")];
}



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
    if(subArr.length>1){
	for(index = 0; index<mainArr.length; index++){
	    if( mainArr[index].join("") == subArr.join("") ){
		compare = 1;
	    }
	}
    }    
    return compare;
}


    function maxi(a,b,c){
	if(a == b && a == c){
	    return -1;
	}
	else{
	    if(a > c && a>b){
		return a;
	    }
	    else if(b>a && b>c){
		return b;
	    }
	    else{
		return c;
	    }
	}
    }

//returns num - sub % duration
function modnum(num,sub){

    if(num - sub < 0){
	return duration + (num - sub)%duration;
    }
    else{
	return (num - sub)%duration;
    }
    
}


function getEle(htmlElement){
    return eval(document.getElementById(htmlElement));
}

//generate array with base value
function generateBaseValue(duration, baseValue){
    var arr = [];
    for(var i=0; i<duration; i++){
	arr.push(baseValue);
    }
    return arr;
}


function multiToSingleDimensionArray( multiSeq ){ 
    var singleSeq = [], arr2 = [];
    for(var i=0; i<multiSeq.length; i++){
	var arr = multiSeq[i];
	if(arr.length == 1){
	    singleSeq.push(multiSeq[i]);	    
	}
	else{
	    try{
		arr2 = arr.split(" ");
	    }
	    catch(err){
		arr2 = arr;
	    }
	    for(var i2=0;i2<arr2.length;i2++){
		singleSeq.push(arr2[i2]);
	    }	    
	}
    }
    
    return singleSeq;
}


//generates array with unique values if documentelement is absent
function generateRandArr(duration, numValues){
    var arr = [];

    for(var i=0; i<numValues; i++){
	var acc = wholeRand(0,duration-1);
	if(arr.length ==0){
	    arr.push(acc);
	}
	else if( arrElementCmp(acc,arr) == 0 ){
	    arr.push(acc);
	}
	else{
	    while( arrElementCmp(acc,arr) == 1 ){
		acc = wholeRand(0,duration-1);
	    }
 	    arr.push(acc);
	}

    }
    return arr;
}
