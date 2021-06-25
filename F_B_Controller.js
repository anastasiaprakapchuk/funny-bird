"use strict";
//controller

//класс <контроллер>
	
    class GameController{
        constructor(){
          this.myModel = null; // с какой моделью работаем
          this.myGame=null;// внутри какого элемента наша вёрстка
          this.bird=null;
          this.worm=null;
          this.buffet=null;
          this.timer=null;
        }

        startGame(model,game) {
            this.myModel=model;
            this.myGame=game;
            var myModel=this.myModel;
            if(gameRun){
            document.addEventListener('keydown', function(EO){EO=EO||window.event;
                                                              var codeButton=EO.keyCode;
                                                              keydown(codeButton);});
            this.myGame.addEventListener('click', function(EO){EO=EO||window.event;
                                                              click();});
            this.myGame.addEventListener('touchmove', function(EO){EO=EO||window.event;
                                                            EO.preventDefault();});
            }                                              
            function keydown(codeButton){
            	if(model.bird){
            		model.bird.startFly(codeButton);
            	}
            }

            function click(){
            model.bird.startFly();
            }

            //-----------------------------------------------------------------
 //обработка нажатия кнопок для message Lose
   var questionLoseFon=document.getElementById('questionLoseFon');
   var loseBtn=document.getElementById('yesAndNoLose');
   
   var loseYeses=loseBtn.getElementsByClassName('yesBtn');
   var loseYes= loseYeses[0];
   var loseNos=loseBtn.getElementsByClassName('noBtn');
   var loseNo= loseNos[0];
   questionLoseFon.addEventListener('click', stopPropagation);

   loseYes.addEventListener('click', function(EO){EO=EO||window.event;
                                                              clickLoseYes();});
   questionLoseFon.addEventListener('click', stopPropagation);

   loseNo.addEventListener('click', function(EO){EO=EO||window.event;
                                                              clickLoseNo();});

   function clickLoseYes(){
        vibro(false);        
        switchToMainPage();
   }

   function clickLoseNo(){
   	    vibro(false);
        switchToMainPage();
   }

    function stopPropagation(EO) {
      if ( EO.stopPropagation )
         EO.stopPropagation();
      else
         EO.cancelBubble=true;
    }
            
//-----------------------------------------------------------------   

 //обработка нажатия кнопок для message Win
   var questionWinFon=document.getElementById('questionWinFon');
   var winBtn=document.getElementById('yesAndNoWin');
   
   var winYeses=winBtn.getElementsByClassName('yesBtn');
   var winYes= winYeses[0];
   var winNos=winBtn.getElementsByClassName('noBtn');
   var winNo= winNos[0];
   questionWinFon.addEventListener('click', stopPropagation);

   winYes.addEventListener('click', function(EO){EO=EO||window.event;
                                                              clickWinYes();});
   questionWinFon.addEventListener('click', stopPropagation);

   winNo.addEventListener('click', function(EO){EO=EO||window.event;
                                                              clickLoseNo();});

   function clickWinYes(){
        vibro(false);        
        safeResult();
   }

   function clickWinNo(){
   	    vibro(false);
        switchToMainPage();
   }
            
//-----------------------------------------------------------------

 //обработка нажатия кнопок для message Stop
   var questionStopFon=document.getElementById('questionStopFon');
   var stopBtn=document.getElementById('yesAndNoStop');
   
   var stopYeses=stopBtn.getElementsByClassName('yesBtn');
   var stopYes= stopYeses[0];
   var stopNos=stopBtn.getElementsByClassName('noBtn');
   var stopNo= stopNos[0];

   var saveText=document.getElementById('saveText');//
   var saveBtn=document.getElementById('save');
   var saveYeses=saveBtn.getElementsByClassName('yesBtn');
   var saveYes= saveYeses[0];

   questionStopFon.addEventListener('click', stopPropagation);

   stopYes.addEventListener('click', function(EO){EO=EO||window.event;
                                                              clickStopYes();});
   questionStopFon.addEventListener('click', stopPropagation);

   stopNo.addEventListener('click', function(EO){EO=EO||window.event;
                                                              clickStopNo();});
   saveText.addEventListener('keydown', stopPropagation);
   saveText.addEventListener('click', stopPropagation);

   saveYes.addEventListener('click', function(EO){EO=EO||window.event;
                                                              clickSave();});

   function clickStopYes(){
        vibro(false);        
        safeResult();
   }

   function clickStopNo(){
   	    vibro(false);
        switchToMainPage();
   }

   var nicknameHash={};
   
   function clickSave(){
        gameRun=false;
        switchToMainPage();
        var nick=document.getElementById('nick');//
        var nickname=nick.value;
        nicknameHash['name']=nickname;
        nicknameHash['nuts']=model.counter.countNut;
        nicknameHash['worms']=model.counter.countWorm;
        nicknameHash['time']=model.timer.isSecond-model.timer.count; 
        isNick=nicknameHash;
        console.log(nicknameHash);       
   }
   
   function safeResult(){
    	var noneText;//заменяемый контент
         var stopText=document.getElementById('stopText');//
         if(stopText){
         	noneText=stopText;
         }else{
         	var winText=document.getElementById('winText');//
         	noneText=winText;
         }         
        noneText.style.display='none';
        var saveText=document.getElementById('saveText');//
        saveText.style.display='block';
    }

        }

    }
