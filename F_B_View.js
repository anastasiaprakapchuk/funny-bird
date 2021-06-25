"use strict";
 // view

 class GameView {
 	constructor(){
        this.myModel = null; // с какой моделью работаем
        this.myGame=null;// внутри какого элемента наша вёрстка
        this.bird=null;
        this.wormsBuffet=null;
        this.buffet=null;
        this.timer=null;
        this.counter=null;
    }
        
        startGame(model,game) {
            this.myModel=model;
            this.myGame=game;
            this.bird.startGame(this.myModel.bird,this.myGame);
            this.buffet.startGame(this.myModel.buffet,this.myGame);
            this.wormsBuffet.startGame(this.myModel.wormsBuffet,this.myGame);
            this.timer.startGame(this.myModel.timer,this.myGame);
            this.counter.startGame(this.myModel.counter,this.myGame);            
        }

        createObjects(BirdView,WormView,BuffetView,Timer,NutView,NutRottenView,NutFrozenView,NutPepperView,regales){
          this.bird=new BirdView();
          this.wormsBuffet=new WormsBuffetView();
          this.wormsBuffet.createBuffet(regales);
          this.buffet=new BuffetView();
          this.buffet.createBuffet(regales,NutView,NutRottenView,NutFrozenView,NutPepperView);
          this.timer=new TimerView();
          this.counter=new CounterView();          
        }

        destroyObjects(){
          this.buffet.destroyBuffet();
          this.wormsBuffet.destroyBuffet();
          this.bird=null;
          this.wormsBuffet=null;
          this.buffet=null;
          this.timer=null;
          this.counter=null;
          
        }

        buildGraphic(W,H){       	
            //игровое пространство
        	var WmyGame=W;//ширина блока id=game
        	var HmyGame=H;//высота блока id=game

        	//центральная точка игрового пространства
        	var cxGame=WmyGame/2;//ширина блока id=game
        	var cyGame=HmyGame/2;//высота блока id=game
          
        	//задаем размеры блоку id=game            
            this.myGame.style.width = WmyGame+'px';
            this.myGame.style.height = HmyGame+'px';

            //адаптируем размер под размеры экрана
            if(WmyGame>=HmyGame){
              var r=0.25*HmyGame;
              var scale=0.7;  //меняем            
            }else {
              if(WmyGame>=700){
              	var r=0.25*WmyGame;
              var scale=0.7;
              }else if(WmyGame>=600&&WmyGame<700){
              	var r=0.25*WmyGame;
              	var scale=0.7;//меняем
              }else if(WmyGame>=500&&WmyGame<600){
              	var r=0.3*WmyGame;
              	var scale=0.7;
              }else if(WmyGame>=400&&WmyGame<500){
              	var r=0.3*WmyGame;
              	var scale=0.6;
              }else if(WmyGame>=300&&WmyGame<400){
              	var r=0.4*WmyGame;
              	var scale=0.6;
              }else if(WmyGame<300){
              	var r=0.4*WmyGame;
              	var scale=0.55;
              }                  
            }
                       
            //строим svg-полотно
            var svgNew=document.createElementNS("http://www.w3.org/2000/svg",'svg');
            this.myGame.appendChild(svgNew);
            svgNew.setAttribute('display','block');
            svgNew.setAttribute('width',WmyGame);
            svgNew.setAttribute('height',HmyGame);

            //---------------WORMBUFFET----------------------- 
            //строим стол для угощений с червячками пока невидимыми
            this.wormsBuffet.buildGraphic(WmyGame,HmyGame,r,scale,svgNew);//они не будут отображаться, т.к. заключены в тег <defs>            

            //-------------------------------------------

            //---------------BUFFET-----------------------
            //строим стол для угощений
            this.buffet.buildGraphic(WmyGame,HmyGame,r,scale,svgNew);
            
            //------------------------------------------------------
            
            //---------------BIRD----------------------- 
            //строим птичку - размер птички меняем в зависмости от ширины экрана            
            this.bird.buildGraphic(WmyGame,HmyGame,svgNew,r);
            
            //------------------------------------------------------

            //---------------COUNTER--------------------- 
            this.counter.buildGraphic(WmyGame,HmyGame,svgNew);


            //---------------TIMER----------------------- 
            //рисуем таймер
            this.timer.buildGraphic(WmyGame,HmyGame,svgNew,r);//           
            
            //-------------------------------------------
        }

        stopGame(){
        if(this.myModel.lose){
        	var messageFon=document.getElementById('questionLoseFon');        	
        	messageFon.style.display='flex';        	
        }else if(!this.myModel.timer.run){
        	var messageFon=document.getElementById('questionStopFon');        	
        	messageFon.style.display='flex';        	
        }else if(this.myModel.win){
        	var messageFon=document.getElementById('questionWinFon');        	
        	messageFon.style.display='flex';        	
        }
        }

        update() {       
        	this.buffet.update();
            this.wormsBuffet.update();
            this.timer.update();
            this.counter.update();                   	
        	this.bird.update();            
        }

    }
