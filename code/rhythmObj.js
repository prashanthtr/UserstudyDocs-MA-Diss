
//stub
//monitor continously change in the value
var ctrl1 = getEle("manual"), ctrl2 = 0;
var pauses  = 0, speed = 0, loud = 0, avarthanam = 1, dictionIndex = 0, aksharam = 0;

var params = function(str, ctrl1, ctrl2){

    if(ctrl1 == 1){ //completely manual
	this.duration = getEle(str + "duration");
	this.speed = getEle(str +"Loud");
	this.loudness = getEle(str +"Rest");
	this.pauses = getEle(str +"Speed");
	this.diction = -1;
    }
    else{
	if(str == "ref"){
	    this.duration = 16;
	    this.loudness = [1,5,9,13];
	    this.pauses = [2,3,4,6,7,8,10,11,12,14,15,16];
	    this.speed = [];
	    this.diction = -2;
	}
	else{
	    if(ctrl2 == 1){
		loud = getEle("numLoudness");
		pauses = getEle("numPauses");
		speed = getEle("numStrokes");
	    }
	    this.duration = 16;		
	    this.loudness = generateRandArr(duration, loud);
	    this.pauses = generateRandArr(duration, pauses );
	    this.speed = generateRandArr(duration, speed);
	    this.diction = wholeRand(0,2);
	}
    }
    //document.getElementById(str + "Diction").split(",");generateBaseValue(duration,"ta");
    
    return [duration, speed, loudness, pauses, diction];

};


var varyAcc = function (generic){
    
    if(generic == 1){
	pauses = modovr(pauses, 2); speed = speed % 4; loud = modovr(loud,2);
    }

    else if(generic == 2 || generic == 3){
	pauses = modovr(pauses, 4); speed = speed % 7;loud = modovr(loud,4);
    }
    
    else{
	pauses = modovr(pauses, 8); speed = speed % 10;loud = modovr(loud,8);
    }

    if(aksharam == 0){dictionIndex = (dictionIndex+1) % 3;}     

}

var reference = rhythmPattern.apply(null, params("ref",ctrl1,ctrl2));
var refPattern = reference[0];

//var generator = sh.loop(sh.dynamic(function (clock) {

    //generates and plays pattern according to genericcity


    var generic = getEle("generic");
var targetPattern,target;
aksharam+=duration/8;
    aksharam = aksharam % (32/duration);

    var diff = 5, timer = 0;
    var rangeUp = getEle("rangeUp"), rangeDown = getEle("rangeDown");

    do{
	pauses +=2;
	loud -= 2;
	speed += 2;
	varyAcc(generic);
	target = rhythmPattern.apply(null, params("target",ctrl1,ctrl2));
	targetPattern = target[0];
	diff = patternDistance(refPattern,targetPattern);
	timer++;
    }while( !(diff >= rangeDown && diff <=rangeUp) && timer<1000);

    if(timer >= 1000){	    
	console.log("didnt find match");
	targetPattern = refPattern;
    }
    
play = target[1];


//}



//rhythmPattern(8,[],[],[],0);
//params("ref",manual)
//params("target",manual)



function patternDistance ( refPattern, targetPattern){
    var accent1 = refPattern[0];
    var weight1 = refPattern[1];
    var accent2 = targetPattern[0];
    var weight2 = targetPattern[1];

    var distanceMeasure = accent2.map(function(s,index){
	return (s - accent1[index]) * (weight2[index] - weight1[index]);
    });

    var diff = distanceMeasure.reduce(sum);    
    
    function sum(a,b){
	return a + b;
    }
    console.log(diff);
    return diff;	
}


