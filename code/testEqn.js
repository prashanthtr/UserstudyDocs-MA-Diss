
var duration = 16;
var loudness = [1,5,9,13];
var rests = [2,3,4,6,7,8,10,11,12,14,15,16];
var speed = [];
var diction = ["clap","clap","clap","clap","clap","clap","clap","clap","clap","clap","clap","clap","clap","clap","clap","clap"];

var p1 = rhythmPattern([duration, speed, loudness,rests,diction]);

loudness = [];
rests = [];
speed = [];

var Solkattu = ["ta",".","tum",".","ta",".","tum",".","ta",".","tum",".","tum",".","ta","."];
var p2 = rhythmPattern([duration, speed, loudness,rests,Solkattu]);
//patternDistance(p1,p2);

generate(Solkattu);

function generate(sol){
    
    var strokes = ["ta","te","tumki","ta te","."];
    var len = strokes.length-1;
    var diff1 = patternDistance(p1,p2);
    var target;
    do{
	var targetSol = sol.map(function(s){
	    var b1 = wholeRand(0,1); // 0 - no change 1 -> change    
	    if(b1 == 0){
		return s;
	    }
	    else {
		return strokes[wholeRand(0,len)];
	    }
	});	
	loudness = [];
	rests = [];
	speed = [];
	target = rhythmPattern([duration, speed, loudness,rests,targetSol]);
	var diff2 = patternDistance(p1,target);
    }while(diff2 != diff1);
    
}


/*var Solkattu = [];
var i =0;
while(i < duration){
    Solkattu.push(strokes[wholeRand(0,strokes.length-1)]);
    i++;
}
diction = Solkattu;
console.log(diction);*/


//sarvalaghu

//diction = ["ta",".","tum",".","ta",".","tum",".","ta",".","tum",".","tum",".","ta","."];

//diction = ["ta","ta","tum","ta te","tum",".","ta","te","ta","ta","tum",".","tum","ta te","ta te","ta te"];


//misra chapu
//diction = ["ta",".","tum",".","ta",".","ta",".","tum",".","tum",".", "ta","."]

//diction = ["ta te","ta te","tum",".","ta",".","ta te","ta te","tum","ta te","ta te","ta te","tum","ta"];


//diction = ["ta","tum","tum","ta","ta","tum","tum","ta","ta","tum","tum","ta"];

//rupakam
//diction = ["ta","tum",".","ta","ta","tum",".","ta","ta","tum",".","ta"];

//diction = ["tum",".","ta te","ta",tum","ta","tum",".","ta te","ta","tum","ta"];

//diction = ["tum","ta", "te"," ta","ta","ta","tum",".","ta te","ta te","tum","ta"];

//diction = ["tum",".","ta","te", "ta","ta","tum",".","tum",".","ta"];

//diction = ["ta","te", "ta", "te"," ta","ta","tum",".","tum",".","ta"];


//diction = ["ta te","ta te","tum","ta","tum","ta","ta te","ta te","tum","ta","tum","ta"];

//adi

//diction = ["tum","ta","tum","ta","te","ta","tum","ta","te","ta","tum","ta"];

//diction = ["ta","tum","tum","ta","ta","tum","tum","ta","ta","tum","tum","ta","ta","tum","tum","ta"];

//diction = ["ta","ta","tum","tum","ta","tum","tum","ta","ta","ta","tum","tum","ta","tum","tum","ta"];

//diction = ["tum","ta","tum","ta","ta","tum","tum","ta","tum","ta","tum","ta","ta","tum","tum","ta"];

//nadais

//diction = ["tum","ta te","ta te","ta te","ta","tum","tum","ta","tum","ta","tum","ta te","ta","tum","tum", "ta"];

//diction = ["tum",".","tum","ta te","ta te","ta te","tum",".",".",".","tum","ta te","ta te","ta te","tum","ta te"];

