function TicketManager() {


  
  this.token = '';
  this.hlsurl = '';
  this.adultcode = '';
  this.preventLoginRedirect = false;
  
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
    $('#login_div').hide();
    $('#content_div').hide();
    $('#adultcode_div').show();
  };
  
  this.redirectToHls = function() { 
    if (window.manager.hlsurl != '') { 
    	//window.localStorage.setItem("ittott_hlsurl", manager.hlsurl);      
        //window.open('video.html', '_self', 'location=no'); 
        window.open(window.manager.hlsurl, '_blank', 'location=yes'); 
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
          html = '';
          for (key in i.userchannels) {
            channel = i.userchannels[key];
            html += '<input type="button" onclick="javascript: window.manager.playChannel(\'' + channel.id + '\')" value="' + channel.name + '" /><br />';
          }
          $('#channels_div').html(html);
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
            window.manager.showAdultCode();
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
  
  this.doLogin = function() {
    var data = { 
      do : 'userLogin',
      identifier : $('#text_telephone').val(),
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
        }
        else {
          $('#span_loginerr').fadeIn();
        }
      },
      error: function(e1, er, err) {
        $('#span_loginerr').fadeIn();
      }
    });
  };
   
  this.checkAdultCode = function() {
    if ($('#text_adultcode').val() == window.manager.adultcode) { 
      window.manager.redirectToHls();
      $('#span_adulterr').hide();
      window.manager.showContent();
      return; 
    }
    $('#span_adulterr').fadeIn();
  };
  
  this.logOut = function() {
    $('.buttonLogout').html('aaaaa');
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
}
 