//all rhythm patterns are characterized by duration, and 3 properties
function rhythmPattern( duration, speed, loudness, pauses,dictionInd){   

    this.loudnessArr = function (){
	var s = 1, w=0.5;
	var temp = generateBaseValue(duration,w);
	var arr = temp.map(function(s,index){
	    if(arrElementCmp(index,loudness) == 1){
		return s;
	    }
	    if(arrElementCmp(index,pauses) == 1){
		return 0;
	    }
	    else{
		return w;
	    }
	});
	arr = arr.map(function(s,index){
	    if(arrElementCmp(index,speed) == 1 && arrElementCmp(index,pauses) == 0){
		return [w,w];
	    }	    
	    else return [s];
	});	

	return arr;
    };
	
    this.speedArr = function(){
	var temp = generateBaseValue(duration,2);
	var arr = temp.map(function(s,index){
	    if(arrElementCmp(index,speed) == 1 && arrElementCmp(index,pauses) == 0){
		return [4,4];
	    }
	    else{
		return [2];
	    }
	});
	return arr;
    };

    this.diction = function strokeSequence(){

	var arr;
	if(dictionInd == -1){ //manual reference diction
	    arr = document.getElementById("refDiction").split(",");
	}
	else if(dictionInd == -2){ // default automatic reference diction
	    arr = generateBaseValue(duration,"ta");
	}
	else{
	    //three common solkattu used for accompaniment
	    var Solkattu = [["tum","ta","tum","ta","ta","tum","tum","ta"],["ta","ta","tum","tum","ta","tum","tum","ta"],["ta","tum","tum","ta","ta","tum","tum","ta"]];
	    
	    var temp = Solkattu[dictionInd];
	    
	    var i = 0;
	    var str = temp.join(","), temp2 = str;
	    while(i < (duration/8)-1){ // n-1 times
		temp2 = temp2 + "," + str ;
		i++;
	    }
	    arr = temp2.split(",");

	    arr = arr.map(function(s,index){
		if(arrElementCmp(index,speed)== 1 && arrElementCmp(index,pauses) == 0 ){
		    return "ta te";
		}
		else if(arrElementCmp(index,pauses) == 1){
		    return ".";
		}
		else return s;
	    });

	    var sol = [arr, arr.map(function(s){
		if(s == "tum"){
		    return "tumki";
		}
		else return s;
	    })];
	    
	    arr = sol[wholeRand(0,1)];	    
	}
	arr = arr.map(function(s,index){
	    return s.split(" ");
	});
	return arr;	
    }

    this.accent = function(loudnessArr,speedArr,diction){

	var lArr = loudnessArr();
	var sArr = speedArr();
	var dict  = diction();
	var s = 1, w=0.5; 
	var weightedArr = lArr.map(function(s,index){
	    return s[0];
	});

	weightedArr = dict.map(function(s,index){

	    if(s.length > 1){
		s = s.join("");
	    }
	    var stroke = 0;
	    if( s!= "."){stroke = getEle(s);}
	    var weight = stroke + weightedArr[index];
	    if(index == duration - 1){
		weight -= 0.1;
	    }
	    return weight;
	    
	    
	});

	var fAccent = weightedArr;
	
	var w1 = parseFloat(document.getElementById("backWeight").value), w2 = parseFloat(document.getElementById("frontWeight").value);

	var contrastedArr = fAccent.map(function(s,index,arr){
	    return 1*s - w1*arr[modnum(duration,index,1)] - w2*arr[(index+1)%duration];
	});   
	//document.getElementById(str + "Diction").split(",");generateBaseValue(duration,"ta");
	var accentStruct = contrastedArr.map(function(s,index,arr){
	    var max = maxi(s,arr[modnum(duration,index,1)],arr[(index+1)%duration]);
	    if( max != -1 && max == s){
		return 1;
	    }
	    else{
		return 0;
	    }
	});

	return [accentStruct,weightedArr];
    };
    
    var acc = accent(loudnessArr,speedArr,diction);
    var play = [multiTo1DArray(loudnessArr()),multiTo1DArray(diction()),multiTo1DArray(speedArr())]
    return [acc,play];
    //this.accentStr = accent[0];
    //this.weightedArr = accent[1];
    
}



//generate array with base value
function generateBaseValue(duration, baseValue){
    var arr = [];
    for(var i=0; i<duration; i++){
	arr.push(baseValue);
    }
    return arr;
}

function getEle(htmlElement){
    return eval(document.getElementById(htmlElement).value);
}

//returns 1 if element found in array and returns 0 if no element is found
function arrElementCmp(element,array){
    var compare = 0;
    for(var index=0;index<array.length;index++){
	if(element == array[index]){compare = 1;}
    }
    return compare;
}

//generates whole random number between the given intervals
function wholeRand(low,high){
    return low + Math.floor( 0.5 + Math.random()*(high-low));
}

//returns num - sub % duration
function modnum(duration,num,sub){

    if(num - sub < 0){
	return duration + (num - sub)%duration;
    }
    else{
	return (num - sub)%duration;
    }
    
}

//finds maximum of 3
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

function modovr(num, modn ){
    if(num < 0){
	num = modn + num;
    }
    return num % modn;
}

function multiTo1DArray( multiSeq ){ 
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