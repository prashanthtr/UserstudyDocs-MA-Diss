

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
var spaceVar = 0;

var wavs = ['ta', 'te', 'tum','tumki','thum', 'tha','thi','thom','num','dhin','dheem','dham','ri','tham','bheem'];
    var sounds = {};
	
	var leadVolume= 1.0, acmpVolume=1.0, melVolume = 1.0, delay_range=0.03,tempo,accomp_start,tala=1,accomp_flag = 0,kanjira_start=4,input=null, mridangam_in = null,play_on=0;

var generic=1, interval, intonation, duration = 8, strokeDensity,accent,gap,dur_left, genericcity = 1, accomp;


	
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


var play_pattern = document.getElementById('play');			
play_pattern.addEventListener("click", playKanjira , true);



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
		
}

function playKanjira(){
    //debugger;
    
    //sh.running = true;
    //debugger;

    	/*var genericcity = parseFloat(document.getElementById("genericcity").value);
	function generic(){
	    if(genericcity == 4){genericcity = wholeRand(1,3);}
	    return genericcity;
	}
	var gen = generic();
*/
//    sh.running = false;
    //var currentComposition = kanjira(1);
    //sh.play(  sh.loop ( currentComposition ));
    //sh.play(kanjira(1));
    kanjira(1);
    
//    sh.play( sh.loop( sh.dynamic (function (clock){kanjira(1);}));
    
}

//var kanjira = ( function (){