//diction = ["tum",".","tum","ta te","ta te","ta te","tum","ta te","ta te","ta te","tum","ta te","ta te","ta te","tum","ta te"];

//diction = ["ta","te","ta","tum","ta","te","ta","te","ta","te","ta","tum","ta","tum", "ta te","ta te"];

//far off

//diction = ["ta te","ta te","ta","tum","ta","tum",".", "ta","ta",".","tum",".","ta","tum",".", "ta"];

//diction = ["ta",".","tum",".","ta","tum",".", "ta te","ta","ta","tum",".","ta","tum",".", "ta"];

//kanakku

//diction = ["ta","tum","tum","ta","ta","tum","ta","ta","tum","tum","ta","ta","te","ta te","ta te","tum"];

//diction = [".","ta","tum","ta te","ta te","tum","ta","tum","ta te","ta te","tum","ta","tum","ta te","ta te","tum"];

//diction = [".","ta","tum","ta","tum","ta","ta","tum","ta","tum","ta","ta","tum","ta","tum","ta"];

//diction = [".","ta te","ta te","ta te","ta te","tum","ta te","ta te","ta te","ta te","tum","ta te","ta te","ta te","ta te","tum"];





function symmetry(diff, accentStr){		

    var strokes = diction;
    //stroke symmetry
/*    var lH = numOccurences("te",strokes) + numOccurences("tum",strokes) + numOccurences("tumki",strokes);
    var rH = numOccurences("ta",strokes);
    if( rH == lH ){
	console.log("symmetric");
	diff = diff/getEle("symm"); 
    }
    else{
	console.log("Asymmetric");
	diff = diff * getEle("symm")/2; //Math.abs(rH - lH);
    }*/
    
    //accent symmetry
    var a = accentStr, b = accentStr;
    b  = a.splice(0,accentStr.length/2);
    if( a.join("") == b.join("") ){
	console.log("symmetric Accent");
	diff = diff / getEle("symm");
    }
    else {
	console.log("Asymmetric Accent");
	diff = diff * getEle("symm");

    }
    return diff;
}


function patternDistance ( refPattern, targetPattern){
    var accent1 = refPattern[0];
    var weight1 = refPattern[1];
    var accent2 = targetPattern[0];
    var weight2 = targetPattern[1];
    

    var distanceMeasure = accent2.map(function(s,index){
	//(s - accent1[index]) * 
	return Math.abs(s - accent1[index]) * Math.abs(weight2[index] - weight1[index]);
    });

    var diff = distanceMeasure.reduce(sum);    
    diff = symmetry(diff,accent2);
    
    console.log(" " + diff);	
    return diff;
}



