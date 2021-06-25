"use script";

//вибрация
    function vibro(longFlag) {
        if ( navigator.vibrate ) { // есть поддержка Vibration API?
            if ( !longFlag )
                window.navigator.vibrate(50); // вибрация 50мс
            else
                window.navigator.vibrate([100,50,100,50,100,50,100]); // вибрация 4 раза по 100мс с паузами 50мс
        }
    }


  //музыкальное сопровождение
    var clickAudioFon=new Audio; //фоновая музыка игры  
    clickAudioFon.src="my_media/fon.mp3";
    
    var clickAudio1=new Audio; //птичка съела хороший орех   
    clickAudio1.src="my_media/nut1.mp3";
    
    var clickAudio2=new Audio; //птичка съела   
    clickAudio2.src="my_media/worm1.mp3";
    
    var clickAudio3=new Audio;
    clickAudio3.src="my_media/nut2.mp3";
    
    var clickAudio4=new Audio;    
    clickAudio4.src="my_media/worm2.mp3";
    
    var clickAudio5=new Audio;   
    clickAudio5.src="my_media/nutRotten.mp3";

    clickAudio5.onload=clickSoundInit;
     
    function clickSoundInit() {
      clickAudioFon.play();
      clickAudioFon.pause(); 

      clickAudio1.play(); 
      clickAudio1.pause(); 

      clickAudio2.play(); 
      clickAudio2.pause(); 

      clickAudio3.play(); 
      clickAudio3.pause(); 

      clickAudio4.play(); 
      clickAudio4.pause();

      clickAudio5.play(); 
      clickAudio5.pause(); 
    }

    function clickSoundFon() {
        clickAudioFon.currentTime=1.5;
        clickAudioFon.play();
    }

    function clickSound1() {
        clickAudio1.currentTime=0; 
        clickAudio1.play();
    }

    function clickSound2() {
        clickAudio2.currentTime=0; 
        clickAudio2.play();
    }

    function clickSound3() {
        clickAudio3.currentTime=0; 
        clickAudio3.play();
    }

    function clickSound4() {
        clickAudio4.currentTime=0; 
        clickAudio4.play();
    }

    function clickSound5() {
        clickAudio5.currentTime=0; 
        clickAudio5.play();
    }

    function stopSound() {      
      clickAudioFon.pause();       
      clickAudio1.pause();      
      clickAudio2.pause();       
      clickAudio3.pause();      
      clickAudio4.pause();       
      clickAudio5.pause(); 
    }
