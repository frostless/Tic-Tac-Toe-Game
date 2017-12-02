$( document ).ready(function() {
//properties
var playerNumbers;
var playerTotalMoves = 0;//track the moves made by all players
var clientSymbol;
var ifPlayer1Turn = true;//decide player1 or player2
// var clientLastMove;//?fore player 2?
var AIlastMove;//saved in memory for AI to decide next move
var PlayerlastMove;//saved in memory for AI to decide next move
var ifPause = false;//should the game be pause?
var player1Wins = 0;//represent player or player1
var player2Wins = 0;//represent AI or player2

//use an associative array to represent the grids
var gamearr = [['','',''],['','',''],['','','']];


//start of helpers section
//get symbol
var getSymbolFromArr = function(num){
  if(num<3) return gamearr[0][num];
  else if (num<6) return gamearr[1][num-3];
  else return gamearr[2][num-6];
}
//get opposite symbol
var getOtherSymbol = function(sym){
  return sym =="O"?"X":"O";
}

//end of helpers section

//start of check win section
var checkWin = function(pos,sym){
   pos = Number(pos);
   if(checkHor(pos,sym)) return true;
   if(checkVer(pos,sym)) return true;
   if(checkDiag(pos,sym)) return true;
    return false;
  }

var ifDraw = function(){
  var result = false;
  if (playerTotalMoves==9) result =true;
  return result;
}

//check horizontally
var checkHor = function(pos,sym){
  if (pos<3){
   for (let i = 0; i < gamearr[0].length;i++){
     if(gamearr[0][i]!=sym) return false
   }
  }else if (pos<6){
    for (let i = 0; i < gamearr[1].length;i++){
     if(gamearr[1][i]!=sym) return false
   }
  } else{
    for (let i = 0; i < gamearr[2].length;i++){
     if(gamearr[2][i]!=sym) return false
   }
  }
  return true;
}
//check vertically
var checkVer = function(pos,sym){
  if(pos<3){
  if(getSymbolFromArr(pos+3)==sym&&getSymbolFromArr(pos+6)==sym){
      return true
    }
  }else if (pos<6){
     if(getSymbolFromArr(pos-3)==sym&&getSymbolFromArr(pos+3)==sym){
      return true
  }
} else{
  if(getSymbolFromArr(pos-3)==sym&&getSymbolFromArr(pos-6)==sym){
      return true
   }
  }
  return false;
}
//check diagnolly
var checkDiag =function(pos,sym){
  //recursion base
  if(pos==1||pos==3||pos==5||pos==7){
     return;
     }
  
  if(pos==0||pos==8){
    if (getSymbolFromArr(0)==sym&&getSymbolFromArr(4)==sym&&getSymbolFromArr(8)==sym){
      return true;
    }
  }
  
   if(pos==2||pos==6){
    if (getSymbolFromArr(2)==sym&&getSymbolFromArr(4)==sym&&getSymbolFromArr(6)==sym){
      return true;
    }
  }
  
  if(pos==4){
    var left = checkDiag(0,sym);
    if(left) return true;
    var right = checkDiag(2,sym);
    if(right) return true;
  }
  return false;  
}

//end of check win section

//start of AI section

//step 1
var AITryToWin = function(sym){
  AIlastMove = Number(AIlastMove);
  var pos = ifAboutToWin(AIlastMove,sym);
   if(pos||pos == 0){
    var ele = $('#'+pos);
    gameGridOnClicked(ele,sym);
    AIlastMove = pos;
    return pos;
    }
}

//step 2

var PlayerTryToWin = function(sym){
   PlayerlastMove = Number(PlayerlastMove);
   var playerSym = getOtherSymbol(sym)//transfer sym
    var pos = ifAboutToWin(PlayerlastMove,playerSym);
    //about to lose,prevent it
    if(pos||pos == 0 ){
      var ele = $('#'+pos);
      gameGridOnClicked(ele,sym);
      AIlastMove = pos;
      return pos;
    }
}

// step 4

var ifCenteredBySurrondedDiag = function(sym){
  var playerSym = getOtherSymbol(sym)//transfer sym
  if((getSymbolFromArr(4)==sym&&getSymbolFromArr(0)==playerSym&&getSymbolFromArr(8)==playerSym)||(getSymbolFromArr(4)==sym&&getSymbolFromArr(2)==playerSym&&getSymbolFromArr(6)==playerSym)) return true;
}

var attackForStep4 = function(sym){
    var x = Math.floor((Math.random() * 4))
     var arr = [1,3,5,7]
     var pos = arr[x]
     var ele = $('#'+pos);
    gameGridOnClicked(ele,sym);
     AIlastMove = pos;
     return pos;
}

//step 5 

var AICorners = function(sym){
     var x = Math.floor((Math.random() * 4))
     var arr = [0,2,6,8]
      while(getSymbolFromArr(arr[x])){
       x = Math.floor((Math.random() * 4))
     }
     var pos = arr[x]
     var ele = $('#'+pos);
    gameGridOnClicked(ele,sym);
     AIlastMove = pos;
    return pos;
}

//step 6 

var AIRandomMove = function(sym){
   var x = Math.floor((Math.random() * 9));
  while(getSymbolFromArr(x)){
    x = Math.floor((Math.random() * 9));
  }
   var ele = $('#'+x);
    gameGridOnClicked(ele,sym);
    var pos = x
    AIlastMove = pos;
    return pos;
}


var aIMove = function(sym){
  if(playerTotalMoves>=9) return;//if grid all been filled
    //step 1: if about to win, win 
  if(AIlastMove||AIlastMove==0){
    var pos = AITryToWin(sym);
    if(pos||pos==0) return;
  }
  //
  //step 2: if about to lose, try not to
  if(PlayerlastMove||PlayerlastMove==0){
   var pos = PlayerTryToWin(sym);
    if(pos||pos==0) return;
  }
  //
  
  //step 3 : try take the center pos
  if(!getSymbolFromArr(4)) {
     var ele = $('#'+4);
    gameGridOnClicked(ele,sym)
    AIlastMove = 4;
    return;
  }
  //
  
  //step 4; if center by surrounded diagnolly, attack
  if(ifCenteredBySurrondedDiag(sym)){
    //randomlly pick from 1,4,5,7 attack
    var pos = attackForStep4(sym);
    return;
  }
  
  //step 5 try corners
  if(!getSymbolFromArr(0)||!getSymbolFromArr(2)||!getSymbolFromArr(6)||!getSymbolFromArr(8)){
      //randomlly pick from 0,2,6,8 corners
   var pos = AICorners(sym)
   return;
  }
  //
  
  //step x:attack, if implement, would need to loop through the associative array, return array of possible positions, then compare all array and try to find the overlapping pos, otherwise just randomly pick one from those arrays pos
  //
  //step 6 randomlly move
    var pos = AIRandomMove(sym);
    return;
}

//end of AI section

// start of check if it is about to win section
var ifAboutToWin = function(pos,sym){
   pos = Number(pos);

   if(ifAboutToWinHon(pos,sym)!=null) return ifAboutToWinHon(pos,sym);
   if(ifAboutToWinVer(pos,sym)!=null) return ifAboutToWinVer(pos,sym);
  if(ifAboutToWinDiag(pos,sym)!=null) return ifAboutToWinDiag(pos,sym);
}
//horizontal
var ifAboutToWinHon = function(pos,sym){
  
  if(pos==0||pos==3||pos==6){
   if(getSymbolFromArr(pos+1)==sym&&!getSymbolFromArr(pos+2)){
      return pos+2
    }
        if(getSymbolFromArr(pos+2)==sym&&!getSymbolFromArr(pos+1)){
      return pos+1
    }
  }
    if(pos==1||pos==4||pos==7){
      if(getSymbolFromArr(pos+1)==sym&&!getSymbolFromArr(pos-1)){
      
      return pos-1
       }
      if(getSymbolFromArr(pos-1)==sym&&!getSymbolFromArr(pos+1)){
      return pos+1
       }
    }
  
   if(pos==2||pos==5||pos==8){
    if(getSymbolFromArr(pos-1)==sym&&!getSymbolFromArr(pos-2)){
      return pos-2
    }
      if(getSymbolFromArr(pos-2)==sym&&!getSymbolFromArr(pos-1)){
      return pos-1
    }
  } 
  return null;
}
//vertically
var ifAboutToWinVer = function(pos,sym){
   if(pos<3){
    if(getSymbolFromArr(pos+3)==sym&&!getSymbolFromArr(pos+6)){
      return pos+6
    }
      if(getSymbolFromArr(pos+6)==sym&&!getSymbolFromArr(pos+3)){
      return pos+3
    }
  } else if(pos<6){
      if(getSymbolFromArr(pos+3)==sym&&!getSymbolFromArr(pos-3)){
      return pos-3
       }
      if(getSymbolFromArr(pos-3)==sym&&!getSymbolFromArr(pos+3)){
      return pos+3
       }
    } else if(pos<9){
    if(getSymbolFromArr(pos-3)==sym&&!getSymbolFromArr(pos-6)){
      return pos-6
    }
      if(getSymbolFromArr(pos-6)==sym&&!getSymbolFromArr(pos-3)){
      return pos-3
    }
  } 
  return null;
}
//diagnolly
 var ifAboutToWinDiag = function(pos,sym){
 
   if(pos==0){
       if(getSymbolFromArr(pos+4)==sym&&!getSymbolFromArr(pos+8)){
      return pos+8
       }
      if(getSymbolFromArr(pos+8)==sym&&!getSymbolFromArr(pos+4)){
      return pos+4
       }
   }
   
  if(pos==2){
       if(getSymbolFromArr(pos+2)==sym&&!getSymbolFromArr(pos+4)){
      return pos+4
       }
      if(getSymbolFromArr(pos+4)==sym&&!getSymbolFromArr(pos+2)){
      return pos+2
       }
   }
   
   if(pos==6){
       if(getSymbolFromArr(pos-2)==sym&&!getSymbolFromArr(pos-4)){
      return pos-4
       }
      if(getSymbolFromArr(pos-4)==sym&&!getSymbolFromArr(pos-2)){
      return pos-2
       }
   }
   
   if(pos==8){
       if(getSymbolFromArr(pos-4)==sym&&!getSymbolFromArr(pos-8)){
      return pos-8
       }
      if(getSymbolFromArr(pos-8)==sym&&!getSymbolFromArr(pos-4)){
      return pos-4
       }
   }
   
   if(pos==4){
  
      if(getSymbolFromArr(pos-4)==sym&&!getSymbolFromArr(pos+4)){
       
      return pos+4
       }
      if(getSymbolFromArr(pos+4)==sym&&!getSymbolFromArr(pos-4)){
      return pos-4
       }
      if(getSymbolFromArr(pos-2)==sym&&!getSymbolFromArr(pos+2)){
      return pos+2
       }
      if(getSymbolFromArr(pos+2)==sym&&!getSymbolFromArr(pos-2)){
      return pos-2
       }
   }
   return null; 
 }
  
 //end of check if it is about to win section
 
 //check win and post game
 var postGame = function(pos,sym){
   if(ifDraw()){
     showResult("draw game!")
     return true;
   }
   if(checkWin(pos,sym)){
      if(sym==clientSymbol){
       showResult("player 1 won！")
        $('#player1score').text(++player1Wins);
      }else{
         if(playerNumbers==1) showResult("AI beat you！")
           else if(playerNumbers==2) showResult("player 2 won！")
   $('#player2score').text(++player2Wins);
      }
   return true;
   }
   return false
}
 
 var showResult = function(str){
   ifPause = true;
   $('.gamegrid').css('opacity',0.2);
   $('#result').text(str);
   $("#result").fadeIn(2000).fadeOut(2000,function(){
     $('.gamegrid').css('opacity',1);
     ifPause = false;
     newGame();
   });
 }
 //new game after initial game
 var newGame = function(){
   $('.gamegrid').children().text('');
   //reset
  playerTotalMoves = 0;
  AIlastMove = undefined;
  PlayerlastMove = undefined;
  gamearr = [['','',''],['','',''],['','','']];
   //randomly decide turn,reset ifPlayer1Turn if player1 play first
   if(decideTurn()) ifPlayer1Turn = false;
   else ifPlayer1Turn = true;
 }

//end of check win and post game
 //start of displaying turn
 var displayTurn = function(sym){
   sym = getOtherSymbol(sym);
   var player,ele;
   if(playerNumbers==1) player = sym == clientSymbol?'Your Turn':'AI\'s Turn';
   else player = sym == clientSymbol?'Player 1 Go':'Player 2 Go';
  
   ele = sym == clientSymbol?$('#player1turn'):$('#player2turn');
   $(ele).text(player);
   
   $(ele).animate({top: "-42px"},1200,function(){
  $(ele).animate({top: "0px"},1200);
});
 }
 
 var decideTurn = function(){
    var turn,sym;
    var n = Math.floor((Math.random() * 2));
   if(n==0){
     turn = "player1";
     sym = clientSymbol;
   } else{
     turn = playerNumbers==1?"AI":"player2";
     sym = getOtherSymbol(clientSymbol);
   }
   displayTurn(getOtherSymbol(sym));
   if(turn=="AI") {
      ifPause = true;
     t = setTimeout(function(){
     aIMove(sym);
     ifPause = false;
    displayTurn(sym);//display opposite turn
    }, 1200);
   }
   
   if(turn=="player2") return "player2";
 }
 
 //end of displaying turn
 //start of onclick events section

var playerNumberBtnClicked = function(num){
  //if one player
  if(num==1){
    $('#displaytext').text('Would you like to be X or O?');
  } else{//two players
    $('#displaytext').text('Player 1 : Would you like X or O?');
  }
    $('#oneplayer').text('X');
    $('#twoplayer').text('O');
   playerNumbers = num;
   $('#interaction').append('<div id = "back" class = "text-center"><button class = "text-center"><span class = "glyphicon glyphicon-menu-left"></span>Back</button></div>'); 
}

var backBtnClicked = function(ele){
   $('#displaytext').text('How do you want to play?');
    $('#oneplayer').text('One Player');
    $('#twoplayer').text('Two Player');
   playerNumbers = undefined;
   clientSymbol = undefined;
   $(ele).remove();
}

var reset = function(ele){
  $('#interaction').css('display','initial');
  $('#player2Name').text('');
   $('#player1score,#player2score').text(0);
  $('#winscontainer').css('visibility','hidden');
  $('#displaytext').text('How do you want to play?');
    $('#oneplayer').text('One Player');
    $('#twoplayer').text('Two Player');
  playerNumbers = undefined;
  clientSymbol = undefined;
  playerTotalMoves = 0;
  ifPlayer1Turn = true;
  AIlastMove = undefined;
  PlayerlastMove = undefined;
  player1Wins = player2Wins = 0;
  $('.gamegrid').remove();
  $('#back').remove();
  gamearr = [['','',''],['','',''],['','','']];
  $(ele).css('visibility','hidden');
}

var gameInitial = function(sym){
  clientSymbol = sym;
  $('#interaction').css('display','none');
   $('#reset').css('visibility','visible');
  //init soresbooard
  $('#winscontainer').css('visibility','visible');
  var str = playerNumbers==1?'AI':'Player2';
  $('#player2Name').text(str);
    for(var i = 0;i<9;i++){
      $('#innerwrapper').append('<div class = "gamegrid" id = '+ i +'><div class="gamecontent"></div></div>'); 
    }
  if(decideTurn()) ifPlayer1Turn = false;//player 2 turn
}
//logic after grid is clicked
var gameGridOnClicked = function(ele,sym){
  $(ele).children().text(sym).css('display','none').fadeIn(2300);
  var pos = $(ele).attr('id');
  if(pos<3) gamearr[0][pos] = sym;
  else if(pos<6) gamearr[1][pos-3] = sym;
  else gamearr[2][pos-6] = sym;
   //incrememt playerTotalMoves
  playerTotalMoves++;
}

//entry point
$('#oneplayer,#twoplayer').on('click',function(){
  if(!playerNumbers){
  playerNumberBtnClicked($(this).val()); 
  }else{
   gameInitial($(this).text());
  }
})

$('#reset').on('click',function(){
  reset($(this));
  })

$('#interaction').on('click','#back',function(){
  backBtnClicked($(this));
})

$('#innerwrapper').on('click','.gamegrid',function(){
  var pos = $(this).attr('id');
  //if grid has been filled,return
  if(getSymbolFromArr(pos)) return;
  //if ifPause,return
  if(ifPause) return;
  //player1 move
  if(ifPlayer1Turn){
    var sym = clientSymbol;
    gameGridOnClicked(this,sym);//fill the array
    PlayerlastMove = pos;
    //only change bool if two players mode selected
   if(playerNumbers==2) ifPlayer1Turn = false;
    if(postGame(pos,sym)) return;//checkwin
    displayTurn(sym);//display opposite turn
  } else{//player 2's turn 
      var player2Sym = getOtherSymbol(clientSymbol);
      gameGridOnClicked(this,player2Sym);//fill the array
      ifPlayer1Turn = true;
      if(postGame(pos,player2Sym)) return;//checkwin
       displayTurn(player2Sym)//display opposite turn
  }
  //AI move if AI is seleted
  if(playerNumbers==1){
    //delay the AI by settimeout
    ifPause = true;//disable player move
    t = setTimeout(function(){
    var aiSym = getOtherSymbol(sym)
    aIMove(aiSym);
    ifPause = false;
    if(postGame(AIlastMove,aiSym)) return;//checkwin
    displayTurn(aiSym);//display opposite turn
    }, 1200);
  }
})

//end of onclick events section
})