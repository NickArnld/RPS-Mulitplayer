var config = {
    apiKey: "AIzaSyD75BTPNKg8RNN7i_l1vnFWlumbSi5p8f0",
    authDomain: "rps-game-38e23.firebaseapp.com",
    databaseURL: "https://rps-game-38e23.firebaseio.com",
    projectId: "rps-game-38e23",
    storageBucket: "",
    messagingSenderId: "107015449294"
  };

firebase.initializeApp(config);
var database = firebase.database();
var gameCol = $('#gameCol');
var gameGoing = false;

$('#newGame').click(()=>{
    console.log("new game");
    if(!gameGoing){
        newGame();
    }
});

// database.ref().set({
//     clickCount: clickCounter
// });

function newGame(){
    gameCol.empty();
    var newGameObj = {
        gameName: "",
        playerOne: "",
        playerTwo: "",
        p1Record: [0,0],
        p2Record: [0,0],
        password: "",
        gameChoices: ["",""]
    }

    var nameInputDiv = $('<div>');
    nameInputDiv.append('<h3>Game Name:</h3>');
    nameInputDiv.append('<input id="gName" type="text"></input>');
    nameInputDiv.append('<h3>Player 1 Name:</h3>');
    nameInputDiv.append('<input id="p1Name" type="text"></input>');
    nameInputDiv.append('<h3>Player 2 Name:</h3>');
    nameInputDiv.append('<input id="p2Name" type="text"></input>');
    nameInputDiv.append('<h3>Game Password:</h3>');
    nameInputDiv.append('<input id="pWord" type="text"></input> <br>');
    nameInputDiv.append('<button id="nameSubmit" class="btn btn-primary">Start</button>');
    gameCol.append(nameInputDiv);

    $('#nameSubmit').click(function (){
        var p1 = $('#p1Name').val();
        var p2 = $('#p2Name').val();
        var gName = $('#gName').val();
        var pWord = $('#pWord').val();
        if(p1 == "" || p2 == "" || pWord == "" || gName == ""){
            nameInputDiv.append('<h3>Please fill all boxes!</h3>')
        } else {            
            newGameObj.gameName = gName; 
            newGameObj.playerOne = p1; 
            newGameObj.playerTwo = p2; 
            newGameObj.pWord = pWord;
            database.ref().set({  
                gameObj:{
                    name: newGameObj.gameName,
                    data: newGameObj,
                }
            })
            startGame(newGameObj);            
        } 
    });

}

function startGame(gameObj){  
    gameCol.empty();
    gameGoing = true;  
    console.log("START GAME Function");
    newChoiceWindow("Player 1", gameObj);
    // newChoiceWindow("Player 2");
}

function turnTwo(gameObj){
    gameCol.empty();  
    console.log("Second Turn");
    newChoiceWindow("Player 2", gameObj);
}

function winner(player, gameObj){
    var winner = "";
    var loser  = "";
    var wp; 
    var lp;
    var p1C = gameObj.gameChoices[0];
    var p2C = gameObj.gameChoices[1];
    if(player === "Player 1"){
        winner = gameObj.playerOne;
        loser = gameObj.playerTwo;
        wp = p1C;
        lp = p2C;
        gameObj.p1Record[0]++;
        gameObj.p2Record[1]++;
    }else if(player === "Player 2"){
        loser = gameObj.playerOne;
        winner = gameObj.playerTwo; 
        wp = p2C;
        lp = p1C;
        gameObj.p1Record[1]++;
        gameObj.p2Record[0]++;
    }
    gameCol.append(`<h2>${winner} Wins!</h2>`);
    gameCol.append(`<h2>${winner} played: ${wp}</h2>`);
    gameCol.append(`<h2>${loser} played: ${lp}</h2>`);
    betweenGames(gameObj);
}

function tieGame(gameObj){
    gameCol.append(`<h2>Tie!</h2>`);
    gameCol.append(`<h2>You Both picked: ${gameObj.gameChoices[0]}</h2>`);
    betweenGames(gameObj);
}

function betweenGames(gameObj){
    gameGoing = false;
    gameObj.gameChoices[0] = "";
    gameObj.gameChoices[1] = "";
    gameCol.append(`<h2>All Time:</h2>`);
    gameCol.append(`<h2>${gameObj.playerOne}'s Record: ${gameObj.p1Record[0]} - ${gameObj.p1Record[1]}</h2>`);
    gameCol.append(`<h2>${gameObj.playerTwo}'s Record: ${gameObj.p2Record[0]} - ${gameObj.p2Record[1]}</h2>`);
    gameCol.append('<button id="nextGame" class="btn btn-primary">Play Again</button>');
    
    $('#nextGame').click(function(){
        startGame(gameObj);
    });
}

function newChoiceWindow(playerNum, gameObj){
    console.log(playerNum);
    var location = 0;
    var newDiv = $('<div>');
    newDiv.append('<h4 id="rock" class="gameChoice" >Rock</h5>');
    newDiv.append('<h4 id="paper" class="gameChoice" >Paper</h5>');
    newDiv.append('<h4 id="scissor" class="gameChoice" >Scissor</h5>');
    newDiv.append('<button id="choiceBut" class="btn btn-secondary">Submit Choice</button>');

    if(playerNum === "Player 1"){        
        newDiv.prepend(`<h3>${gameObj.playerOne}'s Choice</h3>`); 
        gameCol.append(newDiv);  
        location = 0;             
    }else if(playerNum === "Player 2"){
        newDiv.prepend(`<h3>${gameObj.playerTwo}'s Choice</h3>`);
        gameCol.append(newDiv);
        location = 1;            
    }

    $('.gameChoice').click(function(){
        $('.gameChoice').attr('checked', false);
        $('.gameChoice').removeClass('highlight');
        $(this).attr('checked', true);
        $(this).addClass('highlight');
    });

    $('#choiceBut').click( function(){
        var choiceArr = [$('#rock'),$('#paper'),$('#scissor'),];
        var checkCount = 0;
        var choice = "";
        for(i in choiceArr){
            var cur = choiceArr[i];
            if(cur.attr('checked')=="checked"){
               console.log(cur[0].innerHTML);
               choice =  cur[0].innerHTML;

            }else{
                checkCount++;
            }            
        }
        if(checkCount>2){
            console.log("EMPTY");
            gameCol.append("<h2 style='color:red;'>Please Make a Selection</h2>");
        }else{            
            console.log("you chose: ", choice);
            gameObj.gameChoices[location] = choice;
            if(playerNum === "Player 1"){ 
               turnTwo(gameObj); 
            }else{
                decideWinner(gameObj);
            }
        }
    });
    
}

function decideWinner(gameObj){
    gameCol.empty();
    var p1Choice = gameObj.gameChoices[0];
    var p2Choice = gameObj.gameChoices[1];
    console.log(p1Choice);
    console.log(p2Choice);

    if(p1Choice === p2Choice){
        tieGame(gameObj);
    }else{
        if(p1Choice==="Rock"){
            if(p2Choice==="Paper"){
                winner("Player 2", gameObj);
            }else if(p2Choice==="Scissor"){
                winner("Player 1", gameObj);
            }
        } else if(p1Choice==="Paper"){
            if(p2Choice==="Rock"){
                winner("Player 1", gameObj);
            }else if(p2Choice==="Scissor"){
                winner("Player 2", gameObj);
            }
        } else if(p1Choice==="Scissor"){
            if(p2Choice==="Paper"){
                winner("Player 1", gameObj);
            }else if(p2Choice==="Rock"){
                winner("Player 2", gameObj);
            }
        }
    }
    
}