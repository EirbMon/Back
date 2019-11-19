exports.GetDoc = function(req, res){
 var fichierBrut = new XMLHttpRequest();
 const path = "file://" + process.cwd() + "/" + "swagger.json";
 fichierBrut.open("GET", path, true);
 fichierBrut.responseType = 'json';
 fichierBrut.onreadystatechange = function () {
   if(fichierBrut.readyState === 4) {
     if(fichierBrut.status === 200 || fichierBrut.status == 0) {
       console.log(fichierBrut.responseJSON);
       var texteComplet = JSON.parse(fichierBrut.responseText);
       res.json({texteComplet});
      }
    }
  }
  fichierBrut.send();
}