//---------------------------------------------------------------------------------------------------------
 //класс <птичка>
        class BirdView{
            constructor(){
              this.myModel = null; // с какой моделью работаем
              this.myGame=null;// внутри какого элемента наша вёрстка
              this.elem=null;//
              this.cXB= undefined; 
              this.cYB= undefined;
              this.wing=null;
              this.cXWing=undefined;
              this.leftLeg=null;
              this.rightLeg=null;
            }

            startGame(BirdModel,game) {
            this.myModel=BirdModel;
            this.myGame=game;
            }

            buildGraphic(WmyGame,HmyGame,svgNew,buffetRadius){
            var cXB=WmyGame/2; 	
            this.cXB= cXB;  
            var cYB=HmyGame/2; 	
            this.cYB= cYB;

            var g1=document.createElementNS("http://www.w3.org/2000/svg",'g');
            svgNew.appendChild(g1);
            g1.setAttribute("id",'birdElem');
            this.elem=g1;

            var g=document.createElementNS("http://www.w3.org/2000/svg",'g');
            g1.appendChild(g);
            g.setAttribute("id",'bird');
            
        	var path1=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path1);
            path1.setAttribute("d","M45.7,19.5C45.7,19.5,45.7,19.5,45.7,19.5c0.3-5.7-3.1-10.9-8.2-12c-5.5-1.2-11.1,2.6-12.8,8.6c0,0,0,0,0,0l-1.1,3.5c0,0,0,0,0,0l0,0l-0.2,0.7l-0.8,2.5c0,0,0,0,0,0c0,0-5.5,17.8-5.5,17.8l-0.6,1.9l-0.4,1.3c0,0,0.3-0.2,0.7-0.5c0,0.2,0.1,0.5,0.1,0.8c0,0.1,0,0.2,0.1,0.3c0,0.1,0,0.1,0,0.2c0,0.1,0,0.2,0.1,0.3c0,0.1,0,0.1,0,0.2c0,0.1,0,0.2,0.1,0.3c0,0.1,0,0.3,0,0.4c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1c0,0.1,0,0.2-0.1,0.2c0,0,0,0-0.1,0l-0.3,0.9c0,0,0,0.1,0,0.1c0.3,0.1,0.6,0.1,0.8,0.1c0.9,0.1,1.7,0.3,2.6,0.3c9.8,0.9,16.7-3.1,20.5-6.2c2.3-1.9,3.4-3.4,3.5-3.4C47.2,34.9,49.1,27.1,45.7,19.5z M18.3,39.7C18.3,39.7,18.3,39.7,18.3,39.7C18.3,39.7,18.3,39.7,18.3,39.7L18.3,39.7z");
            path1.setAttribute("class","st54");

            var path3=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path3);
            path3.setAttribute("d","M6.7,44.7l1.4,1.4c1,1,2.3,1.5,3.7,1.4l9.2,0.2c0.2-1.1-0.3-2.1-1.8-3L6.7,44.7z");
            path3.setAttribute("class","st56");

            var path5=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path5);
            path5.setAttribute("d","M17.8,42.3L17.8,42.3L0,41.5c1.4,2,3.7,3.2,6.2,3.2l0.5,0l12.6,0C19,43.1,17.8,42.3,17.8,42.3z");
            path5.setAttribute("class","st55");

            var path7=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path7);
            path7.setAttribute("d","M17.2,46.3L17.2,46.3C17.2,46.3,17.2,46.3,17.2,46.3C17.2,46.3,17.2,46.3,17.2,46.3L17.2,46.3z");
            path7.setAttribute("class","st56");

            var path9=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path9);
            path9.setAttribute("d","M19,41.3L19,41.3l-0.4,1c0,0,0,0,0,0C18.7,41.9,18.9,41.6,19,41.3z");
            path9.setAttribute("class","st55");

            var path10=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path10);
            path10.setAttribute("d","M32.2,20.8c-1.7-2.4-8.6-1.1-8.6-1.1l0,0l-0.2,0.7l-0.8,2.5c0,0,0,0,0,0c0,0-5.5,17.8-5.5,17.8l-0.6,1.9l-0.4,1.3c0,0,0.4-0.3,1.1-0.8l0,0l0,0c0.3-0.2,0.6-0.4,0.9-0.7c0,0,0,0,0,0l0.1,0c0.3-0.2,0.7-0.5,1-0.8c0.9-0.7,1.9-1.5,3-2.5c4-3.4,8.7-8.1,10.3-12.4C33.4,24.5,33.4,22.5,32.2,20.8z M18.3,39.7L18.3,39.7C18.3,39.7,18.3,39.7,18.3,39.7C18.3,39.7,18.3,39.7,18.3,39.7z M30.6,20.4");
            path10.setAttribute("class","st56");
            path10.setAttribute("id","wing");
            this.wing=path10;

            var path11=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path11);
            path11.setAttribute("d","M33.5,10c-1.2-0.2-2.3,0.6-2.5,1.7c-0.2,1.2,0.6,2.3,1.7,2.5s2.3-0.6,2.5-1.8C35.4,11.3,34.7,10.2,33.5,10zM32.9,13.6c-0.8-0.1-1.4-0.9-1.2-1.7c0.1-0.8,0.9-1.4,1.7-1.2c0.8,0.1,1.4,0.9,1.2,1.7C34.5,13.2,33.7,13.8,32.9,13.6z");
            path11.setAttribute("class","st57");

            var path12=document.createElementNS("http://www.w3.org/2000/svg",'circle');
            g.appendChild(path12);
            path12.setAttribute("cx",35);
            path12.setAttribute("cy",14);
            path12.setAttribute("r",3);
            path12.setAttribute("class","st56");

            var path13=document.createElementNS("http://www.w3.org/2000/svg",'circle');
            g.appendChild(path13);
            path13.setAttribute("cx",33);
            path13.setAttribute("cy",14);
            path13.setAttribute("r",0.5);
            path13.setAttribute("class","st58");

            var path14=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path14);
            path14.setAttribute("d","M33.8,8c0.2,0.1,3.3,0,3.3,0l-1.7-11L33.8,8z");
            path14.setAttribute("class","st56");
            path14.setAttribute("id","beak");

            var path15=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path15);
            path15.setAttribute("d","M31.3,53.4c0-0.1,0.1-0.2,0.1-0.3c1.3-3.5,1-7.1,0.2-10.3c-0.2-0.9-1.4,0.7-1.3,1.3c0.6,2.3,1.1,5.4,0.2,8c-0.1,0.4-0.3,1-0.5,1.5c0,0,1.9,0.4,3.1,0.1C34,53.7,32.1,53.5,31.3,53.4z");
            path15.setAttribute("class","st42");
            path15.setAttribute("id","leftLeg");
            this.leftLeg=path15;

            var path16=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path16);
            path16.setAttribute("d","M36.4,52c0-0.1,0.1-0.1,0.1-0.2c1.2-3.1,0.9-6.4,0.2-9.3c-0.2-0.8-1.3,0.6-1.1,1.2c0.5,2.1,1,4.8,0.2,7.2c-0.1,0.4-0.3,0.9-0.5,1.3l0,0l0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,1.6,0.4,2.7,0.2C38.7,52.3,37.1,52.1,36.4,52z");
            path16.setAttribute("class","st42");
            path16.setAttribute("id","rightLeg");
            this.rightLeg=path16;

            //адаптируем размер птички под размеры экрана
            if(WmyGame>=HmyGame){
              var sCB=2.5;         
            }else {              
              if(WmyGame>=700){
              var sCB=2.5*0.8;
              }else if(WmyGame>=600&&WmyGame<700){
              	var sCB=2.5*0.6;
              }else if(WmyGame>=500&&WmyGame<600){
              	var sCB=2.5*0.55;
              }else if(WmyGame>=400&&WmyGame<500){
              	var sCB=2.5*0.6;
              }else if(WmyGame>=300&&WmyGame<400){
              	var sCB=2.5*0.55;
              }else if(WmyGame<300){
              	var sCB=2.5*0.5;
              }                  
            }

            var beak=document.getElementById('beak');
            var posBeak=beak.getBoundingClientRect();
             
            var dB=(posBeak.left+posBeak.width/2)*sCB;
            var xB=cXB-dB;            
            var yB=cYB+buffetRadius*1.3;//начальная координата птички по y
             
            var bird=document.getElementById('bird');           
            bird.setAttribute("transform",'translate('+xB+' '+yB+') scale('+sCB+')');

            var wing=document.getElementById('wing');
            var posWing=beak.getBoundingClientRect();
            var cXWing=posWing.width;
            this.cXWing=cXWing;
            }

            update() {
            this.elem.setAttribute("transform",'translate('+this.myModel.posX+' '+this.myModel.posY +')rotate('+this.myModel.angle+' '+this.cXB+' '+this.cYB+')');
            this.wing.setAttribute("transform",'rotate('+this.myModel.angleWing+' '+this.cXWing+' '+this.cXWing+')');
            this.leftLeg.setAttribute("transform",'translate('+this.myModel.xLegL+' '+0+')');
            this.rightLeg.setAttribute("transform",'translate('+this.myModel.xLegR+' '+0+')');
        }
        } 

