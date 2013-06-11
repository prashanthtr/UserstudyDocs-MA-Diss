

/*
fAccent -- 1 or 0, does not have weak accent inforamtion


function decide(fAccent,strokeAccent,loudnessAcc){
    
    var accent = fAccent.map(function(s,index){
	if(fAccent > 0){
	    return fAccent;
	}
	else{
	    if(strokeAccent[index] == 0){
		return 0;
	    }
	    else{
		return weak;
	    }
	}
    });
    
    return accent;
    
}

fAccent = accent;

if(transposeIndex(fAccent) == 4){
    if(numStrokes <= 2){
	
    }
    else{
	
    }
}
    else if()



	function reverse(arr){
	    var rev = arr.map(function(s,index){
		return arr[arr.length - 1 - index];
	    });
	    return rev;
	}

function patternRecontruct(rev,strokeSeq){
    
    var strokeStr = "";
	
    if(index == 0){
	strokeStr += strokeSeq.splice(rev[index],duration-1).join(",");
    }
    else if(index == rev.length -1){
	strokeStr += strokeSeq.splice(0, rev[index]).join(",");
    }
    else{
	strokeStr += strokeSeq.splice(rev[index+1],rev[index]).join(",");
    }

    var temp = strokeStr.split(",");
    temp = temp.splice(0,temp.length-1);   

    return temp;
}


*/


var duration = 8;

/*
function finalAccent(speedAccent,loudnessAcc){
    var strong = 0.5, weak = 0.5, speedDouble = 0.5;    

    var accentSpeed = speedAccent.map(function(s,index){

	if(s.length > 1){
	    return 1/ s.length;
	}
	else{
	    return 0;
	}
    });
    
    var accentLoud = loudnessAcc.map(function(s,index){
	if(s == strong || s==weak || s == 0 ){
	    return s;
	}
	else{
	    return weak;
	}

    });

    var accent = accentLoud.map(function(s,index){
	return s + accentSpeed[index];
    });
    
    return accent;
}*/


/*
function normalizeAccent(fAccent){

    //adding the difference between successive accent levels
    var sum = 0;
    for(var index=0;index<fAccent.length;index++){	
	sum += Math.abs( fAccent[modnum(index,1)] - fAccent[index]) ;
    }

    var normAccent = fAccent.map(function(s,index){
	return s/sum;
    });
    
    return normAccent;
}*/


