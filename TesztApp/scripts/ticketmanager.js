function TicketManager() {


  this.savedData = '';  
  this.token = '';
  this.hlsurl = '';
  this.adultcode = '';
  this.preventLoginRedirect = false;

  this.myAlert = function(msg, title, okTitle) {
      
      navigator.notification.alert(
            msg,  // message
            null,         // callback
            title,            // title
            okTitle                  // buttonName
      );
      
      /*navigator.notification.prompt(
        'Please enter your name',  // message
        null,                  // callback to invoke
        'Registration',            // title
        ['Ok','Exit'],             // buttonLabels
        'Jane Doe'                 // defaultText
    );*/
      //alert (s);
  }  
    
  this.showLogin = function() {
    if (!window.manager.preventLoginRedirect) {
      window.open('index.html', '_self', 'location=no,transitionstyle=fliphorizontal');   
    }
    //window.open('index.html', '_self', 'location=no'); 
    //$.mobile.changePage( "index.html", { transition: "slideup"} );  
      //} catch (e) { alert(e);}
    /*$('#content_div').hide();
    $('#adultcode_div').hide();
    $('#login_div').show();*/
  };
  
  this.showContent = function() {
    //$.mobile.changePage( "channels.html", { transition: "slideup"} );  
    window.open('channels.html', '_self', 'location=no,transitionstyle=fliphorizontal'); 
    /*$('#login_div').hide();
    $('#adultcode_div').hide();
    $('#content_div').show();*/
  };
  
  this.showAdultCode = function() {
    window.open('lock.html', '_self', 'location=no,transitionstyle=fliphorizontal');     
    /*$('#login_div').hide();
    $('#content_div').hide();
    $('#adultcode_div').show();*/
  };
    
  this.showTvGuide = function() {
    window.open('tvguide.html', '_self', 'location=no,transitionstyle=fliphorizontal'); 
  };
  
  this.redirectToHls = function() { 
    if (window.manager.hlsurl != '') { 
    	//window.localStorage.setItem("ittott_hlsurl", manager.hlsurl);      
        //window.open('video.html', '_self', 'location=no'); 
        if(navigator.userAgent.toLowerCase().match(/ipad/)){
        	window.open(window.manager.hlsurl, '_blank', 'location=no,transitionstyle=fliphorizontal,closebuttoncaption=Vissza a csatornákhoz'); 
        }
        else{
            window.open(window.manager.hlsurl, '_self', 'location=no,transitionstyle=fliphorizontal,closebuttoncaption=Vissza'); 
        }
        //window.open(window.manager.hlsurl, '_system', 'location=no,transitionstyle=fliphorizontal,closebuttoncaption=Vissza'); 
    }
  };
  
  this.checkToken = function() {
    if (window.manager.token == '')  {
      window.manager.showLogin();
      return;
    }
    
    var data = { 
      do : 'getChannelsList',
      token : window.manager.token
    };
    $.ajax({
      url: "http://ittott.tv/api",
      type: "POST",
      data: data,
      dataType: "json",
      success: function(i){
        if (i.tokenok == '1') {
          
        }
        else {
          window.manager.showLogin();
        }
      },
      error: function(e1, er, err) {
        window.manager.showLogin();
      }
    });
  };  
    
    this.changeChannelDiv = function() {
      /*$('.tab').hide();
      $('#tab'+$('#select_theme').val()).show();*/
      for (key in window.manager.savedData.themes) {  
        theme =  window.manager.savedData.themes[key];
        if (key != +$('#select_theme').val()) { continue; }
        channelhtml = '';
        for (chkey in theme.channels) {
          channel = theme.channels[chkey];
          
            var onClick = 'onclick="javascript: window.manager.myAlert(\'Úgy tűnik a választott csatorna jelenleg nem szerepel az előfizetésedben. Kérjük válassz másikat!\', \'Jogosultsági hiba\', \'Ok\'); return false;"';  
          var liClass = 'class="locked"';
          if (channel['access'] == '1') {
            onClick = 'onclick="javascript: window.manager.playChannel(\'' + channel.id + '\'); return false;"';       
            liClass = '';  
          }
            
          //channelhtml += '<li onclick="javascript: window.manager.playChannel(\'' + channel.id + '\')">';
          channelhtml += '<li ' + liClass + '><a href="#" ' + onClick + '>';
          channelhtml += '<img src="' + channel.img + '" />';
          channelhtml += '<p>' + channel.name + '<br /><span>' + channel.theme + '</span></p>';
          channelhtml += '</a></li>';  
          //channelhtml += '</li>';  
        }   
        $('#listview_main').html(channelhtml);
        $("#listview_main").listview("refresh");   
      }
        
    }
    
  this.checkChannels = function() {
    if (window.manager.token == '')  {
      window.manager.showLogin();
      return;
    }
    
    var data = { 
      do : 'getChannelsList',
      token : window.manager.token
    };
    $.ajax({
      url: "http://ittott.tv/api",
      type: "POST",
      data: data,
      dataType: "json",
      success: function(i){
        if (i.tokenok == '1') {
          /*channelhtml = '<div id="tab0" class="tab active"><ul data-role="listview">';
          for (key in i.userchannels) {
            channel = i.userchannels[key];
            channelhtml += '<li onclick="javascript: window.manager.playChannel(\'' + channel.id + '\')">';
            channelhtml += '<img src="' + channel.img + '" />';
            channelhtml += '<p>' + channel.name + '<br /><span>' + channel.theme + '</span></p>';
            channelhtml += '</li>';  
          }
          channelhtml += '</ul></div>';
          

		  themehtml = '';          */
          window.manager.savedData = i;  
          var first = true; var counter=0; var tmp = 0;
          for (key in i.themes) {
            counter++;
            theme = i.themes[key];
            /*
            var extra = '';
            if (first) { extra = 'class="active"'; }
            themehtml += '<a ' + extra + ' href="#" title="">' + theme.theme + '</a>';  */
            if (first) { tmp = key; }
            $('#select_theme').append($('<option>', {
                value: key,
                text: theme.theme
            }));  
          }    
          $('#select_theme').val('0');
          $('#select_theme').selectmenu("refresh");  
          window.manager.changeChannelDiv();  
          return;  
              
			/*              
            first = false;
          
            channelhtml += '<div id="tab' + counter + '" class="tab" style="display: none;"><ul data-role="listview">';  
            for (chkey in theme.channels) {
              channel = theme.channels[chkey];
              channelhtml += '<li onclick="javascript: window.manager.playChannel(\'' + channel.id + '\')">';
              channelhtml += '<img src="' + channel.img + '" />';
              channelhtml += '<p>' + channel.name + '<br /><span>' + channel.theme + '</span></p>';
              channelhtml += '</li>';  
            }   
            channelhtml += '</ul></div>';
          }  
            */
          
          
          /*$('.tabControl').html(themehtml);
          $('#channel_div').html(channelhtml);
            
          $("ul").listview("refresh");  */
            
          /*$(".tabControl a").click(function(){
    	    number = $(this).prevAll("a").length;
    
    		$(".tabControl a").removeClass("active");
    		$(this).addClass("active");
    		$(".tab").hide();
    		$(".tab:eq("+number+")").show();
        
    		return false;
  		  });*/
        }
        else {
          window.manager.showLogin();
        }
      },
      error: function(e1, er, err) {
        window.manager.showLogin();
      }
    });
  };
  
  this.playChannel = function(channelid) {
    if (window.manager.token == '')  {
      window.manager.showLogin();
      return;
    }
    
    var data = { 
      do : 'getHls',
      channelid : channelid,
      token : window.manager.token
    };
    $.ajax({
      url: "http://ittott.tv/api",
      type: "POST",
      data: data,
      dataType: "json",
      success: function(i){
        if (i.tokenok == '1') {
          window.manager.hlsurl = i.hls;
          if (i.adultcode != '') {
            window.manager.adultcode = i.adultcode;  
    		/*window.localStorage.setItem("ittott_adultcode", i.adultcode);              
            window.localStorage.setItem("ittott_adulthls", i.hls);              
            window.manager.adultcode = i.adultcode;*/
            //window.manager.showAdultCode();
            //$.mobile.changePage( "lock.html", { role: "dialog" } );  
            window.manager.lockPrompt();  
          }
          else {
            window.manager.redirectToHls();
          }
        }
        else {
          window.manager.showLogin();
        }
      },
      error: function(e1, er, err) {
        window.manager.showLogin();
      }
    });
  };  
  this.lockPrompt = function() {
    navigator.notification.prompt(
               new String(),
                window.manager.lockCallBack,    
                'Gyerekzár',            
                ['OK','Mégsem'],
                new String()
            );          
  }
  this.lockCallBack = function(results) {
    if (results.buttonIndex != 1) { return; }
    if (results.input1 == window.manager.adultcode)  {
      window.manager.redirectToHls();      
      return;
    }
    window.manager.lockPrompt();
  }
  
  this.doLogin = function() {
    var data = { 
      do : 'userLogin',
      identifier : '36' + $('#text_telephone').val(),
      password : $('#text_password').val()
    };
    $.ajax({
      url: "http://ittott.tv/api",
      type: "POST",
      data: data,
      dataType: "json",
      success: function(i){
        if (i.loginok == '1') {
          window.manager.saveToken (i.newtoken);
          $('#span_loginerr').hide();
          //window.manager.checkChannels();
          window.manager.showContent();
            //window.manager.showTvGuide();
        }
        else {
          //$('#span_loginerr').fadeIn();
          window.manager.myAlert('Hibás bejelentkezési adatok, kérjük ellenőrizd!', 'Sikertelen belépés!', 'Ok');
        }
      },
      error: function(e1, er, err) {
        $('#span_loginerr').fadeIn();
      }
    });
  };
   
  this.checkAdultCode = function(event) {
      
    if ($('#text_adultcode').val() == window.manager.adultcode) { 
      window.manager.redirectToHls();
      //$('#span_adulterr').hide();
      window.manager.showContent();
      return; 
    }
    $('#span_adulterr').fadeIn();
  };
  
  this.startLogout = function(e) {
    navigator.notification.confirm(
        'Biztos kijelentkezel az alkalmazásból?',
         window.manager.logoutCallback,            
        'Kilépés',   
        'Igen,Mégsem'       
    );
    $('.buttonLogout').removeClass('ui-btn-active');  
  }
  
  this.logoutCallback = function(buttonIndex) {
    if (buttonIndex == 1) { window.manager.logOut(); }
  }
  
  this.logOut = function() {
    window.manager.saveToken('');
    //$('#text_telephone, #text_password').val('');
    window.manager.showLogin();
  };
    
  this.saveToken = function(token) {
    window.localStorage.setItem("ittott_token", token);      
    window.manager.token = token;
  };
    
  this.setVideo = function() {
    var hlsurl = window.localStorage.getItem("ittott_hlsurl");
    if ((window.manager.token == '') || (!hlsurl)) {
 	  window.open('index.html', '_self', 'location=no');            
      return;
    }
    $('#mainvideo').attr('src', hlsurl);
    $('#mainvideo').play();
  };
 
  this.showChannelTvGuide = function() {
    for (key in window.manager.savedData.tvguide) {  
      tvguide =  window.manager.savedData.tvguide[key];
      if (key != $('#select_channel').val()) { continue; }
      programhtml = '';
      for (prkey in tvguide['programs']) {
        var program = tvguide['programs'][prkey];
        programhtml += '<li><p><span class="date">' + program['starttime'] + '</span>' + program['title'] + '</p></li>'; 
      } 
      $('#listview_main').html(programhtml);
      $("#listview_main").listview("refresh");           
    }     
    $('#select_channel').selectmenu('refresh', true);
    $('#select_day').selectmenu('refresh', true);  
  }  
  this.getTvGuide = function() {
    day = $('#select_day').val();
     
    var data = { 
      do : 'getTvGuide',
      token : window.manager.token,
      day : day
    };
      
      
    $.ajax({
      url: "http://ittott.tv/api",
      type: "POST",
      data: data,
      dataType: "json",
      success: function(i){
        if (i.tokenok == '1') {
          window.manager.savedData = i;
            
          var channelhtml = '';
          var programhtml = '';  
          var first = true; var tmp = 0;
          $('#select_channel').empty();
          for (key in i.tvguide) {
            extra = '';
            if (first) { extra = 'class="active"'; tmp = key; }
            
            $('#select_channel').append($('<option>', {
                value: key,
                text: i.tvguide[key]['channel']
            }));    
              
            //channelhtml += '<a ' + extra + ' href="#" title="">' + i.tvguide[key]['channel'] + '</a>';
            
            /*extra = '';
            if (first) { extra = ' active'; }
            programhtml += '<div class="tab' + extra + '"><ul>';  
            for (chkey in i.tvguide[key]['programs']) {
              var program = i.tvguide[key]['programs'][chkey];
              programhtml += '<li><p><span class="date">' + program['starttime'] + '</span>' + program['title'] + '</p></li>'; 
            }
            programhtml += '</ul></div>';  */
              
            first = false;  
          }
          $('#select_channel').val(tmp);
          window.manager.showChannelTvGuide();  
            
          /*$('.tabControl').html(channelhtml);
          $('#channel_div').html(programhtml);
            
          $(".tabControl a").click(function(){
    	    number = $(this).prevAll("a").length;
    
    		$(".tabControl a").removeClass("active");
    		$(this).addClass("active");
    		$(".tab").hide();
    		$(".tab:eq("+number+")").show();
        
    		return false;
  		  });*/
            
        }
        else {
          window.manager.showLogin();
        }
      },
      error: function(e1, er, err) {
        window.manager.showLogin();
      }
    });  

    
    
  };
  
  
}
 