//---------------------------------------------------------------------------------
        //класс <buffet> воображаемый шведский круглый стол для птички:)- окружность,  по которой будут крутиться вкусности
        class BuffetView{
            constructor(){
              this.myModel = null; // с какой моделью работаем
              this.myGame=null;// внутри какого элемента наша вёрстка
              this.radius=undefined;//радиус стола
              this.regalesMassiv=[];//массив угощений на столе - объекты
              this.nut=null;//
              this.nutRotten=null;//
              this.nutFrozen=null;//
              this.nutPepper=null;//
              this.useNuts=[];//тэги <use> с орехами - не путать с объектами
              this.elem=null;
              this.cXB=undefined;
              this.cYB=undefined;
            }

            createBuffet(regales,NutView,NutRottenView,NutFrozenView,NutPepperView){
                for(var i=0;i<regales.length;i++){
                    if(regales[i]===0){
                      this.regalesMassiv[i]=new NutView();
                    } else if(regales[i]===1){
                      this.regalesMassiv[i]=new NutRottenView();
                    }else if(regales[i]===2){
                      this.regalesMassiv[i]=new NutFrozenView();
                    }else if(regales[i]===3){
                      this.regalesMassiv[i]=new NutPepperView();
                    }
                }
              this.nut=new NutView();
              this.nutRotten=new NutRottenView();
              this.nutFrozen=new NutFrozenView();
              this.nutPepper=new NutPepperView();
            }
            
            destroyBuffet(){              
                for(var i=0;i<this.regalesMassiv.length;i++){                    
                      this.regalesMassiv[i]=null;
                      this.useNuts[i]=null;                    
                }
              this.nut=null;
              this.nutRotten=null;
              this.nutFrozen=null;
              this.nutPepper=null;
            }

            startGame(BuffetModel,game) {
            this.myModel=BuffetModel;
            this.myGame=game;
            }

            buildGraphic(WmyGame,HmyGame,r,scaleNut,svgNew){
            //буфет
            var cxBuffet=WmyGame/2;
            var cyBuffet=HmyGame/2;
            this.cXB=cxBuffet;
            this.cYB=cyBuffet;
            this.radius=r;              
            var x=cxBuffet;
            var y=cyBuffet-r;

            var gBuffet=document.createElementNS("http://www.w3.org/2000/svg",'g');
            svgNew.appendChild(gBuffet);
            gBuffet.setAttribute('id','buffet');
            this.elem=gBuffet;

            //рисуем стол для угощений       	            
            var a=0;
            var useNuts=[];
            var useNotEdible=[];
            //рисуем орешки 1 раз - далее usаем куда нужно
            this.nut.buildGraphic(WmyGame,HmyGame,svgNew);
            var wNut=this.nut.elem.getBoundingClientRect().width;
               
            this.nutRotten.buildGraphic(WmyGame,HmyGame,svgNew);
            var wNutRotten=this.nutRotten.elem.getBoundingClientRect().width;
            
            this.nutFrozen.buildGraphic(WmyGame,HmyGame,svgNew);
            var wNutFrozen=this.nutFrozen.elem.getBoundingClientRect().width;

            this.nutPepper.buildGraphic(WmyGame,HmyGame,svgNew);
            var wNutPepper=this.nutPepper.elem.getBoundingClientRect().width;

            //раскладываем угощения
            var j=0;
            for(var i=0;i<this.regalesMassiv.length;i++){
                   
                 	useNuts[j]=document.createElementNS("http://www.w3.org/2000/svg",'use');
                    gBuffet.appendChild(useNuts[j]);
                    useNotEdible[j]=document.createElementNS("http://www.w3.org/2000/svg",'use');
                    gBuffet.appendChild(useNotEdible[j]);

                    if(this.regalesMassiv[i] instanceof NutView){
                    useNuts[j].setAttribute("href",'#nut');
                    useNotEdible[j].setAttribute("href",'#notNutEdible');
                    var wN=wNut;
                    } else if(this.regalesMassiv[i] instanceof NutRottenView){
                    useNuts[j].setAttribute("href",'#nutRotten');
                    useNotEdible[j].setAttribute("href",'#notNutRottenEdible');
                    var wN=wNutRotten;
      
                    }else if(this.regalesMassiv[i] instanceof NutFrozenView){
                    useNuts[j].setAttribute("href",'#nutFrozen');
                    useNotEdible[j].setAttribute("href",'#notNutFrozenEdible');
                    var wN=wNutFrozen;	
                    }else if(this.regalesMassiv[i] instanceof NutPepperView){
                    useNuts[j].setAttribute("href",'#nutPepper');
                    useNotEdible[j].setAttribute("href",'#notNutPepperEdible');
                    var wN=wNutPepper;		
                    }
                    useNuts[j].setAttribute("id",j);
                    useNuts[j].setAttribute("x",(x-wN/2)/scaleNut);
                    useNotEdible[j].setAttribute("x",(x-wN/2)/scaleNut);
                    useNuts[j].setAttribute("y",y/scaleNut);
                    useNotEdible[j].setAttribute("y",y/scaleNut);
                 	useNuts[j].setAttribute("transform",'rotate('+a+' '+cxBuffet+' '+cyBuffet+') scale('+scaleNut+')');
                 	useNotEdible[j].setAttribute("transform",'rotate('+a+' '+cxBuffet+' '+cyBuffet+')scale('+scaleNut+')');
                    a+=12;
                    j++;
                 }
            this.useNuts=useNuts;            
            }
                
            update() {          
            this.elem.setAttribute("transform",'rotate('+this.myModel.angle+' '+this.cXB+' '+this.cYB+')');            
            }
        }
       
