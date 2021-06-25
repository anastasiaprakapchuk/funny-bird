"use strict";
//model

  //класс <модель данных>
	
    class GameModel{
        constructor(){
          this.myView=null;
          this.bird=null;
          this.wormsBuffet=null;
          this.buffet=null;         
          this.timer=null;
          this.counter=null;
          this.collisions={};
          this.appearWorms={};
          this.appearForWorms=0;
          this.currentWorm=undefined;
          this.speedGameMore=false;
          this.speedGameLess=false;
          this.nGameMore=0;
          this.nGameLess=0;
          this.lose=false;
          this.win=false;
        }

        startGame(view) {
          this.myView=view;
          this.bird.startGame(this.myView.bird);
          this.wormsBuffet.startGame(this.myView.wormsBuffet);
          this.buffet.startGame(this.myView.buffet);
          this.timer.startGame(this.myView.timer);
          this.counter.startGame(this.myView.counter);
        }

        updateView() {
          if(this.myView)
              this.myView.update();
        }

        createObjects(BirdModel,WormsBuffetModel,BuffetModel,TimerModel,NutModel,NutRottenModel,NutFrozenModel,NutPepperModel,regales,CounterModel){
          this.bird=new BirdModel();
          this.wormsBuffet=new WormsBuffetModel();
          this.buffet=new BuffetModel();
          this.timer=new TimerModel();
          this.counter=new CounterModel();
          this.buffet.createBuffet(regales,NutModel,NutRottenModel,NutFrozenModel,NutPepperModel);
          this.wormsBuffet.createBuffet(this.buffet.regalesMassiv);
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

        positionObjects(W,H){
            if(W>=H){
              var r=0.25*H;              
            }else {
              var r=0.25*W;             
            }
          this.bird.radius=r;
        }

        update(){
          this.appear();

          if(this.bird.hit){

               var hitNut=this.collision('beak',this.buffet.regalesMassiv);
                              
               if(hitNut){
                var id=hitNut.elem.getAttribute('id');
                var i=this.buffet.regalesMassiv.indexOf(hitNut);

                  if(i in this.collisions){
                    this.bird.posX=-this.posX;//
                    this.bird.posY=-this.posY;//
                    this.bird.speedY=0;
                    this.bird.speedX=0;
                    this.bird.posY=0;
                    this.bird.posX=0;
                    this.bird.fly=false;
                    this.bird.hit=false;                   
                    console.log('вы уже съели этот орех');
                  } else {
                  if(hitNut instanceof NutModel){
                    if(this.nGameLess>=0){
                      this.nGameLess--;
                    }
                    if(this.nGameMore>=0){
                      this.nGameMore--;
                    }
                    if(this.nGameLess===0||this.nGameMore===0){
                    if(this.speedGameMore){
                      this.speedGameMore=false;
                      this.bird.speed=this.bird.speed/2;
                      this.buffet.speed=this.buffet.speed/2;
                      this.wormsBuffet.speed=this.wormsBuffet.speed/2;
                    }
                    if(this.speedGameLess){
                      this.speedGameLess=false;
                      this.bird.speed=this.bird.speed*2;
                      this.buffet.speed=this.buffet.speed*2;
                      this.wormsBuffet.speed=this.wormsBuffet.speed*2;
                    }
                    }
                     if(i in this.appearWorms){
                        this.counter.countWorm+=1;
                        this.wormsBuffet.wormsMassiv[i].eaten=true;
                        this.wormsBuffet.wormsMassiv[i].update(i);  //////////////
                        delete this.appearWorms[i];                                      
                        console.log('плюс червячек');
                        this.wormsBuffet.wormsMassiv[i].eaten=false;
                     }else{
                        this.counter.countNut+=1;
                        hitNut.update(id);
                        this.collisions[i]=true;                                      
                        console.log('плюс орех');
                        if(this.buffet.countNuts===this.counter.countNut){
                          this.win=true;
                        } 
                     }
                        this.bird.posX=-this.posX;//
                        this.bird.posY=-this.posY;//
                        this.bird.speedY=0;
                        this.bird.speedX=0;
                        this.bird.posY=0;
                        this.bird.posX=0;
                        this.bird.fly=false;
                        this.bird.hit=false;
                    
                  }else if(hitNut instanceof NutRottenModel){
                     if(i in this.appearWorms){
                      this.counter.countWorm+=1;
                      this.wormsBuffet.wormsMassiv[i].eaten=true;
                      this.wormsBuffet.wormsMassiv[i].update(i);  
                    delete this.appearWorms[i];                      
                      this.bird.posX=-this.posX;//
                      this.bird.posY=-this.posY;//
                      this.bird.speedY=0;
                      this.bird.speedX=0;
                      this.bird.posY=0;
                      this.bird.posX=0;
                      this.bird.fly=false;
                      this.bird.hit=false;
                      console.log('плюс червячек');
                      this.wormsBuffet.wormsMassiv[i].eaten=false;
                    }else{
                     hitNut.update(id); 
                     this.bird.fly=false;
                     this.bird.hit=false;
                     this.collisions[i]=true;
                     this.lose=true;
                     console.log('вы проиграли, игра окончена');
                    }                    
                    
                  }else if(hitNut instanceof NutFrozenModel){
                    if(i in this.appearWorms){
                    this.counter.countWorm+=1;
                    this.wormsBuffet.wormsMassiv[i].eaten=true;
                    this.wormsBuffet.wormsMassiv[i].update(i);
                    delete this.appearWorms[i];                      
                    this.bird.posX=-this.posX;//
                    this.bird.posY=-this.posY;//
                    this.bird.speedY=0;
                    this.bird.speedX=0;
                    this.bird.posY=0;
                    this.bird.posX=0;
                    this.bird.fly=false;
                    this.bird.hit=false;
                    console.log('плюс червячек');
                    this.wormsBuffet.wormsMassiv[i].eaten=false;
                    }else{
                      if(!this.speedGameLess){
                         this.bird.speed=this.bird.speed/2;
                         this.buffet.speed=this.buffet.speed/2;
                         this.wormsBuffet.speed=this.wormsBuffet.speed/2;
                      }                   
                    this.bird.posX=-this.posX;//
                    this.bird.posY=-this.posY;//
                    this.bird.speedY=0;
                    this.bird.speedX=0;
                    this.bird.posY=0;
                    this.bird.posX=0;
                    this.bird.fly=false;
                    this.bird.hit=false;
                    this.collisions[i]=true;
                    hitNut.update(id);
                    console.log('уменьшаем скорость');
                    this.speedGameLess=true;
                    this.nGameLess=2;
                    }         
                    
                  }else if(hitNut instanceof NutPepperModel){
                    if(i in this.appearWorms){
                    this.counter.countWorm+=1;
                    this.wormsBuffet.wormsMassiv[i].eaten=true;
                    this.wormsBuffet.wormsMassiv[i].update(i); 
                    delete this.appearWorms[i];                          
                    this.bird.posX=-this.posX;//
                    this.bird.posY=-this.posY;//
                    this.bird.speedY=0;
                    this.bird.speedX=0;
                    this.bird.posY=0;
                    this.bird.posX=0;
                    this.bird.fly=false;
                    this.bird.hit=false;
                    console.log('плюс червячек');
                    this.wormsBuffet.wormsMassiv[i].eaten=false;
                    }else{
                      if(!this.speedGameMore){
                        this.bird.speed=this.bird.speed*2;
                        this.buffet.speed=this.buffet.speed*2;
                        this.wormsBuffet.speed=this.wormsBuffet.speed*2;
                      }                     
                    this.collisions[i]=true;
                    hitNut.update(id);
                    console.log('увеличиваем скорость');
                    this.bird.posX=-this.posX;//
                    this.bird.posY=-this.posY;//
                    this.bird.speedY=0;
                    this.bird.speedX=0;
                    this.bird.posY=0;
                    this.bird.posX=0;
                    this.bird.fly=false;
                    this.bird.hit=false;
                    this.speedGameMore=true;
                    this.nGameMore=2;
                    }                           
                  }                  
               }
              }                
                else{
                    this.bird.posX=-this.posX;//
                    this.bird.posY=-this.posY;//
                    this.bird.speedY=0;
                    this.bird.speedX=0;
                    this.bird.posY=0;
                    this.bird.posX=0;
                    this.bird.fly=false;
                    this.bird.hit=false;
                    console.log('вы не попали');
                }           
          }

          this.bird.update();
          this.buffet.update();
          this.wormsBuffet.update();
          this.timer.update();
          this.counter.update();
          if(!this.timer.run||this.lose||this.win){
            if(this.win){
              this.timer.run=false;
            }
            this.bird.speed=0;
            this.bird.speedX=0;
            this.bird.speedY=0;
            this.buffet.speed=0;
            this.wormsBuffet.speed=0;
            this.collisions={};
            this.appearWorms={};
            this.appearForWorms=0;
            this.currentWorm=undefined;
            this.speedGameMore=false;
            this.speedGameLess=false;
            this.nGameMore=0;
            this.nGameLess=0;
            this.stopGame();
          }
          this.updateView(); 
        }

        stopGame(){
          this.myView.stopGame();
          gameRun=false;
        }

        //проверяем какой орех птичка съела
        collision(idElem1,massElem2){
          this.bird.position(idElem1);
          
          for(var i=0;i<massElem2.length;i++){
                        
            massElem2[i].position(i);
            if(this.bird.angle<=0&&this.bird.angle>=-90){ 
               if ((massElem2[i].x + massElem2[i].width >= this.bird.x)&&(massElem2[i].x<=this.bird.x)){
                  var collisionX = true;
                  //console.log('collisionX = true');
               }
               if ((massElem2[i].y + massElem2[i].height >= this.bird.y+this.bird.height)&&(massElem2[i].y<=this.bird.y)){//
                  var collisionY = true;
                  //console.log('collisionY = true');
               }
            }else if(this.bird.angle<-90&&this.bird.angle>=-180){ 
               if ((massElem2[i].x + massElem2[i].width >= this.bird.x)&&(massElem2[i].x<=this.bird.x)){
                  var collisionX = true;
                  //console.log('collisionX = true');
               }
               if ((massElem2[i].y + massElem2[i].height >= this.bird.y+this.bird.height)&&(massElem2[i].y<=this.bird.y+this.bird.height)){//
                  var collisionY = true;
                  //console.log('collisionY = true');
               }
            }else if (this.bird.angle<-180&&this.bird.angle>=-270){
               if ((massElem2[i].x <= this.bird.x+this.bird.width)&&(massElem2[i].x+massElem2[i].width>=this.bird.x+this.bird.width)){
                  var collisionX = true;
               }
               if ((massElem2[i].y <= this.bird.y)&&(massElem2[i].y+massElem2[i].height>=this.bird.y+this.bird.height/2)){//
                  var collisionY = true;
               }
            }else if (this.bird.angle<-270&&this.bird.angle>=-360){
               if ((massElem2[i].x <= this.bird.x+this.bird.width/2)&&(massElem2[i].x+massElem2[i].width>=this.bird.x+this.bird.width)){
                  var collisionX = true;
               }
               if ((massElem2[i].y <= this.bird.y)&&(massElem2[i].y+massElem2[i].height>=this.bird.y)){//
                  var collisionY = true;
               }
            }
            if (collisionX&&collisionY){
              collisionX = false;
              collisionY = false;
              return massElem2[i];
            }
            collisionX = false;
            collisionY = false;                             
          }                 
        }

        appear(){
          if(!this.lose||this.timer){
          this.appearForWorms+=1;
          
          if(this.appearForWorms>700){                     
              var n =this.wormsBuffet.randomWorm();
              //console.log(n);
              if((n in this.collisions)===false&&(n in this.appearWorms)===false){
                if(this.currentWorm){
                 delete this.appearWorms[this.currentWorm];
                 this.wormsBuffet.wormsMassiv[this.currentWorm].appear=false;
                 this.wormsBuffet.wormsMassiv[this.currentWorm].update(this.currentWorm);
                }
                 this.appearWorms[n]=true;
                 this.currentWorm=n;

                 this.wormsBuffet.wormsMassiv[n].appear=true;
                 this.wormsBuffet.wormsMassiv[n].update(n);
                 this.appearForWorms=0;
                 //console.log(this.appearWorms);   
              }             
          }
        }
        }          
          
    } 
//---------------------------------------------------------------------------------
        //класс <птичка>
        class BirdModel{
            constructor(){
              this.radius=undefined;
              this.posX=0;
              this.posY=0;
              this.Xmax=0;
              this.Ymax=0;
              this.fly=false;
              this.hit=false;

              this.speedX=0;//скорость подскока птички по X
              this.speedY=0;//скорость подскока птички по Y 
              this.speed=-1;//скорость птички по окружности - бег            
              this.angle=0;//угол поворота птички

              //для анимации крыла:
              this.speedWing=0.25;  
              this.angleWing=0;

              //для анимации ног:
              this.speedLegL=0.5;
              this.speedLegR=-0.5;   
              this.xLegL=0; 
              this.xLegR=0;

              //для отслеживания позиции клюва
              this.x=undefined;//
              this.y=undefined;//
              this.width=undefined;//
              this.height=undefined;//    
            }

            startGame(view) {
              this.myView=view;
            }

            updateView() {
               if ( this.myView )
                this.myView.update();
            }
            
            update(){
              this.rotation();
              this.anim();              
            }

            rotation(){
              if(this.angle<=-360){
              this.angle=0;
            }
              this.angle+=this.speed;//угол поворота стола
              this.updateView();              
            }

            anim(){
              //анимация крыла
              if(this.angleWing===5||this.angleWing===-5){
              this.speedWing=-this.speedWing;
              this.angleWing=0;
              }
              this.angleWing+=this.speedWing;//угол поворота


              //анимация ног
              //левая
              if(this.xLegL>=3||this.xLegL<=-3){
              this.speedLegL=-this.speedLegL;
              }
              this.xLegL+=this.speedLegL;//угол поворота

              //правая
              if(this.xLegR>=3||this.xLegR<=-3){
              this.speedLegR=-this.speedLegR;
              }
              this.xLegR+=this.speedLegR;//угол поворота


              //анимация прыжка
              if(this.fly){
               // this.angle=-350;//проверка - не удалять!
                var rad=this.angle/180*Math.PI;

                var Xmax=0.35*this.radius*Math.sin(rad);//
                var Ymax=0.35*this.radius*Math.cos(rad);//
                this.Xmax=Xmax;
                this.Ymax=Ymax;

                if(this.angle===0){                 
                  this.speedY=-15;
                }else if(this.angle<0&&this.angle>=-45){
                  this.speedY=-15;
                  this.speedX=-this.speedY*Math.tan(rad);                  
                }else if(this.angle<-45&&this.angle>-90){
                  this.speedX=-15;
                  this.speedY=-this.speedX/Math.tan(rad);
                }else if(this.angle===-90){
                  this.speedX=-15;                
                }else if(this.angle<-90&&this.angle>=-135){
                  this.speedX=-15;
                  this.speedY=-this.speedX/Math.tan(rad);
                }else if(this.angle<-135&&this.angle>-180){
                  this.speedY=15;
                  this.speedX=-this.speedY*Math.tan(rad);
                }else if(this.angle===-180){                  
                  this.speedY=15;
                }else if(this.angle<-180&&this.angle>=-225){
                   this.speedY=15;
                   this.speedX=-this.speedY*Math.tan(rad);                 
                }else if(this.angle<-225&&this.angle>-270){
                   this.speedX=15;
                   this.speedY=-this.speedX/Math.tan(rad);                 
                }else if(this.angle===-270){
                  this.speedX=15;
                }else if(this.angle<-270&&this.angle>=-315){
                  this.speedX=15;
                  this.speedY=-this.speedX/Math.tan(rad);
                }else if(this.angle<-315&&this.angle>-360){
                  this.speedY=-15;
                  this.speedX=-this.speedY*Math.tan(rad);
                }else if(this.angle<=-360){                 
                  this.speedY=-15;
                }
                
                this.posX+=this.speedX;
                this.posY+=this.speedY;
                 
                if(this.angle===0){
                  if(Math.abs(this.posY)>=Math.abs(Ymax)){
                    this.hit=true;
                 }
                }else{
                 if(Math.abs(this.posX)>=Math.abs(Xmax)||Math.abs(this.posY)>=Math.abs(Ymax)){
                    this.hit=true;
                 }
                } 
              }            
              this.updateView();              
            }

            startFly(codeButton){
              if(codeButton===13||codeButton===32){
                 this.fly=true;                                 
              }else {
                 this.fly=true;                
              }
            }

            position(id){//позиция клюва
              var elem=document.getElementById(id);
              var infoElem=elem.getBoundingClientRect();
              this.x=infoElem.x;
              this.y=infoElem.y;
              this.width=infoElem.width;
              this.height=infoElem.height;
            }           
        } 

//---------------------------------------------------------------------------------
        //класс <buffet> воображаемый шведский круглый стол для птички:)- окружность,  по которой будут крутиться вкусности
        class BuffetModel{
            constructor(){
              this.myView=null;              
              this.speed=0.5;//скорость поворота стола - угол поворота               
              this.angle=0;//угол поворота             
              this.regalesMassiv=[];//массив угощений на столе
              this.regales=null;
              this.countNuts=0;
            }

            startGame(view) {
              this.myView=view;
              for(var i=0;i<this.regales.length;i++){
                 this.regalesMassiv[i].startGame(this.myView.regalesMassiv[i]);
              }
            }

            updateView() {
              if(this.myView)
                this.myView.update();
            }

            createBuffet(regales,NutModel,NutRottenModel,NutFrozenModel,NutPepperModel){
              this.regales=regales;
              var filtrRegales=this.regales.filter((v)=>v===0) 
              this.countNuts=filtrRegales.length;
                for(var i=0;i<regales.length;i++){
                    if(regales[i]===0){
                      this.regalesMassiv[i]=new NutModel();
                    } else if(regales[i]===1){
                      this.regalesMassiv[i]=new NutRottenModel();
                    }else if(regales[i]===2){
                      this.regalesMassiv[i]=new NutFrozenModel();
                    }else if(regales[i]===3){
                      this.regalesMassiv[i]=new NutPepperModel();
                    }
                }
            }

            destroyBuffet(){              
                for(var i=0;i<this.regalesMassiv.length;i++){                    
                      this.regalesMassiv[i]=null;                    
                }
            }
            
            update(){
              this.rotation();
            }

            rotation(){
              if(this.angle===360){
              this.angle=0;
            }
              this.angle+=this.speed;//угол поворота стола              
              this.updateView();              
            }
        }
//---------------------------------------------------------------------------------
         //класс <regale> вкусности 
        class RegaleModel{
            constructor(){
              this.myView=null;              
              this.x=undefined;//
              this.y=undefined;//
              this.width=undefined;//
              this.height=undefined;//
              this.elem=null;
            }

            startGame(view) {
              this.myView=view;
            }

            updateView(id) {
              if(this.myView)
                this.myView.update(id);
            }

            position(id){
              var elemN=document.getElementById(id);
              this.elem=elemN;
              var infoElem=elemN.getBoundingClientRect();
              this.x=infoElem.x;
              this.y=infoElem.y;
              this.width=infoElem.width;
              this.height=infoElem.height;
            }

            update(id){
              this.updateView(id);
            }
        }
//---------------------------------------------------------------------------------
        // 0
        class NutModel extends RegaleModel { // 0-----орех - это вкусность
            constructor() {
              super();    
            }
        }
//---------------------------------------------------------------------------------
        // 1
        class NutRottenModel extends RegaleModel { // 1------гнилой орех - это вкусность
            constructor() {
              super();          
            }
        }
//---------------------------------------------------------------------------------
        // 2
        class NutFrozenModel extends RegaleModel { // 2------мерзлый орех - это вкусность
            constructor() {
              super();     
            }
        }
//---------------------------------------------------------------------------------
        // 3
        class NutPepperModel extends RegaleModel { // 3------ орех с перчиком - это вкусность
            constructor() {
              super();                       
            }
        }
//---------------------------------------------------------------------------------

 //класс <wormBuffet> червячек
        class WormsBuffetModel{
            constructor(){
              this.myView=null;              
              this.speed=0.5;//скорость поворота стола               
              this.angle=0;             
              this.wormsMassiv=[];//массив угощений на столе
            }


            startGame(view) {
              this.myView=view;
              for(var i=0;i<this.wormsMassiv.length;i++){//
                 this.wormsMassiv[i].startGame(this.myView.wormsMassiv[i]);
              }
            }

            updateView() {
              if(this.myView)
                this.myView.update();
            }

            createBuffet(massiv){
                for(var i=0;i<massiv.length;i++){                   
                    this.wormsMassiv[i]=new WormModel();
                }
            }

            destroyBuffet(){
                for(var i=0;i<this.wormsMassiv.length;i++){                   
                    this.wormsMassiv[i]=null;
                }
            }
            
            update(){
              this.rotation(this.speed);
            }

            rotation(speed){
              this.speed=speed;
              if(this.angle===360){
              this.angle=0;
              }
              this.angle+=this.speed;//угол поворота стола              
              this.updateView();              
            }

             randomWorm(){
              var n=Math.round(Math.random()*(this.wormsMassiv.length-1));
              return n;   
            }
        }
//---------------------------------------------------------------------------------

        //класс <worm> червячек
        class WormModel{
            constructor(){
              this.myView=null;              
              this.x=undefined;//
              this.y=undefined;//
              this.width=undefined;//
              this.height=undefined;//
              this.elem=null;
              this.appear=false;
              this.eaten=false;
            }
                
            startGame(view) {
              this.myView=view;
            }

            updateView(n) {
              if(this.myView)
                this.myView.update(n);
            }

            position(id){
              var elemN=document.getElementById(id);
              this.elem=elemN;
              var infoElem=elemN.getBoundingClientRect();
              this.x=infoElem.x;
              this.y=infoElem.y;
              this.width=infoElem.width;
              this.height=infoElem.height;
            }

            update(n){
              this.updateView(n);
            }
        }
//---------------------------------------------------------------------------------

        //класс <timer> таймер
        class TimerModel{
            constructor(){
              this.myView=null;
              this.count=undefined;
              this.timer=46000;
              this.now=undefined;
              this.end=undefined;
              this.run=false;
              this.remain=undefined;
              this.isSecond=45;
            }
                
            startGame(view) {
              this.myView=view;
            }

            updateView() {
              if(this.myView)
                this.myView.update();
            }

            timerStart(){
              this.run=true;
              this.now=Date.now();
              this.end=this.now+this.timer;
            }

            update(){
              var currentNow=Date.now();
              this.remain=this.end-currentNow;
              if(currentNow>=this.end){
                 this.run=false;
              }else{
                this.count=parseInt(this.remain/1000);
              }
              this.updateView();        
            }
        }

         //класс <timer> счетчик попаданий
        class CounterModel{
            constructor(){
              this.myView=null;
              this.countNut=0;//
              this.countWorm=0;//
            }
                
            startGame(view) {
              this.myView=view;
            }

            updateView() {
              if(this.myView)
                this.myView.update();
            }

            update(){              
              this.updateView();        
            }
        }

//---------------------------------------------------------------------------------

       