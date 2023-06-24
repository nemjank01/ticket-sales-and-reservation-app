$(function () {
   $('#forma_prijava').on('submit', function(e){
      e.preventDefault();
      //console.log('submitovana prijava');
       //vrednosti iz input polja prijave
       let email = $('#email').val();
       let lozinka = $('#lozinka').val();
       let greska_prijava = $('#greska_prijava');

       let form = new FormData();
       form.append("email", email);
       form.append("password", lozinka);
       form.append("apitoken", $('meta[name="apitoken"]').attr("content"));

       $.ajax({
           "url": "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/login",
           "method": "POST",
           "timeout": 0,
           "headers": {
               "Accept": "application/json"
           },
           "processData": false,
           "mimeType": "multipart/form-data",
           "contentType": false,
           "dataType":"json",
           "data": form,
           "success": function(response) {
               //console.log(response.error);

               if(response.error === undefined) {
                   greska_prijava.hide();
                   localStorage.setItem("token", response.token);
                   localStorage.setItem("type", response.type);
                   if(localStorage.getItem('type') === 'администратор') {
                       window.location = 'admin_stranica.html';
                   } else if(localStorage.getItem('type') === 'благајник'){
                       window.location = 'blagajnik.html';
                   } else if(localStorage.getItem('type') === 'регистровани корисник'){
                       window.location = 'registrovani_korisnik.html';
                   } else if(localStorage.getItem('type') === 'блокирани корисник'){
                       window.location = 'blokirani_korisnik.html';
                   }
               } else {
                   greska_prijava.show();
                   greska_prijava.html().html(response.error).css("color", "#f00");
               }

           },
           "error": function(response){
               //console.log(response.responseJSON.error);
               greska_prijava.show();
               greska_prijava.html(response.responseJSON.error).css("color", "#f00");
               lozinka = ' ';
           }
       });
   });
});