//---------------------------------------------------------------------------------
        // 0
        class NutView { // 0-----орех 
            constructor() {
              this.myModel = null; // с какой моделью работаем
              this.myGame=null;// внутри какого элемента наша вёрстка
              this.elem=null;
              this.edible=null;      
            }

            startGame(NutModel,game) {
            this.myModel=NutModel;
            this.myGame=game;
            }

            buildGraphic(W,H,svgNew){
            var defs1=document.createElementNS("http://www.w3.org/2000/svg",'defs');
            svgNew.appendChild(defs1);

            var g=document.createElementNS("http://www.w3.org/2000/svg",'g');
            defs1.appendChild(g);
            g.setAttribute("id","nut");
            this.elem=g;

            var g1=document.createElementNS("http://www.w3.org/2000/svg",'g');
            g.appendChild(g1);
            g1.setAttribute("id","edible");              

        	var path1=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g1.appendChild(path1);
            path1.setAttribute("d","M18.2,0c12.5,10.9,28.5,51.5-0.4,51.3C-11,51,5.6,10.7,18.2,0z");
            path1.setAttribute("class","st0");

            var path2=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g1.appendChild(path2);
            path2.setAttribute("d","M18.2,0C23.3,4.4,29,13.8,32,23.4c-3.4,3.9-8.4,6.3-13.9,6.2c-5.6,0-10.5-2.6-13.9-6.5C7.3,13.6,13.1,4.3,18.2,0z");
            path2.setAttribute("class","st1");

            var path3=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g1.appendChild(path3);
            path3.setAttribute("d","M18.2,0c0.1,0.1,0.3,0.2,0.4,0.3c0,7.5,0,17.4-0.1,28.1c-0.1,8.4-0.1,16.2-0.2,22.8c-0.1,0-0.3,0-0.4,0c-0.1,0-0.3,0-0.4,0c0-6.6,0-14.4,0.1-22.8c0.1-10.8,0.2-20.6,0.3-28.1C18,0.2,18.1,0.1,18.2,0L18.2,0z M19.8,1.5c3.2,15.2,5.3,33.5,4.5,49c0.5-0.1,0.9-0.3,1.4-0.5c1.3-14.1-1.2-32.2-5-47.5C20.4,2.2,20.1,1.8,19.8,1.5L19.8,1.5z M23.4,5.9c4.5,12.4,7.2,28.1,4,38.8c5.2-8.4,2.6-23.6-2.3-36.2C24.6,7.6,24,6.7,23.4,5.9L23.4,5.9z M11.5,50.4c-0.6-15.5,1.8-33.8,5.2-48.9c-0.3,0.3-0.6,0.6-0.9,1c-4,15.2-6.7,33.3-5.6,47.5C10.6,50.1,11,50.2,11.5,50.4L11.5,50.4z M11.2,8.5C6.1,21,3.3,36.1,8.4,44.6C5.4,33.8,8.3,18.2,13,5.9C12.4,6.7,11.8,7.6,11.2,8.5z");
            path3.setAttribute("class","st2");

            var path4=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path4);
            path4.setAttribute("d","M35.7,31c1.5,12-2.5,22.2-17.8,22.1C2.6,52.9-1.3,42.7,0.4,30.7L35.7,31z");
            path4.setAttribute("class","st3");

            var path5=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path5);
            path5.setAttribute("d","M35.7,31c0.3,2.8,0.4,5.5,0.1,7.9c-2.5,5.4-8,9-17.9,8.9c-9.8-0.1-15.3-3.7-17.7-9.2c-0.3-2.5-0.2-5.2,0.2-7.9L35.7,31z");
            path5.setAttribute("class","st4");

            var defs2=document.createElementNS("http://www.w3.org/2000/svg",'defs');
            svgNew.appendChild(defs2);

            var g2=document.createElementNS("http://www.w3.org/2000/svg",'g');
            defs2.appendChild(g2);
            g2.setAttribute("id","notNutEdible");
           
            var path6=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g2.appendChild(path6);
            path6.setAttribute("d","M35.7,31c1.5,12-2.5,22.2-17.8,22.1C2.6,52.9-1.3,42.7,0.4,30.7L35.7,31z");
            path6.setAttribute("class","st3");

            var path7=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g2.appendChild(path7);
            path7.setAttribute("d","M35.7,31c0.3,2.8,0.4,5.5,0.1,7.9c-2.5,5.4-8,9-17.9,8.9c-9.8-0.1-15.3-3.7-17.7-9.2c-0.3-2.5-0.2-5.2,0.2-7.9L35.7,31z");
            path7.setAttribute("class","st4");                 
            }

            update(id) {
            clickSound1();
            vibro(false);
            var elem=document.getElementById(id);
            elem.setAttribute('opacity','0');            
            }
        }
