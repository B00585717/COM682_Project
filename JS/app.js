//The URIs of the REST endpoint
AUPS = "https://prod-16.uksouth.logic.azure.com:443/workflows/3766a0c05bdc45a6b866cb35a785d5fa/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2N4Imhjf4x4xDQqN-DimtVkzzPTBUKcGsTQsckAcI1k";
RAA = "https://prod-12.uksouth.logic.azure.com:443/workflows/434582bdc4284ca5b85b86f99d90d00f/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RWj02DLZ6gCu2hoe-DPkLmGkQs6CSSQpRJineO7sqTY";
DIAURI0 = "https://prod-21.uksouth.logic.azure.com/workflows/f0272b3654374c7095b154c269eb9054/triggers/manual/paths/invoke/";
DIAURI1 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=r6QDwgf04az3Dswc84OOybYX3iO_rAC_QzpD-Pg0SBE";

BLOB_ACCOUNT = "https://b00585717blobstorage.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(function() {

 
  $("#retVideos").click(function(){

      //Run the get asset list function
      getVideos();

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewAsset();
    
  }); 
});

//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){

  //Create a form data object
   submitData = new FormData();

   //Get form variables and append them to the form data object
   submitData.append('Title', $('#Title').val());
   submitData.append('genre', $('#genre').val());
   submitData.append('publisher', $('#publisher').val());
   submitData.append('ageRating', $('#ageRating').val());
   submitData.append('File', $("#UpFile")[0].files[0]);
  
   //Post the form data to the endpoint, note the need to set the content type header
   $.ajax({
    url: AUPS,
    data: submitData,
    cache: false,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    type: 'POST',
    success: function(data){}
  });
}

function getVideos(){

  //Replace the current HTML in that div with a loading message
   $('#VideoList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');
   $.getJSON(RAA, function( data ) {

   //Create an array to hold all the retrieved assets
   var items = [];
  
   //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
   $.each( data, function( key, val ) {
   items.push( "<hr />");
   items.push( "<video src='" + BLOB_ACCOUNT + val["filePath"] +"' width='750' autoplay /></video> <br />")
   items.push( "Title : " + val["title"] + "<br />");
   items.push( "Uploaded by: " + val["publisher"] + "<br />");
   items.push( "Genre: "+ val["genre"]+"<br />");
   items.push( "Rating: " + val["ageRating"]+"<br />");
   items.push( '<button type="button" onClick="deleteAsset(\''+val["id"]+'\')">Delete</button> <br/><br/>');
   items.push( "<hr />");
   });
   //Clear the assetlist div
   $('#VideoList').empty();
   //Append the contents of the items array to the VideoList Div
   $( "<ul/>", {"class": "my-new-list",html: items.join("")}).appendTo("#VideoList");
   });
  }

  function deleteAsset(id){
    $.ajax({
      type: "DELETE",
      //Note the need to concatenate the
      url: DIAURI0 + id + DIAURI1,
      }).done(function( msg ) {
      //On success, update the assetlist.
      getVideos();
    });
  }