function normalizeAccent(fAccent){
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

function compareAccent(fAccent,tala){
    var normAccent = normalizeAccent(fAccent);
    var normTala = normalizeAccent(tala);

    var difference = 0;
    
    var diff = normTala.map(function(s,index){
	difference += Math.abs( s - normAccent[index]);
	return Math.abs( s - normAccent[index]);
    });

    console.log(difference);
    return difference;
}


function finalAccent(speedArr,loudnessArr){
    
    //loudness arr : combination of strong, weak and 0, later should be modified as a function

    //speedarr = [2,2,2,2,[4,4],2,2,2] (what does duration contribute to overall accent)
    // loudness = [0.5, 0, 0, 0, 0.5,0,0,0] (what does loudness contribute to overall accent amplitude)

    var accentSpeed = speedArr.map(function(s,index){
	if(s.length > 1){
	    return speedDouble;
	}
	else{
	    return 0;
	}
	
    });
    
//    accentSpeed = relLevel(accentSpeed); // normalized
//    accentSpeed = accentSpeed.map(function(s){
//	    return Math.abs(s);
//    });
//    accentSpeed = normalizeAccent(accentSpeed);

    var accentLoud = loudnessArr;
    
    var accent = accentLoud.map(function(s,index){
	    return s + accentSpeed[index];
    });
    
    return accent; //weighted accent structure
    //output = [0.5, 0 , 0, [0.75,0.75],0,0,0] (what does duration contribute to overall accent)

}



//relative levels between notes [ does not returning an array containing subarrays]
function relLevel(array){
    
    var prev = 0, cur1 = 0, cur2 = 0, next =0;
    
    var relLevelArr = array.map(function(s,index,arr){

	prev = arr[modnum(index,1)];
	next  = arr[(index+1)%duration];
	if(ifArr(prev)){
	    prev = prev[prev.length-1];
	}
	if(ifArr(next)){
	    next = next[0];
	}
	if(s.length > 1){
	    cur1 = s[0];
	    cur2 = s[s.length -1];
	}
	else{
	    cur1 = cur2 = s;
	}
    
	return cur1- prev + cur2 - next;
    });

    return relLevelArr;
}


function finalAccent(speedArr,loudnessArr){
    
    //loudness arr : combination of strong, weak and 0, later should be modified as a function

    //speedarr = [2,2,2,2,[4,4],2,2,2] (what does duration contribute to overall accent)
    // loudness = [0.5, 0, 0, 0, 0.5,0,0,0] (what does loudness contribute to overall accent amplitude)

    var accentSpeed = speedArr.map(function(s,index){
	if(s.length > 1){
	    return speedDouble;
	}
	else{
	    return 0;
	}
	
    });
    
//    accentSpeed = relLevel(accentSpeed); // normalized
//    accentSpeed = accentSpeed.map(function(s){
//	    return Math.abs(s);
//    });
//    accentSpeed = normalizeAccent(accentSpeed);

    var accentLoud = loudnessArr;
    
    var accent = accentLoud.map(function(s,index){
	    return s + accentSpeed[index];
    });
    
    return accent; //weighted accent structure
    //output = [0.5, 0 , 0, [0.75,0.75],0,0,0] (what does duration contribute to overall accent)

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

function accentStructure(fAccent){
    
//    var baseAccent = generateBaseValue(0.5);
    
    //fAccent = multilarray
    //var weights = relLevel(fAccent); //single array of weights
    
    var accentStruct = fAccent.map(function(s,index,arr){
	var max = maxi(s,arr[modnum(index,1)],arr[(index+1)%duration]);
	if( max != -1 && max == s){
	    return 1;
	}
	else{
	    return 0;
	}
    });

/*    msd = 0;
    for(i=0;i<baseAccent.length;i++){
	msd += Math.pow( tala[i] - accentStruct[i] , 2);
    }
    console.log("msd " + msd);*/
    return accentStruct;

}

var s = 1, w=0.5, speedDouble = 0.25;

var loudnessAccent = [s,w,w,w,w,w,w,w];
var speedAccent = [[4,4],2,2,2,[2,2],2,2,2];

var fAccent = finalAccent(speedAccent,loudnessAccent); //should return with speed included
//[0,0,0,0,0,0,0,0.2];

//var fAccent = 

var tala = [1,0,0,0,1,0,0,0];
var acc = accentStructure(fAccent);

compareAccent(acc,tala);

function contrastNote(accent){
    var acc = accent.map(function(s,index,arr){
	return s - arr[modnum(index,1)] + s - arr[(index+1)%duration];
    });
    return acc;
}

// study set up, 


//returns num - sub % duration
function modnum(num,sub){
    var duration = 8;
    if(num - sub < 0){
	return duration + (num - sub)%duration;
    }
    else{
	return (num - sub)%duration;
    }
    
}


function rlAccent(){
    var rAccent = rhythmAccent();
    var lAccent = loudnessAccent();
    
    var loudnessAcct = lAccent.map(function(s,index){
	if(rAccent[index] == 0){
	    return 0;
	}
	else{
	    return s;
	}
    });
    
    return loudnessAcct;
}



function decide(fAccent){
    
    //maps weak accent and pauses to zeros and others to ones
    var bfAccent = fAccent.map(function(s,index){
	if(s == 0 || s == weak){
	    return 0;
	}
	else{
	    return 1;
	}
    });

    if( transpose(bfAccent,2) && transpose(bfAccent,4) && transpose(bfAccent,6) ){
	return 1;
    }
    else if(transpose(bfAccent,4)){
	return 3;
    }
    else{
	return 4;
    }
   
    var g1 = [0,0,0,0,0,0,0,0], g2 = [1,0,0,0,1,0,0,0], tala3 = [1,0,1,0,1,0,1,0];

    /*if( compareAccent(fAccent,g1) == 0 || compareAccent(fAccent,g2) == 0 || compareAccent(fAccent,g3 == 0) ){
	return 1;
    }
    else{
	return 4;
    }*/

}



/*
function closestAccent(g){


    function maxi(a,b,c){
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
}*/




// clarify how much do each of the properties contribute to the accent structure 

/*
speed double - initial level + "x"
loudness - initial + "x"




function accentStructure(fAccent){
    
    
    var weights = contrastNote(fAccent);
    
    var accentStruct = baseAcccent.map(function(s,index){
	return s + weights[index];
    });
    
    return accentStruct;
}

function contrastNote(accent){
    var acc = accent.map(function(s,index,arr){
	return s - arr[modnum(index,1)] + s - arr[(index+1)%duration];
    });
    return acc;
}

// study set up, 


*/

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


//generate array with base value
function generateBaseValue(baseValue){
    var arr = [];
    for(var i=0; i<duration; i++){
	arr.push(baseValue);
    }
    return arr;
}


function ifArr(arr){
    if(arr.length>1){
	return 1;
    }
    else{
	return 0;
    }
}





/*

if(s.length > 1){
    var beatdur = 1 / s.length;
    
}



//could be time/ amplitude level, how to know, not scaling for time factor

function ( prev, cur1, cur2, next){

}


    function normalizeAccent(fAccent){
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

/*	    var obj = {};
	    obj["g1"] = [0,0,0,0,0,0,0,0];
	    obj["g2"] = [1,0,0,0,1,0,0,0]; 
	    obj["g3"] = [1,0,1,0,1,0,1,0];*/
	    
	    var g1 = [0,0,0,0,0,0,0,0], g2 = [1,0,0,0,1,0,0,0], g3 = [1,0,1,0,1,0,1,0];
	    compareAccent(fAccent,g2);

	    function closestAccent(fAccent, g1,g2,g3){
		var a = compareAccent(fAccent,g1), b=compareAccent(fAccent,g2), c=compareAccent(fAccent,g3);

		function mini(a,b,c){
		    if(a<=c && a<=b){
			return [a,"g1"];
		    }
		    else if(b<=a && b<=c){
			return [b,"g2"];
		    }
		    else{
			return [c,"g3"];
		    }
		    
		}
		return mini(a,b,c);
	    }
	    //var closest = closestAccent(fAccent, g1,g2,g3);
	    //console.log( closest[0] + " " + closest[1]);

*/









function decide(fAccent){


    var fAccentStr = fAccent.join("");
    var ele = fAccent[0];	
    var posArr = findPosOccurences(1,fAccent);

    if( numOccurences(ele,fAccent) == fAccent.length ){ // no differences in accent
	//console.log("generic");
	return 1;
    }
    else{
	//tala positions
	if( arrElementCmp(1,posArr) == 1 && arrElementCmp(5,posArr) == 1 ){
	    
	    if( fAccentStr == transpose(fAccent,4).join("")){ //symmetry
		if( arrElementCmp(3,posArr) == 1 && arrElementCmp(7,posArr) == 1 ){ // symmetry due to 3 and 7 positions
		    //console.log("generic");
		    return 1;
		}
		else if(!arrCmp(posArr,[2,3,4,6,7,8])){ //symmetry over all other values being 0
		    //console.log("generic");
		    return 1;
		}
		else{
		    //console.log("Non Generic but on the boundary between generic and non generic");
		    return 2;
		}
	    }
	    else if(arrElementCmp(3,posArr) == 1 || arrElementCmp(7,posArr) == 1){//accent on 3 or 7 but non symmetric
		return 2;
	    }
	    else{
		return 3;
	    }

	}
	else{
	    if( fAccentStr == transpose(fAccent,4).join("")){ //symmetry
		return 2;
	    }
	    else{
		//non generic boundary
		return 3;
	    }
	}
	

    }
    
}