//---------------------------------------------------------------------------------
        // 1
        class NutRottenView { // 1------гнилой орех 
            constructor() {
              this.myModel = null; // с какой моделью работаем
              this.myGame=null;// внутри какого элемента наша вёрстка 
              this.elem=null;
              this.edible=null;     
            }

            startGame(NutRottenModel,game) {
            this.myModel=NutRottenModel;
            this.myGame=game;
            }

            buildGraphic(W,H,svgNew){
            var defs=document.createElementNS("http://www.w3.org/2000/svg",'defs');
            svgNew.appendChild(defs);

            var g=document.createElementNS("http://www.w3.org/2000/svg",'g');
            defs.appendChild(g);
            g.setAttribute("id","nutRotten");
            this.elem=g;

            var g1=document.createElementNS("http://www.w3.org/2000/svg",'g');
            g.appendChild(g1);
            g1.setAttribute("id","nutRottenEdible");
            this.edible=g1; 

        	var path1=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g1.appendChild(path1);
            path1.setAttribute("d","M18.2,0c12.5,10.9,28.5,51.5-0.4,51.3C-11,51,5.6,10.7,18.2,0z");
            path1.setAttribute("class","st22");

            var path2=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g1.appendChild(path2);
            path2.setAttribute("d","M18.2,0C23.3,4.4,29,13.8,32,23.4c-3.4,3.9-8.4,6.3-13.9,6.2c-5.6,0-10.5-2.6-13.9-6.5C7.3,13.6,13.1,4.3,18.2,0z");
            path2.setAttribute("class","st23");

            var path3=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g1.appendChild(path3);
            path3.setAttribute("d","M18.2,0c0.1,0.1,0.3,0.2,0.4,0.3c0,7.5,0,17.4-0.1,28.1c-0.1,8.4-0.1,16.2-0.2,22.8c-0.1,0-0.3,0-0.4,0c-0.1,0-0.3,0-0.4,0c0-6.6,0-14.4,0.1-22.8c0.1-10.8,0.2-20.6,0.3-28.1C18,0.2,18.1,0.1,18.2,0L18.2,0z M19.8,1.5c3.2,15.2,5.3,33.5,4.5,49c0.5-0.1,0.9-0.3,1.4-0.5c1.3-14.1-1.2-32.2-5-47.5C20.4,2.2,20.1,1.8,19.8,1.5L19.8,1.5z M23.4,5.9c4.5,12.4,7.2,28.1,4,38.8c5.2-8.4,2.6-23.6-2.3-36.2C24.6,7.6,24,6.7,23.4,5.9L23.4,5.9z M11.5,50.4c-0.6-15.5,1.8-33.8,5.2-48.9c-0.3,0.3-0.6,0.6-0.9,1c-4,15.2-6.7,33.3-5.6,47.5C10.6,50.1,11,50.2,11.5,50.4L11.5,50.4z M11.2,8.5C6.1,21,3.3,36.1,8.4,44.6C5.4,33.8,8.3,18.2,13,5.9C12.4,6.7,11.8,7.6,11.2,8.5z");
            path3.setAttribute("class","st21");

            var path4=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path4);
            path4.setAttribute("d","M35.7,31c1.5,12-2.5,22.2-17.8,22.1C2.6,52.9-1.3,42.7,0.4,30.7L35.7,31z");
            path4.setAttribute("class","st24");

            var path5=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path5);
            path5.setAttribute("d","M35.7,31c0.3,2.8,0.4,5.5,0.1,7.9c-2.5,5.4-8,9-17.9,8.9c-9.8-0.1-15.3-3.7-17.7-9.2c-0.3-2.5-0.2-5.2,0.2-7.9L35.7,31z");
            path5.setAttribute("class","st25"); 

            var defs2=document.createElementNS("http://www.w3.org/2000/svg",'defs');
            svgNew.appendChild(defs2);

            var g2=document.createElementNS("http://www.w3.org/2000/svg",'g');
            defs2.appendChild(g2);
            g2.setAttribute("id","notNutRottenEdible");

            var path6=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g2.appendChild(path6);
            path6.setAttribute("d","M35.7,31c1.5,12-2.5,22.2-17.8,22.1C2.6,52.9-1.3,42.7,0.4,30.7L35.7,31z");
            path6.setAttribute("class","st24");

            var path7=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g2.appendChild(path7);
            path7.setAttribute("d","M35.7,31c0.3,2.8,0.4,5.5,0.1,7.9c-2.5,5.4-8,9-17.9,8.9c-9.8-0.1-15.3-3.7-17.7-9.2c-0.3-2.5-0.2-5.2,0.2-7.9L35.7,31z");
            path7.setAttribute("class","st25");                      
            }

            update(id) {
            	clickSound5();
            	vibro(true); 
            }
        }
//---------------------------------------------------------------------------------
        // 2
        class NutFrozenView { // 2------мерзлый орех 
            constructor() {
              this.myModel = null; // с какой моделью работаем
              this.myGame=null;// внутри какого элемента наша вёрстка 
              this.elem=null;
              this.edible=null;     
            }

            startGame(NutFrozenModel,game) {
            this.myModel=NutFrozenModel;
            this.myGame=game;
            }

            buildGraphic(W,H,svgNew){
            var defs=document.createElementNS("http://www.w3.org/2000/svg",'defs');
            svgNew.appendChild(defs);

            var g=document.createElementNS("http://www.w3.org/2000/svg",'g');
            defs.appendChild(g);
            g.setAttribute("id","nutFrozen");
            this.elem=g;

            var g1=document.createElementNS("http://www.w3.org/2000/svg",'g');
            g.appendChild(g1);
            g1.setAttribute("id","nutFrozenEdible");
            this.edible=g1; 

        	var path1=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g1.appendChild(path1);
            path1.setAttribute("d","M18.2,0c12.5,10.9,28.5,51.5-0.4,51.3C-11,51,5.6,10.7,18.2,0z");
            path1.setAttribute("class","st26");

            var path2=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g1.appendChild(path2);
            path2.setAttribute("d","M18.2,0C23.3,4.4,29,13.8,32,23.4c-3.4,3.9-8.4,6.3-13.9,6.2c-5.6,0-10.5-2.6-13.9-6.5C7.3,13.6,13.1,4.3,18.2,0z");
            path2.setAttribute("class","st27");

            var path3=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g1.appendChild(path3);
            path3.setAttribute("d","M18.2,0c0.1,0.1,0.3,0.2,0.4,0.3c0,7.5,0,17.4-0.1,28.1c-0.1,8.4-0.1,16.2-0.2,22.8c-0.1,0-0.3,0-0.4,0c-0.1,0-0.3,0-0.4,0c0-6.6,0-14.4,0.1-22.8c0.1-10.8,0.2-20.6,0.3-28.1C18,0.2,18.1,0.1,18.2,0L18.2,0z M19.8,1.5c3.2,15.2,5.3,33.5,4.5,49c0.5-0.1,0.9-0.3,1.4-0.5c1.3-14.1-1.2-32.2-5-47.5C20.4,2.2,20.1,1.8,19.8,1.5L19.8,1.5z M23.4,5.9c4.5,12.4,7.2,28.1,4,38.8c5.2-8.4,2.6-23.6-2.3-36.2C24.6,7.6,24,6.7,23.4,5.9L23.4,5.9z M11.5,50.4c-0.6-15.5,1.8-33.8,5.2-48.9c-0.3,0.3-0.6,0.6-0.9,1c-4,15.2-6.7,33.3-5.6,47.5C10.6,50.1,11,50.2,11.5,50.4L11.5,50.4z M11.2,8.5C6.1,21,3.3,36.1,8.4,44.6C5.4,33.8,8.3,18.2,13,5.9C12.4,6.7,11.8,7.6,11.2,8.5z");
            path3.setAttribute("class","st28");

            var path4=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path4);
            path4.setAttribute("d","M35.7,31c1.5,12-2.5,22.2-17.8,22.1C2.6,52.9-1.3,42.7,0.4,30.7L35.7,31z");
            path4.setAttribute("class","st29");

            var path5=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path5);
            path5.setAttribute("d","M35.7,31c0.3,2.8,0.4,5.5,0.1,7.9c-2.5,5.4-8,9-17.9,8.9c-9.8-0.1-15.3-3.7-17.7-9.2c-0.3-2.5-0.2-5.2,0.2-7.9L35.7,31z");
            path5.setAttribute("class","st30"); 

            var defs2=document.createElementNS("http://www.w3.org/2000/svg",'defs');
            svgNew.appendChild(defs2);

            var g2=document.createElementNS("http://www.w3.org/2000/svg",'g');
            defs2.appendChild(g2);
            g2.setAttribute("id","notNutFrozenEdible");

            var path6=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g2.appendChild(path6);
            path6.setAttribute("d","M35.7,31c1.5,12-2.5,22.2-17.8,22.1C2.6,52.9-1.3,42.7,0.4,30.7L35.7,31z");
            path6.setAttribute("class","st29");

            var path7=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g2.appendChild(path7);
            path7.setAttribute("d","M35.7,31c0.3,2.8,0.4,5.5,0.1,7.9c-2.5,5.4-8,9-17.9,8.9c-9.8-0.1-15.3-3.7-17.7-9.2c-0.3-2.5-0.2-5.2,0.2-7.9L35.7,31z");
            path7.setAttribute("class","st30");            
            }

            update(id) {
            clickSound3();
            vibro(false);
            var elem=document.getElementById(id);
            elem.setAttribute('opacity','0');
            }
        }