function kanjira(generic){
	
    var currentComposition = sh.delay(1.0);
    var track_delay = parseFloat(document.getElementById("track_delay").value);

    //generates accompaniment based on genericcity
    function generateAccompaniment(generic){

/*	var times = 4;
	if(generic == 1 || generic ==  2){
	    times = 4;
	}
	else if(generic == 3){times = 2;}
	else {times = 1;}

	var stroke = combine_track(generic);
	var strokeSeq = stroke[0];
	var strokeTempo = stroke[1];
	var strokeAccent = stroke[2];*/
	

	return sh.track( strokeSeq.map(function(s,index){
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

	}));
    }

    var pause  = 6, speed = 0, avarthanam = 1, diction = generateRandArr(0,3), dictionIndex = 0;
    
    
    var generator = sh.loop(sh.dynamic(function (clock) {

	if(pause < 0){ pause = 0;}
	if(speed == 8){ speed == 0; pause = 6; dictionIndex++;}
	if(dictionIndex == 3){
	    sh.running = false;
	}

	var stroke = combine_track(generic,pause--,speed++,dictionIndex);
	var strokeSeq = stroke[0];
	var strokeTempo = stroke[1];
	var strokeAccent = stroke[2];
	
	return sh.track( strokeSeq.map(function(s,index){
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

	}));
    }));

    sh.play(generator);

  //return  currentComposition = generateAccompaniment(1);
    //currentComposition = generateAccompaniment(generic);
	/*sh.track(
	sh.rate(tempo / 60),
	generateAccompaniment(generic)
    );*/

//    sh.play( sh.dynamic (function (clock){ return currentComposition}));
//	   dynamic(function (clock) { return currentComposition; }));
    
    
    function rhythmAccent(){
	var numPauses = parseFloat(document.getElementById("numRhythmAccents").value);
	if(numPauses > 0){
	    if(spaceVar > 0){ //loudness already defined
		spaceVar++;
	    }
	    else spaceVar += 2;
	}
	var s = 1, w=0.5, speedDouble = 0.25;
	var accent_arr = generateBaseValue(w);
	var arr = generateRandArr(duration,numPauses,"rhythmAccent");
	for(var i=0; i<duration; i++){
	    if(arrElementCmp(i,arr)){
		accent_arr[i] = 0;
	    }
	}
	return accent_arr;
    }

    function loudnessAccent(){
	var numAccents = parseFloat(document.getElementById("numLoudnessAccents").value), accent_arr = [];
	if(numAccents > 0){
	    spaceVar = 2;
	}	
	var s = 1, w=0.5, speedDouble = 0.25;
	accent_arr = generateBaseValue(w);

	var arr = generateRandArr(duration,numAccents,"loudnessAccent");
	for(var i=0; i<duration; i++){
	    if(arrElementCmp(i,arr)){
		accent_arr[i] = s;
	    }
	    else{
		accent_arr[i] = w;
	    }
	}
	document.getElementById("loudnessAccent").value = "[" + findPosOccurences(1,accent_arr).join(",") + "]";	
	return accent_arr;
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
    
    function speedAccent(strokeAccent){
	var numStrokes = parseFloat(document.getElementById("numStrokes").value);
	var arr = generateRandArr(duration,numStrokes,"speedAccent");
	var tempStrokeTempo = "";
	
	for(var i=0; i<duration; i++){
	    if(arrElementCmp(i,arr) && strokeAccent[i] != 0){
		tempStrokeTempo += "[4,4],";
	    }
	    else{
		tempStrokeTempo += 2 + ",";
	    }
	}	
	return eval("[" + tempStrokeTempo + "]");
    }
    
    //string manipulation
    function speedChange(strokeSeq, strokeAccent,arr){
	
	var tempStrokeSeq = "", tempStrokeTempo = "", tempStrokeAccent = "", tempLoudnessAccent = "";
	
	arr = arr.map(function(s){
	    return s-1;
	});
	var offset = parseInt(document.getElementById("offset").value);
	//offbeat();
	function offbeat(){
	    for(var i=0;i<offset;i++){
		tempStrokeSeq += ".,";
		tempStrokeTempo += "2,";
		tempStrokeAccent += "0,";
	    }
	}
	
	for(var i=0; i<duration; i++){
	    if(arrElementCmp(i,arr) && strokeAccent[i] != 0){
		tempStrokeSeq += "ta te,";
		//tempStrokeTempo += "[4,4],";
		//tempLoudnessAccent = "[0.4, 0.4],";
		tempStrokeAccent += "[0.5, 0.5],";
		//}
		/*else{
		    /*tempStrokeSeq.push("ta");tempStrokeTempo.push(8);
		      tempStrokeSeq.push("te");tempStrokeTempo.push(8);
		      tempStrokeAccent.push(weak);tempStrokeAcaccent.push(weak);
		      tempStrokeSeq.push("ta");tempStrokeTempo.push(8);
		      tempStrokeSeq.push("te");tempStrokeTempo.push(8);
		      tempStrokeAccent.push(weak);tempStrokeAcaccent.push(weak);
		    tempStrokeSeq += "ta te ta te,";
		    tempStrokeTempo += "[8,8,8,8],";
		    tempStrokeAccent += "[0.4, 0.4, 0.4, 0.4],";*/
		    
		//}
		
	    }
	    else{
		tempStrokeSeq += strokeSeq[i] + ",";
		//tempStrokeTempo += strokeTempo[i] + ",";
		tempStrokeAccent += strokeAccent[i] + ",";
		//tempLoudnessAccent += loudnessAcc[i] + ",";
		/* tempStrokeSeq.push(accomp[i]);
		   tempStrokeTempo.push(strokeTempo[i]);
		   tempStrokeAccent.push(strokeAccent[i]);*/
	    }
	}
	var temp = tempStrokeSeq.split(",");
	temp = temp.splice(0,temp.length-1);
	return [temp,eval( "[" + tempStrokeAccent + "]")];
    }

/*
    function finalAccent(speedAccent,loudnessAcc){
	var strong = 3.0, weak = 0.4;    

	var accentSpeed = speedAccent.map(function(s,index){

	    if(s.length > 1){
		return s.length/2;
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

    function compareAccent(fAccent,tala){	

	var normAccent = normalizeAccent(fAccent);
	var normTala = normalizeAccent(tala);
	var difference = 0;
	
	var diff = normTala.map(function(s,index){
	    difference += Math.pow( s - normAccent[index], 2);
	    return Math.abs( s - normAccent[index]);
	});

	console.log(difference);
	return difference;
    }


/*    function finalAccent(strokeAccent,loudnessAcc){

	var strong = 3.0, weak = 0.4;
	var accentLoud = generateBaseValue(0), accentPause = generateBaseValue(0), accentSpeed = generateBaseValue(0);
	
	
	accentLoud = loudnessAcc.map(function(s,index){
	    if(s == 0){
		return 0;
	    }
	    else if(s == weak){
		return 0;
	    }
	    else if(s == strong){
		return 1;
	    }
	});

	accentPause = strokeAccent.map(function(s, index){	
	    if(s == 0){
		return 0;
	    }
	    else if( s == weak || s == strong){
		if(strokeAccent[(index + 1)%duration] == 0){
		    return accentPause[index]+1;
		}
		else{
		    return accentPause[index];
		}
	    }
	    else if(s.length > 1){ // pause after a speed double
		if(strokeAccent[(index+1)%duration] == 0){
		    return 1;
		}
		else if(accentLoud[index] != 0){
		    return accentLoud[index];
		}
		else{
		    return 0;
		}
	    }
	});

	accentSpeed = strokeAccent.map(function(s, index){		    
	    if(s == 0){
		return 0;
	    }
	    else if( s == weak || s== strong){
		if( strokeAccent[(index + 1)%duration].length > 1 || ( (strokeAccent[modnum(index,1)].length > 1 &&  strokeAccent[modnum(index,2)].length > 1 && strokeAccent[modnum(index,3)] == 0)  || ( strokeAccent[modnum(index,1)].length > 1 && strokeAccent[modnum(index,2)] == 0) ) ){
		    return accentSpeed[index]+1;
		}
		else{
		    return accentSpeed[index];
		}		
	    }
	    else if(s.length > 1){ // speed double after a pause
		if(strokeAccent[(index-1)%duration] == 0){
		    return accentSpeed[index]+1;
		}
		else{
		    return accentSpeed[index];
		}
	    }
	    
	});
	var accent = accentLoud.map(function(s,index){
	    return s + accentPause[index] + accentSpeed[index];
	});
	
	return accent;
    }*/

    /*
    function finalAccent(strokeAccent){
	
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
	//debugger;
	return accent;
    }*/
    
    //decide whether the pattern is Generic or non generic

    /*
    function decide(fAccent){
	//var posArr1 = findPosOccurences(1,fAccent), posArr2 = findPosOccurences(2,fAccent), posArr3 = findPosOccurences(3,fAccent);
/*	var binaryfAccent = fAccent.map(function(s,index){
	    if(s != 0){
		return 1;
	    }
	    else{
		return 0;
	    }
	});
	var posArr = findPosOccurences(1,binaryfAccent);

	if( posArr.length == 0){ //no accent
	    console.log("generic");
	    return 1;
	}
*/	
    /*
    function decide(fAccent){

	var fAccentStr = fAccent.join("");
	var ele = fAccent[0];	
	var posArr = findPosOccurences(1,fAccent);

	  if( numOccurences(ele,fAccent) == fAccent.length ){ // no differences in accent
	      //console.log("generic");
	      return 1;
	  }
	  else{
	      if( fAccentStr == transpose(fAccent,4).join("")){
		  if(arrElementCmp(1,posArr) == 1 || arrElementCmp(5,posArr) == 1 ){
		      if(arrElementCmp(2,posArr) == 1 || arrElementCmp(4,posArr) == 1 || arrElementCmp(6,posArr) == 1 || arrElementCmp(8,posArr) == 1){
		//	  console.log("Non Generic but on the boundary between generic and non generic");
			  return 2;
		      }
		      else{
		//	  console.log("generic");
			  return 1;

		      }
		  }	
	      }
	      else{
		  else{
		      if(arrElementCmp(2,posArr) == 1 || arrElementCmp(4,posArr) == 1 || arrElementCmp(6,posArr) == 1 || arrElementCmp(8,posArr) == 1){
			  //	  console.log("Non Generic but on the boundary between generic and non generic");
			  return 3;
		      }
		      else{
			  //	  console.log("Generic boundary");
			  return 2;
		      }
		  }

		 // console.log("non generic/ completely reactive to the lead/song");
		  return 4;
	      }
	  }
    }*/

    
    
    function decide(fAccent,strokeSeq,speedAccent){


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
		    if( arrElementCmp(3,posArr) == 1 && arrElementCmp(7,posArr) == 1  ){
			
			// symmetry due to 3 and 7 positions
			if( speedAccent[3] == speedAccent[7]){
			    //console.log("generic");
			    return 1;
			}
			else{
			    return 2;
			}
			
		    }
		    else if( !arrElementCmp(2,posArr) && !arrElementCmp(3,posArr) && !arrElementCmp(4,posArr) && !arrElementCmp(6,posArr) && !arrElementCmp(7,posArr) && !arrElementCmp(8,posArr) ){ //symmetry over all other values being 0
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

 
	/*
	  console.log("non generic/ completely reactive to the lead/song");
	  return 4;

	  function decide(fAccent){
	
	var s = 1, w=0.5, speedDouble = 0.25;
	//maps weak accent and pauses to zeros and others to ones
	/*var bfAccent = fAccent.map(function(s,index){
	    if(s == 0 || s == w){
		return 0;
	    }
	    else{
		return 1;
	    }
	});

	var bfAccent = fAccent;
	var bfAccentStr = bfAccent.join("");
	var tala = [1,0,0,0,1,0,0,0];
	var posArr = findPosOccurences(1,bfAccent);

	if(  bfAccentStr == transpose(bfAccent,4).join("") && (arrElementCmp(1,posArr) == 1 || arrElementCmp(5,posArr) == 1 || numOccurences(bfAccent[0],bfAccent) == duration ) ){
	    compareAccent(bfAccent,tala);
	    return 1;
	}
	else if( bfAccentStr == transpose(bfAccent,4).join("")){
	    compareAccent(bfAccent,tala);
	    return 3;
	}
	else{
	    compareAccent(bfAccent,tala);
	    return 4;
	}
	

	var g1 = [0,0,0,0,0,0,0,0], g2 = [1,0,0,0,1,0,0,0], g3 = [1,0,1,0,1,0,1,0];

	if( compareAccent(fAccent,g1) == 0 || compareAccent(fAccent,g2) == 0 || compareAccent(fAccent,g3) == 0 ){
	    return 1;
	}
	else{
	    return 4;
	}

    }*/



    function finalAccent(speedArr,loudnessArr,strokeSeq){
	
	//loudness arr : combination of strong, weak and 0, later should be modified as a function

	//speedarr = [2,2,2,2,[4,4],2,2,2] (what does duration contribute to overall accent)
	// loudness = [0.5, 0, 0, 0, 0.5,0,0,0] (what does loudness contribute to overall accent amplitude)
	var s = 1, w=0.5, speedDouble =  parseFloat(document.getElementById("tate").value);

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
	

	//acconting for the weight of "Ta"
	accent = strokeSeq.map(function(s,index){
	    if(strokeSeq[index] == "ta"){
		if(index == duration - 1){
		    return accent[index] + parseFloat(document.getElementById("ta").value) - 0.1;
		}
		else{
		    return accent[index] + parseFloat(document.getElementById("ta").value);
		}
	    }
	    else if (strokeSeq[index].split(" ").length <= 1){
		return accent[index] + parseFloat(document.getElementById(strokeSeq[index]).value);
	    }
	    else{
		return accent[index];
	    }
		     /*== "tum"){
		return accent[index] + parseFloat(document.getElementById("tum").value);
	    }
	    else if (strokeSeq[index] == "tumki"){
		return accent[index] + parseFloat(document.getElementById("tum").value);
	    else {
		return accent[index];
	    }*/
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
	//contrast enhancement

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

	/*    msd = 0;
	      for(i=0;i<baseAccent.length;i++){
	      msd += Math.pow( tala[i] - accentStruct[i] , 2);
	      }
	      console.log("msd " + msd);*/
	return accentStruct;
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



    /*
    function decide(posArr){

	if(posArr.length == 0){
	    return 1;
	}
	else{
	    if( arrElementCmp(2,posArr) || arrElementCmp(4,posArr) || arrElementCmp(6,posArr) || arrElementCmp(8,posArr) ){
		console.log("Non Generic");
		return 4;
	    }
	    else if(arrElementCmp(3,posArr) && arrElementCmp(7,posArr) && !arrElementCmp(1,posArr) && !arrElementCmp(5,posArr)){
		console.log("Reverse Generic");
		return 4;
	    }	
	    else{
		var numStrokes = parseInt(document.getElementById("numStrokes").value);
		if( numStrokes > 2){
		    console.log("Non Generic but boundary, reactive to lead");
		    return 3;
		}
		else{
		    if ( (arrElementCmp(1,posArr) || arrElementCmp(5,posArr)) && !arrElementCmp(3,posArr) && !arrElementCmp(7,posArr) ){
			console.log("Generic");
			return 1;
		    }
		    else{
			console.log("Generic but more towards the boundary");
			return 2;
		    }
		}
	    }
	    }
	
	

	}*/

    function strokeSequence(){
	var Solkattu = [["tum","ta","tum","ta","ta","tum","tum","ta"],["ta","ta","tum","tum","ta","tum","tum","ta"],["ta","tum","tum","ta","ta","tum","tum","ta"]];
	return Solkattu[wholeRand(0,Solkattu.length-1)];
	//return ["ta","tum","tum","ta","ta","tum","tum","ta"];
	/*var arr = ["ta","tum"];
	var Solkattu = [];
	for(var i=0; i<duration;i++){
	    Solkattu.push(arr[wholeRand(0,arr.length-1)]);
	}
	return Solkattu;*/
    }

    function zeroAccent(){
	var n1 = parseInt(document.getElementById("numLoudnessAccents").value);
	var n2 = parseInt(document.getElementById("numStrokes").value);
	var n3 = parseInt(document.getElementById("numRhythmAccents").value);
	
	if(n1 ==0 && n2 == 0 && n3 == 0){
	    return 1;
	}
	else{
	    return 0;
	}
    }
    
    function combine_track(generic){

	//schedules to play the kanjira accompaniment - but if mridangam event is in, forks the track and adds that schedules that event too	

	var strokeSeq= strokeSequence();
	var tempStrokeSeq = strokeSeq;
	var strokeAccent=[], strokeTempo = [];
	var timer = 0, loudnessAcc = [], fAccent;	
	var space = Math.pow(4,8); // 8 spaces each having one of four possibilities
	var weightedArr = [];

	do{
	    
	    if(zeroAccent()){
		strokeSeq = strokeSequence();
	    }
	    else{
		strokeSeq = tempStrokeSeq;
	    }
	    //["tum","ta","tum","ta","ta","tum","tum","ta"];
	    strokeTempo = generateBaseValue(2);

	    //loudnessAcc = loudnessAccent();
	    //strokeAccent = rhythmAccent();
	    strokeAccent = rlAccent();
	    strokeTempo = speedAccent(strokeAccent);


	    var tala = [1,0,0,0,1,0,0,0];	    
	    
	    //stub
/*	    var s= 1.0, w= 0.5;
	    var strokeAccent = [w,w,w,w,w,w,w,w];
	    var strokeTempo = [2,2,2,2,2,2,2,2];
	    var strokeSeq = ["ta","tumki","tumki","ta","ta","tumki","tumki","ta"];*/
	    

	    fAccent = finalAccent(strokeTempo,strokeAccent,strokeSeq);	    
	    weightedArr = fAccent;
	    var accentLevel = fAccent;
	    fAccent = accentStructure(accentLevel);

//	    fAccent = fAccent.map(contrastNote);
//	    tala = tala.map(contrastNote);


	    //fAccent = normalizeAccent(fAccent);
	    //tala = normalizeAccent(tala);

	    //var posArr = findPosOccurences(1,fAccent);
	    	    //rudimentary version of sequence reordering

	    
	    var satisfied = decide(fAccent,strokeSeq,strokeTempo);
	    timer++;
	}while(satisfied != generic && timer<1000);

	document.getElementById("finalAccent").value = fAccent.join(" ");

	if(timer >= 1000){ // exp(2,8)
	    alert("change parameters and start generation again");
	    //stop the whole thing
	}	
	else{

	    	    // apply rhythm accent
	    strokeSeq = strokeSeq.map( function(s,index){
		if(strokeAccent[index] == 0){
		    return ".";
		}
		else{
		    return s;
		}
	    });

	    var speedStroke  = speedChange(strokeSeq,strokeAccent,findPosOccurences([4,4],strokeTempo));
	    strokeAccent = speedStroke[1];
	    
	    //strokeTempo = speedStroke[1];
	    strokeSeq = speedStroke[0];
	    compareAccent(weightedArr,tala);
	    
	    document.getElementById("kanjira_patterns").value = "[" + strokeSeq.join("|") + "]";		    
	    document.getElementById("speedAccent").value = "[" + findPosOccurences([4,4],strokeTempo).join(",") + "]";	
	    document.getElementById("rhythmAccent").value = "[" + findPosOccurences(0,strokeAccent).join(",") + "]";	
	    

	    strokeSeq = multiToSingleDimensionArray(strokeSeq);
	    strokeTempo = multiToSingleDimensionArray(strokeTempo);
	    strokeAccent = multiToSingleDimensionArray(strokeAccent);

	    return [strokeSeq,strokeTempo,strokeAccent];
	}
    }




 //   return function (generic) {
/*	currentComposition = sh.track(
	    sh.rate(tempo / 60),
	    generateAccompaniment(generic)
        );*/
  //  };

}//());


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
    if(subArr.length>1){
	for(index = 0; index<mainArr.length; index++){
	    if( mainArr[index].join("") == subArr.join("") ){
		compare = 1;
	    }
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

//generates array with unique values if documentelement is absent
function generateRandArr(duration, numValues, htmlelement){
    var arr = [];
//    var str = eval(document.getElementById(htmlelement).value); //accent array structure
    var str;
    if( !str ){
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
    }
    else{
	str = str.map(function(s){
	    return s-1;
	});
	arr = str;
    }
    
    //document.getElementById(htmlelement).value = arr.join(" ");
    return arr;
}

//returns single dimension array from multidimensional array
function multiToSingleDimensionArray( multiSeq ){ 
    var singleSeq = [], arr2 = [];
    for(var i=0; i<multiSeq.length; i++){
	var arr = multiSeq[i];
	if(!arr.length){
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

//generate array with base value
function generateBaseValue(baseValue){
    var arr = [];
    for(var i=0; i<duration; i++){
	arr.push(baseValue);
    }
    return arr;
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

//returns num - sub % duration
function modnum(num,sub){

    if(num - sub < 0){
	return duration + (num - sub)%duration;
    }
    else{
	return (num - sub)%duration;
    }
    
}

//transposing
function transpose(arr, transCounter){
    var transarr = arr.map(function(s,index){
	return arr[ (index+transCounter) % duration];
    });
    return transarr;
}


function transposeIndex(fAccent){
    
    var index = -1;
    for(var transInd = 1; transInd < duration; transInd++){
	if(fAccent.join("") == transpose(fAccent,transInd).join("")){
	    return transInd;
	}
    }
    return index;
}



// --------------------- main file ---------------------------------

// working code

/*    function sarvalaghu(duration){

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
	}
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
	    } 
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


	    function contrastNote(s,index,arr){
		return Math.abs(s - arr[modnum(index,1)]) + Math.abs(s - arr[(index+1)%duration]);
	    }

		  
/*			  if( (arrElementCmp(3,posArr) == 1 && arrElementCmp(3,posArr) == 1) || (arrElementCmp(3,posArr) == 0 && arrElementCmp(3,posArr) == 0) ){
			      console.log("generic");
			      return 1;
			  }
			  else{
			      console.log("generic boundary");
			      return 2;
			  }*/
			 // if( fAccent[6] == fAccent[2] ){
			      //console.log("generic");
			      //return 1;
			 /* }
			  else{
			      console.log("generic boundary");
			      return 2;
			  }*/


		  /*if( fAccentStr == transpose(fAccent,2).join("") || fAccentStr == transpose(fAccent,6).join("")){
		  var numStrokes = document.getElementById("numStrokes");
		  if(numStrokes <= 2 ){
		      console.log("Generic but on the boundary between generic and non generic");
		      return 2;
		  }
		  else{
		      console.log("Largely Generic, but less reactive to lead");
		      return 3;
		  }
	      }
	      else{*/












