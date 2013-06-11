
/*

Generic:

Musical goal: Should not Contradict/obstrcut the beat structure or the flow of the tala ( counted as 1234,1234..  )

Parametric goal: Accent only on the 1st, 3rd, 5th and the 7th beats.

I. Rhythmic accents( pauses)

In the case of Rhythmic accents(pauses), 
1 pause -> Accents on the next beat.
2 pauses -> Accent on the previous beat.
More than 3 Pauses -> is a combination of 1 and 2.

II. Speed doubling of certain strokes

In the case of accents introduced due to speed doubling certain strokes
1 stroke -> Accents on the next beat
2 strokes -> Accents on the (starting)previous beat
3 and above strokes -> Usually used for variations of Generic patterns ( combinations of 1 and 2)

III. Loudness Accent

Should confirm to the accents introduced by the previous 2 types of accents.

The overall constraint is that how many ever strokes are speed doubled or pauses are introduced, the parametric goal should be satisfied. 

Generic but Boundary:

Patterns with accents on the 3rd and the 7th are generic(boundary) but are less generic than accents on only 1st and 5th.

Non generic but on the boundary:

There are patterns that do not fall under generic but do not obstruct the flow of the tala. These patterns occur mainly during tempo/speed change but they can't be played unless the lead percussionist increases speed or tempo. Hence, they would from the boundary of generic patterns.

Non generic:

Musical Goal: Contradicting the beat structure or flow of the tala ( counted as 1234,1234.. )
Parametric Goal: Change accents structure to not at 1,3,5 or 7th beats.

One way to do this is to keep the same parameters of generic accompaniment but change the offset at which the pattern starts in the cycle. This would create patterns that are cross rhythms / polymeters and fall under non-generic. The procedure to generate them is to take generic ones and simply offset by a 1,2,3,5,6,7 beats. Offsetting by 0,4,8(maybe even 2 and 6) is likely to reintroduce the symmetry back in to the pattern. 


*/

var s = 3.0, w = 0.4, duration = 8;
var strokeAccent = [ w, 0, 0, [w,w], w, [w,w], w, w];
var strokeTempo = [ 2, 2, 2, [4,4], 2, 2, 2, 2];
debugger;


function finalAccent(){

    var accent = strokeAccent.map(function(s, index){	
	if(s == 0){
	    return 0;
	}
	else if(s == strong){
	    return 1
	}
	else if( s == weak){
		if( strokeAccent[index+1] == 0 || (strokeAccent[index+1] == 0 && strokeAccent[index+2] == 0) ){
		    return 1;
		}
		else if( strokeAccent[index+1].length > 1 || (strokeAccent[index+1].length > 1 && strokeAccent[index+2].length > 1) ){
		    return 1;
		}
	}
	else if(s.length > 1){
	    return 0;
	}
	
    });

}



function finalAccent( ){
    
    var strong = 3.0, weak = 0.4;
    var accent = strokeAccent.map(function(s, index){
	
	if(s == 0){
	    return 0;
	}
	else if( s == weak){
	    // rhhythm accents
	    if( strokeAccent[index+1] == 0 && strokeAccent[index+2] == 0){
		return 1;
	    }
	    else if( strokeAccent[index-1] && (strokeAccent[index-1] == 0 || (strokeAccent[index-1].length && strokeAccent[index-1].length > 1 ) ) ){
		return 1;
	    }
	    else 
	    {
		return 0;
	    }
	    
	}	
	else if(s.length > 1){
	    if(strokeAccent[index+1] && strokeAccent[index+1].length > 1){
		return 1;
	    }
	    else{
		return 0;
	    }
	}
	else if(s == strong){
	    return 1;
	}

    });
    debugger;
    return accent;
}

function findPosOccurences(ele,arr){
    
    var posArr = [];
    for(var i=0;i<arr.length;i++){
	if(arr[i] == ele){
	    posArr.push(i+1);
	}
    }
    return posArr;

}

var fAccent = finalAccent();
var posArr = findPosOccurences(1,fAccent);

if( arrElementCmp(2,posArr) || arrElementCmp(4,posArr) || arrElementCmp(6,posArr) || arrElementCmp(8,posArr) ){
    console.log("Non Generic");
}
else if(arrElementCmp(3,posArr) && arrElementCmp(7,posArr) && !arrElementCmp(1,posArr) && !arrElementCmp(5,posArr)){
    console.log("Reverse Generic");
}
else{
    var numStrokes = duration - numOccurences(2,strokeTempo);
    if( numStrokes > 2){
	console.log("Non Generic but boundary, reactive to lead");
    }
    else{
	if ( (arrElementCmp(1,posArr) || arrElementCmp(5,posArr)) && !arrElementCmp(3,posArr) && !arrElementCmp(7,posArr) ){
	    console.log("Generic");
	}
	else{
	    console.log("Generic but more towards the boundary");
	}
    }
}

//returns 1 if element found in array and returns 0 if no element is found
function arrElementCmp(element,array){
    var compare = 0;
    for(var index=0;index<array.length;index++){
	if(element == array[index]){compare = 1;}
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