//---------------------------------------------------------------------------------
        // 3
        class NutPepperView{ // 3------гнилой орех - это вкусность
            constructor() {
              this.myModel = null; // с какой моделью работаем
              this.myGame=null;// внутри какого элемента наша вёрстка
              this.elem=null;
              this.edible=null;      
            }

            startGame(NutPepperModel,game) {
            this.myModel=NutPepperModel;
            this.myGame=game;
            }

            buildGraphic(W,H,svgNew){
            var defs=document.createElementNS("http://www.w3.org/2000/svg",'defs');
            svgNew.appendChild(defs);

            var g=document.createElementNS("http://www.w3.org/2000/svg",'g');
            defs.appendChild(g);
            g.setAttribute("id","nutPepper");
            this.elem=g;

            var g1=document.createElementNS("http://www.w3.org/2000/svg",'g');
            g.appendChild(g1);
            g1.setAttribute("id","nutPepperEdible");
            this.edible=g1; 

        	var path1=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g1.appendChild(path1);
            path1.setAttribute("d","M18.2,0c12.5,10.9,28.5,51.5-0.4,51.3C-11,51,5.6,10.7,18.2,0z");
            path1.setAttribute("class","st31");

            var path2=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g1.appendChild(path2);
            path2.setAttribute("d","M18.2,0C23.3,4.4,29,13.8,32,23.4c-3.4,3.9-8.4,6.3-13.9,6.2c-5.6,0-10.5-2.6-13.9-6.5C7.3,13.6,13.1,4.3,18.2,0z");
            path2.setAttribute("class","st32");

            var path3=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g1.appendChild(path3);
            path3.setAttribute("d","M18.2,0c0.1,0.1,0.3,0.2,0.4,0.3c0,7.5,0,17.4-0.1,28.1c-0.1,8.4-0.1,16.2-0.2,22.8c-0.1,0-0.3,0-0.4,0c-0.1,0-0.3,0-0.4,0c0-6.6,0-14.4,0.1-22.8c0.1-10.8,0.2-20.6,0.3-28.1C18,0.2,18.1,0.1,18.2,0L18.2,0z M19.8,1.5c3.2,15.2,5.3,33.5,4.5,49c0.5-0.1,0.9-0.3,1.4-0.5c1.3-14.1-1.2-32.2-5-47.5C20.4,2.2,20.1,1.8,19.8,1.5L19.8,1.5z M23.4,5.9c4.5,12.4,7.2,28.1,4,38.8c5.2-8.4,2.6-23.6-2.3-36.2C24.6,7.6,24,6.7,23.4,5.9L23.4,5.9z M11.5,50.4c-0.6-15.5,1.8-33.8,5.2-48.9c-0.3,0.3-0.6,0.6-0.9,1c-4,15.2-6.7,33.3-5.6,47.5C10.6,50.1,11,50.2,11.5,50.4L11.5,50.4z M11.2,8.5C6.1,21,3.3,36.1,8.4,44.6C5.4,33.8,8.3,18.2,13,5.9C12.4,6.7,11.8,7.6,11.2,8.5z");
            path3.setAttribute("class","st33");

            var path4=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path4);
            path4.setAttribute("d","M35.7,31c1.5,12-2.5,22.2-17.8,22.1C2.6,52.9-1.3,42.7,0.4,30.7L35.7,31z");
            path4.setAttribute("class","st34");

            var path5=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path5);
            path5.setAttribute("d","M35.7,31c0.3,2.8,0.4,5.5,0.1,7.9c-2.5,5.4-8,9-17.9,8.9c-9.8-0.1-15.3-3.7-17.7-9.2c-0.3-2.5-0.2-5.2,0.2-7.9L35.7,31z");
            path5.setAttribute("class","st35");

            var defs2=document.createElementNS("http://www.w3.org/2000/svg",'defs');
            svgNew.appendChild(defs2);

            var g2=document.createElementNS("http://www.w3.org/2000/svg",'g');
            defs2.appendChild(g2);
            g2.setAttribute("id","notNutPepperEdible");

            var path6=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g2.appendChild(path6);
            path6.setAttribute("d","M35.7,31c1.5,12-2.5,22.2-17.8,22.1C2.6,52.9-1.3,42.7,0.4,30.7L35.7,31z");
            path6.setAttribute("class","st34");

            var path7=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g2.appendChild(path7);
            path7.setAttribute("d","M35.7,31c0.3,2.8,0.4,5.5,0.1,7.9c-2.5,5.4-8,9-17.9,8.9c-9.8-0.1-15.3-3.7-17.7-9.2c-0.3-2.5-0.2-5.2,0.2-7.9L35.7,31z");
            path7.setAttribute("class","st35");                        
            }

            update(id) {
            clickSound3();
            vibro(false);
            var elem=document.getElementById(id);
            elem.setAttribute('opacity','0');
            }
        }
//---------------------------------------------------------------------------------


