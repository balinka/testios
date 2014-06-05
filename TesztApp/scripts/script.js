$(document).ready(function(){
  $(".tabControl a").click(function(){
    number = $(this).prevAll("a").length;
    
    $(".tabControl a").removeClass("active");
    $(this).addClass("active");
    $(".tab").hide();
    $(".tab:eq("+number+")").show();
        
    
    return false;
  });
});