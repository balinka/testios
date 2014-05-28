function TicketManager() {


  
  this.token = window.localStorage.getItem("ittott_token");
  this.hlsurl = '';
  this.adultcode = '';
  
  this.showLogin = function() {
    $('#content_div').hide();
    $('#adultcode_div').hide();
    $('#login_div').show();
  };
  
  this.showContent = function() {
    $('#login_div').hide();
    $('#adultcode_div').hide();
    $('#content_div').show();
  };
  
  this.showAdultCode = function() {
    $('#login_div').hide();
    $('#content_div').hide();
    $('#adultcode_div').show();
  };
  
  this.redirectToHls = function() { 
    if (manager.hlsurl != '') { window.open(manager.hlsurl, '_system', 'location=no'); }
  };
  
  this.checkChannels = function() {
    if (manager.token == '')  {
      manager.showLogin();
      return;
    }
    
    var data = { 
      do : 'getChannelsList',
      token : manager.token
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
            html += '<input type="button" onclick="javascript: manager.playChannel(\'' + channel.id + '\')" value="' + channel.name + '" /><br />';
          }
          $('#channels_div').html(html);
          manager.showContent();
        }
        else {
          manager.showLogin();
        }
      },
      error: function(e1, er, err) {
        manager.showLogin();
      }
    });
  };
  
  this.playChannel = function(channelid) {
    if (manager.token == '')  {
      manager.showLogin();
      return;
    }
    
    var data = { 
      do : 'getHls',
      channelid : channelid,
      token : manager.token
    };
    $.ajax({
      url: "http://ittott.tv/api",
      type: "POST",
      data: data,
      dataType: "json",
      success: function(i){
        if (i.tokenok == '1') {
          manager.hlsurl = i.hls;
          if (i.adultcode != '') {
            manager.adultcode = i.adultcode;
            manager.showAdultCode();
          }
          else {
            manager.redirectToHls();
          }
        }
        else {
          manager.showLogin();
        }
      },
      error: function(e1, er, err) {
        manager.showLogin();
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
          manager.saveToken (i.newtoken);
          $('#span_loginerr').hide();
          manager.checkChannels();
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
    if ($('#text_adultcode').val() == manager.adultcode) { 
      manager.redirectToHls();
      $('#span_adulterr').hide();
      manager.showContent();
      return; 
    }
    $('#span_adulterr').fadeIn();
  };
  
  this.logOut = function() {
    manager.saveToken('');
    $('#text_telephone, #text_password').val('');
    manager.showLogin();
  };
    
  this.saveToken = function(token) {
    window.localStorage.setItem("ittott_token", token);      
    manager.token = token;
  };
}
 