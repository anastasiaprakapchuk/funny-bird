 "use strict";
     var ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
     var updatePassword;
     var stringName='PROKOPCHUK_CP_FANNY_BIRD';
     var name='';

     //добавляю строку в AjaxStringStorage2 под своим именем :
     $.ajax( {
            url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
            data : { f : 'INSERT', n : stringName, v : name },
            success : insertString, error : errorHandler
        }
     );

     function insertString(callresult) {
          if ( callresult.error!=undefined ){
          	//ничего не выводим - строка на сервере создана
          }            
          else if ( callresult.result==="ОК" ) {            
            console.log(callresult.result);
          }
     }

     function errorHandler(jqXHR,statusStr,errorStr) {
          alert(statusStr+' '+errorStr);
     }
     //-----------------------------------------------------
      
    // нахожу элемент страницы, с которым работаю:
    var divTable=document.getElementById('scoresTable');//нашли div таблицы scores
    //храним в строке массив хэшей [{name:nickname,nuts:countNuts,worms:countWorm,time:countTime},{...},...]
    
    var massivResult;//заводим переменную для всех имен - массив результатов

    //читаем массив результатов прежде, чем его изменить- в massivResult выгружаем готовый массив
        function readScores(){
        $.ajax( {
            url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
            data : { f : 'READ', n : stringName},
            success : getReady, error : errorHandler
        }
        );
        } 

        function getReady(callresult) {         
          if ( callresult.error!=undefined )
            alert(callresult.error);
          else if ( callresult.result!="" ) {
            var inf=JSON.parse(callresult.result);//распаковываем
          }else if ( callresult.result==="" ) {
            var inf=[];//
          }
          console.log(inf);  
          showInfo(inf);//вызываем функцию для получения информации  
        }
        
        function showInfo(inf) {         
          massivResult=inf;
          buildScores();
        }

//функция добавления нового результата в таблицу и на сервер   
      function addName(nicknameHash){
      	if(!massivResult){
      	massivResult=[];
        }
        if(massivResult.length>=10){
        	massivResult.splice(0,1);
        }
        massivResult.push(nicknameHash);
        buildScores();     
        var info= massivResult;
        
        var updatePassword=Math.random();
        $.ajax( {
            url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
            data : { f : 'LOCKGET', n : stringName, p : updatePassword },
            success : lockGetReady, error : errorHandler
          }
        );

        function lockGetReady(callresult) {
          if ( callresult.error!=undefined )
             alert(callresult.error);
          else {
            $.ajax( {
                url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                data : { f : 'UPDATE', n : stringName, v :  JSON.stringify(info), p : updatePassword },
                success : updateReady, error : errorHandler
              }
            );
          }
        }

        function updateReady(callresult) {
            if ( callresult.error!=undefined )
                alert(callresult.error);
        }
    }
     
//функция построения таблицы результатов    
    function buildScores(){
    	    function buildTr(s){
                for(var j=0;j<massivKeys.length;j++){
						var newTd=document.createElement('td');					
						newTr.appendChild(newTd);
						var expression=massivKeys[j];
						switch (expression) {
							case 'name':
								var strForScores=s['name'];
								break;
							case 'nuts':
								var strForScores=s['nuts']+' nuts';
								break;
							case 'worms':
								var strForScores=s['worms']+' worms';
								break;
							case 'time':
								var strForScores='in '+s['time']+' s';
								break;					
						}
						var newTextTd=document.createTextNode(strForScores);
						newTd.appendChild(newTextTd);					
                }
            }
    var scores=document.getElementById('scores');
    var scoresTable=document.getElementById('scoresTable');
   
    if(massivResult.length===0){
        var newTitle=document.createElement('h1');
    	scoresTable.appendChild(newTitle);
    	var newTexth1=document.createTextNode('SCORES');
		newTitle.appendChild(newTexth1);
		var newP=document.createElement('p');
    	scoresTable.appendChild(newP);
    	var newTextp=document.createTextNode('No results yet...Maybe your result will be the first');
		newP.appendChild(newTextp);			    	
    	
    }else if(massivResult.length>0){
    	var newTitle=document.createElement('h1');
    	scoresTable.appendChild(newTitle);
    	var newTexth1=document.createTextNode('Scores');
		newTitle.appendChild(newTexth1);   	
        var newTable=document.createElement('table');
        scoresTable.appendChild(newTable);
        newTable.setAttribute('align', 'center');
        newTable.setAttribute('rules', 'rows');
        for(var i=0;i<massivResult.length;i++){
        	var newTr=document.createElement('tr');
        	newTr.style.borderBottom='1px solid #a35f10fe';
			newTable.appendChild(newTr);
			var massivKeys=Object.keys(massivResult[i]);
			buildTr(massivResult[i]);				
        }
        
    }
}