function rhythmPattern( params){   

    var duration = params[0], speed = params[1], loudness = params[2], pauses = params[3];
    var diction = params[4];


    function sub(s){
	return s-1;
    }
    
    //array positions
    loudness = loudness.map(sub);
    pauses = pauses.map(sub);
    speed = speed.map(sub);

    this.dictionArr = function (){

	var arr = diction;
	arr = arr.map(function(s){
	    if(s == "tum"){
		return "tumki";
	    }
	    else return s;
	});

	arr = arr.map(function(s,index){
	    if(arrElementCmp(index,speed)== 1 && arrElementCmp(index,pauses) == 0 ){
		return "ta te";
		
	    }
	    else if(arrElementCmp(index,pauses) == 1){
		return ".";
	    }
	    else return s;
	});

	arr = arr.map(function(s,index){
	    return s.split(" ");
	});
	return arr;
    }


    this.loudnessArr = function (){
	var s = 2, w=0.5; //level at which they are played
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


    this.accent = function(loudnessArr,speedArr,dictionArr){

	var lArr = loudnessArr();
	var sArr = speedArr();
	var dict  = dictionArr();
	var s = 2, w=0.5; 
	
	var weightedArr = generateBaseValue(duration,0);
	weightedArr = dict.map(function(s,index){

	    if(s.length > 1){
		s = s.join("");
	    }
	    var stroke = 0;
	    if( s!= "."){stroke = getEle(s);}
	    //if( s == "."){stroke = -0.1; } //pause adds -0.2 weighted to nearby notes
	    var weight = stroke + weightedArr[index];
	    //if(index == duration - 1){
	    //  weight -= 0.1;
	    //}
	    return weight;
	    
	});

	

	var fAccent = weightedArr;
	
	var w1 = parseFloat(document.getElementById("backWeight").value), w2 = parseFloat(document.getElementById("frontWeight").value);

	var contrastedArr = fAccent.map(function(s,index,arr){
	    if(index == 0){
		return 1*s - w2*arr[(index+1)%duration];
	    }
	    else if (index == duration - 1){//last beat
		return 1*s - w2*arr[modnum(duration,index,1)] - w2*getEle("clap");
	    }
	    else return 1*s - w1*arr[modnum(duration,index,1)] - w2*arr[(index+1)%duration];
	});   
	//document.getElementById(str + "Diction").split(",");generateBaseValue(duration,"ta");

	/*var weightedArr = lArr.map(function(s,index){
	  return s[0];
	  });*/
	
	//increase the beats by the actual level at which they are played
	contrastedArr = contrastedArr.map(function(s,index){
	    if(index % 4 == 0 ){
	    	return s + lArr[index][0] + getEle("clap"); // add weight of samam to the pattern
	    }
	    else return s + lArr[index][0];
	});

	var accentStruct = contrastedArr.map(function(s,index,arr){
	    
	    if( index == 0){
		if( s > arr[index+1]){
		    return 1;
		}
		else return 0;
	    }
	    else if( index == duration - 1){
		if( s > arr[index-1]){
		    return 1;
		}
		else return 0;
	    }
	    else{
		var max = maxi(s,arr[modnum(duration,index,1)],arr[(index+1)%duration]);
		if( max != -1 && max == s && s!=0){
		    return 1;
		}
		else{
		    return 0;
		}
	    }
	    
	});
	
//	if(accentStruct.length == 14){
//	    debugger;
//	}
	console.log(accentStruct);
	return [accentStruct,weightedArr];
    };
    
    var acc = accent(loudnessArr,speedArr,dictionArr);
    return acc;

};




//generate array with base value
function generateBaseValue(duration, baseValue){
    var arr = [];
    for(var i=0; i<duration; i++){
	arr.push(baseValue);
    }
    return arr;
}

function getEle(htmlElement){
	if( !document.getElementById(htmlElement)){
		debugger;
	}
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
	var acc = wholeRand(1,duration);
	if(arr.length ==0){
	    arr.push(acc);
	}
	else if( arrElementCmp(acc,arr) == 0 ){
	    arr.push(acc);
	}
	else{
	    while( arrElementCmp(acc,arr) == 1 ){
		acc = wholeRand(1,duration);
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

//find position of occurences of element in an array
function findPosOccurences(ele,arr){
    
    var posArr = [];
    for(var i=0;i<arr.length;i++){
	var arele = arr[i];
	if(arele.length && ele.length){
	    if(arele.join("") == ele.join("")){
		posArr.push(i+1);
	    }
	}
	else{
	    if(arr[i] == ele){
		posArr.push(i+1);
	    }
	}

    }
    return posArr;

}

function normalize(fAccent){
	var num = fAccent[0], normAccent = [];
	if(numOccurences(num,fAccent) == fAccent.length){ // no accents
	    normAccent = fAccent.map(function(s,index){
		return 0;
	    });
	}
	else{
	    //adding the difference between successive accent levels
	    var sum = 0;
	    for(var index=0;index<fAccent.length;index++){	
		sum += Math.abs( fAccent[index]);
	    }

	    normAccent = fAccent.map(function(s,index){
		return s/sum;
	    });

	}
	return normAccent;	

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

function sum(a,b){
    return a + b;
}