//---------------------------------------------------------------------------------
        //класс <buffet> воображаемый шведский круглый стол для птички:)- окружность,  по которой будут крутиться вкусности
        class WormsBuffetView{
            constructor(){
              this.myModel = null; // с какой моделью работаем
              this.myGame=null;// внутри какого элемента наша вёрстка
              this.radius=undefined;//радиус стола
              this.wormsMassiv=[];//массив угощений на столе - объекты
              this.worm=null;//              
              this.useWorms=[];//тэги <use> с орехами - не путать с объектами
              this.elem=null;
              this.cXB=undefined;
              this.cYB=undefined;
            }

            createBuffet(massiv){
                for(var i=0;i<massiv.length;i++){
                   this.wormsMassiv[i]=new WormView();
                }
              this.worm=new WormView();
            }

            destroyBuffet(massiv){
                for(var i=0;i<this.wormsMassiv.length;i++){
                   this.wormsMassiv[i]=null;
                }
              this.worm=null;
            }
                
            startGame(WormsBuffetModel,game) {
            this.myModel=WormsBuffetModel;
            this.myGame=game;
            for(var i=0;i<this.wormsMassiv.length;i++){
                   this.wormsMassiv[i].startGame(this.myModel.wormsMassiv[i]);
                }
            }

            buildGraphic(WmyGame,HmyGame,r,scaleWorm,svgNew){
            //буфет
            var cxBuffet=WmyGame/2;
            var cyBuffet=HmyGame/2;
            this.cXB=cxBuffet;
            this.cYB=cyBuffet;

            this.radius=r;              
            var x=cxBuffet;
            var y=cyBuffet-r;

            var gBuffet=document.createElementNS("http://www.w3.org/2000/svg",'g');
            svgNew.appendChild(gBuffet);
            gBuffet.setAttribute('id','wormsBuffet');
            this.elem=gBuffet;

            //рисуем стол для угощений       	            
            var a=0;
            var useWorms=[];
            
            //рисуем орешки 1 раз - далее usаем куда нужно
            this.worm.buildGraphic(WmyGame,HmyGame,svgNew);
            var wWorm=this.worm.elem.getBoundingClientRect().width;
            var hWorm=this.worm.elem.getBoundingClientRect().height;
            //раскладываем червячков
            var j=0;
            for(var i=0;i<this.wormsMassiv.length;i++){
                   
                 	useWorms[j]=document.createElementNS("http://www.w3.org/2000/svg",'use');
                    gBuffet.appendChild(useWorms[j]);
                    useWorms[j].setAttribute("href",'#worm');                    	                    
                    useWorms[j].setAttribute("id","0"+j);/////////////
                    useWorms[j].setAttribute("x",(x-wWorm/2)/scaleWorm);                   
                    useWorms[j].setAttribute("y",(y-hWorm/3)/scaleWorm);                   
                 	useWorms[j].setAttribute("transform",'rotate('+a+' '+cxBuffet+' '+cyBuffet+') scale('+scaleWorm+')');
                 	useWorms[j].setAttribute('opacity','0');                	
                    a+=12;
                    j++;
                 }
            this.useWorms=useWorms;
            
            }
                
            update() {           
            this.elem.setAttribute("transform",'rotate('+this.myModel.angle+' '+this.cXB+' '+this.cYB+')');                      
            }

        }
//---------------------------------------------------------------------------------
        //класс <worm> червячек
        class WormView{
            constructor() {
              this.myModel = null; // с какой моделью работаем
              this.myGame=null;// внутри какого элемента наша вёрстка 
              this.elem=null;
              this.svg=null;               
            }

            startGame(WormModel,game) {
            this.myModel=WormModel;
            this.myGame=game;
            }

            buildGraphic(W,H,svgNew){
            this.WG=W;
            this.HG=H;
            var defs=document.createElementNS("http://www.w3.org/2000/svg",'defs');
            svgNew.appendChild(defs);
            this.svg=svgNew;
            
        	var g=document.createElementNS("http://www.w3.org/2000/svg",'g');
            defs.appendChild(g);
            g.setAttribute("id","worm");
            this.elem=g;

        	var path1=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path1);
            path1.setAttribute("d","M20.1,9.9c-1.2-2.2-2.6-4-4.4-5.7c-1.6-1.5-3.5-2.7-5.5-3.7C7.5-0.9,4,0.9,2.9,3.6C2.3,5,2.3,6.6,2.9,8c0.6,1.4,1.7,2.3,3,3c0.1,0.1,0.2,0.1,0.3,0.2c0.7,0.5,1.4,1,2.1,1.6c0.5,0.6,1,1.1,1.4,1.8c0.4,0.8,0.8,1.7,1.1,2.6c0.4,1.5,0.5,3.1,0.6,4.6c0,2.7-0.3,5.4-0.9,8c-0.5,1.7-1.2,3.3-2.1,4.9c-3.2,5.4-7.3,10.6-8.3,16.9c0,0,0,0,0,0C0,52,0,52.3,0,52.7c0,3.1,2.5,5.7,5.7,5.7c2.6,0,4.7-1.7,5.4-4c0,0,0,0,0,0c0-0.1,0-0.1,0-0.2c0-0.1,0.1-0.2,0.1-0.4c0.5-2,1.4-4.4,2.1-5.7c1.7-2.9,3.6-5.6,5.2-8.5c1.8-3.2,2.9-6.6,3.6-10.3C23.2,23,23.2,15.7,20.1,9.9z");
            path1.setAttribute("class","st36");

//----зеленые полоски у червячка----------:
            var path2=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path2);
            path2.setAttribute("d","M8.9,46.7c1.2,0.2,2.4,0.5,3.6,0.7c0.3,0.1,0.7,0.2,1,0.4c1.4-2.4,3-4.7,4.4-7.1c-1.8-1-3.6-2-5.4-3c-0.2-0.1-0.4-0.2-0.6-0.4c-1.2-0.8-2.5-1.5-3.8-2.1c-2,3.3-4.3,6.6-6,10.1C4.4,45.8,6.7,46.2,8.9,46.7z");
            path2.setAttribute("class","st37");

            var path3=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path3);
            path3.setAttribute("d","M18.6,7.5c-0.6,0.2-1.2,0.5-1.8,0.7c-2.3,0.9-4.6,1.9-7,2.8c-0.8,0.3-1.7,0.7-2.5,1c0.4,0.3,0.7,0.6,1,0.9c0.5,0.6,1,1.1,1.4,1.8c0.4,0.8,0.8,1.7,1.1,2.6c0.2,0.6,0.3,1.3,0.4,2c1.1-0.3,2.3-0.6,3.4-1c1.2-0.4,2.3-0.7,3.5-1.1c0.3-0.1,0.6-0.2,0.9-0.3c0.1,0,0.3-0.1,0.4-0.1c0.3-0.1,0.3-0.1,0.1,0c0.6-0.2,1.1-0.3,1.6-0.5c0,0,0.4-0.1,0.5-0.1c0.2,0,0.4-0.1,0.5-0.1c-0.4-2.1-1.1-4.1-2.1-5.9C19.6,9,19.1,8.2,18.6,7.5z");
            path3.setAttribute("class","st37");

            var path4=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path4);
            path4.setAttribute("d","M13.2,30.7c0.3,0.1,0.6,0.2,0.9,0.2c0.2,0,0.3,0.1,0.5,0.1c0.1,0,0.2,0,0.2,0.1c1.2,0.3,2.4,0.6,3.6,1c0.2,0.1,0.4,0.1,0.7,0.2c0.3,0.1,0.3,0.1,0.1,0c0.1,0,0.2,0.1,0.4,0.1c0.5,0.2,1,0.3,1.5,0.4c0.1,0,0.2,0.1,0.3,0.1c0.3-1.2,0.6-2.3,0.8-3.5c0.3-1.7,0.5-3.5,0.6-5.3c-1.5-0.2-3-0.3-4.5-0.3c-2.3-0.1-4.5-0.3-6.8-0.5c0,0,0,0,0,0c-0.1,2.2-0.4,4.4-0.9,6.5c0,0.1-0.1,0.2-0.1,0.3c0.4,0.1,0.8,0.1,1.1,0.2C12.1,30.5,12.6,30.6,13.2,30.7z");
            path4.setAttribute("class","st37");
