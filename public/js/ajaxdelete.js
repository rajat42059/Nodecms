$(document).ready(function(){
  $('.delete-article').on('click', function(e){


    $target = $(e.target);
    const id = $target.attr('data-id');
  
    $.ajax({
      type:'DELETE',
      url: '/dna/delete/'+id,

      success: function(response){

        var check=response.data;
        if ( check === '1' ) {        
          window.location = "/dna";        
          
        } 
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