//----------------------------------------
            
            var path5=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path5);
            path5.setAttribute("d","M12.2,0c0.9-0.1,1.6,0.5,1.6,1.3c0.1,0.9-0.7,2-1.4,2c-0.8,0.1-1.7-0.9-1.7-1.8C10.6,0.7,11.3,0.1,12.2,0z");
            path5.setAttribute("class","st38");

            var path6=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path6);
            path6.setAttribute("d","M2.5,8.9C2.4,7.7,3.3,6.8,4.3,7.1c0.6,0.2,0.9,0.5,1,1.1c0,0.3,0.1,0.5,0,0.8c-0.1,0.9-0.9,1.6-1.6,1.5C3,10.5,2.5,9.8,2.5,8.9z");
            path6.setAttribute("class","st38");

            var path7=document.createElementNS("http://www.w3.org/2000/svg",'path');
            g.appendChild(path7);
            path7.setAttribute("d","M11.2,6c0,0.5,0,0.9-0.2,1.3C10.8,8,10.3,8.6,9.5,8.7C8.7,8.8,7.9,8.6,7.4,7.9c-0.3-0.3-0.5-0.6-0.5-1c0-0.2,0-0.4,0.1-0.5c0.2-0.1,0.3,0,0.4,0.2C7.6,6.8,7.7,7,7.9,7.2c0.4,0.4,0.8,0.7,1.4,0.6c0.6-0.1,0.9-0.3,1-1c0.1-0.6-0.1-1.1-0.3-1.6C9.9,5,9.8,4.8,9.7,4.6C9.6,4.4,9.5,4.2,9.7,4c0.2-0.1,0.4-0.1,0.6,0.1C10.9,4.6,11.1,5.3,11.2,6z");
            path7.setAttribute("class","st38");
            }
                        
            update(n) {
            var elem=document.getElementById('0'+n);
            if(this.myModel.eaten){
               elem.setAttribute('opacity','0');
               clickSound4();
               vibro(false);
            } else if(this.myModel.appear){             	
               elem.setAttribute('opacity','1');
               clickSound2();
            }else if(!this.myModel.appear){
               elem.setAttribute('opacity','0');               
            }               
            }

        }
//---------------------------------------------------------------------------------

           //класс <timer> таймер времени
        class TimerView{
            constructor() {
              this.myModel = null; // с какой моделью работаем
              this.myGame=null;// внутри какого элемента наша вёрстка 
              this.elem=null;    
            }

            startGame(TimerModel,game) {
            this.myModel=TimerModel;
            this.myGame=game;
            }

            buildGraphic(W,H,svgNew,parentRadius){ 
            var text=document.createElementNS("http://www.w3.org/2000/svg",'text');
            svgNew.appendChild(text);
            this.elem=text;                  
            text.style.fill="#F2C15F";
            text.style.fontSize=0.4*parentRadius;
            text.textContent=this.myModel.count;
            text.setAttribute('text-anchor','middle');
            text.setAttribute("x",W/2);
            text.setAttribute("y",H/2+0.15*parentRadius);       
            }

            update() {
            this.elem.textContent=this.myModel.count;
            }
        }

        //---------------------------------------------------------------------------------

           //класс <counter> cчетчик
        class CounterView{
            constructor() {
              this.myModel = null; // с какой моделью работаем
              this.myGame=null;// внутри какого элемента наша вёрстка               
              this.elemWorm=null;
              this.elemNut=null;    
            }

            startGame(CounterModel,game) {
            this.myModel=CounterModel;
            this.myGame=game;
            }

            buildGraphic(W,H,svgNew){ 
             //рисуем червячка и съедобный орех для счета

            //червячек
             var useWormCount=document.createElementNS("http://www.w3.org/2000/svg",'use');
             svgNew.appendChild(useWormCount);
             useWormCount.setAttribute("href",'#worm');
             //куда отображаем червячка:
             if(W>=700){
             var countWormX=40;
             var countWormY=30;
             }else{
             var countWormX=(W-60)/0.7;
             var countWormY=30;
             useWormCount.setAttribute("transform",'scale(0.7)');	
             }
             useWormCount.setAttribute("x",countWormX);
             useWormCount.setAttribute("y",countWormY);

             //text             
             var textWormCount=document.createElementNS("http://www.w3.org/2000/svg",'text');
             svgNew.appendChild(textWormCount);
             if(W>=700){
             textWormCount.setAttribute("x",countWormX+40);
             textWormCount.style.fontSize=70;
             textWormCount.setAttribute("y",countWormY+50);
             }else{
             textWormCount.setAttribute("x",(W-40));
             textWormCount.style.fontSize=55;
             textWormCount.setAttribute("y",countWormY+30);	
             }
             textWormCount.style.fill="#389E2A";
             textWormCount.textContent=this.myModel.countWorm;
             this.elemWorm=textWormCount;

            //орешек
             var useNutCount=document.createElementNS("http://www.w3.org/2000/svg",'use');
             svgNew.appendChild(useNutCount);
             useNutCount.setAttribute("href",'#nut');
             //куда отображаем червячка:
              if(W>=700){
             var countNutX=30;
             var countNutY=120;
             }else{
             var countNutX=(W-150)/0.75;
             var countNutY=30;
             useNutCount.setAttribute("transform",'scale(0.75)');	
             }
             useNutCount.setAttribute("x",countNutX);
             useNutCount.setAttribute("y",countNutY);
             
             //text             
             var textNutCount=document.createElementNS("http://www.w3.org/2000/svg",'text');
             svgNew.appendChild(textNutCount);

             if(W>=700){
             textNutCount.setAttribute("x",countNutX+50);
             textNutCount.setAttribute("y",countNutY+50);
             textNutCount.style.fontSize=70;
             }else{
             textNutCount.setAttribute("x",(W-120));
             textNutCount.style.fontSize=55;
             textNutCount.setAttribute("y",countNutY+30);	
             }
             
             textNutCount.style.fill="#E48A29";
             textNutCount.textContent=this.myModel.countNut;
             this.elemNut=textNutCount;   
            }

            update() {
            this.elemWorm.textContent=this.myModel.countWorm;
            this.elemNut.textContent=this.myModel.countNut;
            }
        }