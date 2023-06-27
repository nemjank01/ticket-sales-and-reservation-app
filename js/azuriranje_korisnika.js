$(function () {
   $('#id_korisnika').val(localStorage.getItem("user_id"));
   $('#ime_prezime').val(localStorage.getItem("user_name"));
   $('#email').val(localStorage.getItem("user_email"));
   $('#telefon').val(localStorage.getItem("user_phone"));
   // console.log(typeof(localStorage.getItem("user_roleID")));
   // console.log(localStorage.getItem("user_roleID"));
   if(localStorage.getItem("user_roleID") === "2") {
      $('#izaberi_lokaciju').show();
   } else {
      $('#izaberi_lokaciju').hide();
      $('#uloga_korisnika').val(localStorage.getItem("user_roleID"));
   }

   //Provera ispravnosti unetih podataka
   $('#ime_prezime').on('blur', function(e) {
      let greska_ime_prezime = $('#greska_imePrezime');
      let ispravnost_ime_prezime = /(?=^.{5,180}$)^[А-ЯЉЊШЂЧЋЖЏ][а-яčćžđšљњшђчћжџ]+(?:[\s-][А-ЯЉЊШЂЧЋЖЏ][а-яčćžđšљњшђчћжџ]+)+$|^[A-ZŠĐŽČĆ][a-zčćžđš]+(?:[\s-][A-ZŠĐŽČĆ][a-zčćžđš]+)+$/.test($(this).val());

      if (ispravnost_ime_prezime) {
         $(this).css("outline", "none");
         greska_ime_prezime.hide();
      }else {
         $(this).css("outline", "solid 5px #D95714FF");
         greska_ime_prezime.show();
         greska_ime_prezime.html("Име и презиме није правилно написано").css('color', '#D95714FF');
      }
   });
   $('#telefon').on('blur', function(e) {
      let greska_telefon = $('#greska_telefon');
      let ispravnost_telefon = /^[+][1-9][0-9][0-9]{7,12}$/.test($(this).val());

      if (ispravnost_telefon || $(this).val() === '') {
         $(this).css("outline", "none");
         greska_telefon.hide();
      }else {
         $(this).css("outline", "solid 5px #D95714FF");
         greska_telefon.show();
         greska_telefon.html("Телефон није исправан").css('color', '#D95714FF');

      }
   });
   $('#lozinka').on('blur', function(e) {
      let greska_lozinka = $('#greska_lozinka');
      let ispravnost_lozinka = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,}$/.test($(this).val());

      if (ispravnost_lozinka) {
         $(this).css("outline", "none");
         greska_lozinka.hide();
      }else {
         $(this).css("outline", "solid 5px #D95714FF");
         greska_lozinka.show();
         greska_lozinka.html("Лозинка није довољно јака").css('color', '#D95714FF');
      }
   });
   $('#uloga_korisnika').on('change', function (e) {
      if($('#uloga_korisnika').val() === "2"){
         $('#izaberi_lokaciju').show();
      } else {
         $('#izaberi_lokaciju').hide();
      }
   });

   //Ovaj ajax izvlaci sve lokacije sa servera i ubacuje u izbor korisnika ako izabere ulogu blagajnik
   $.ajax({
      "url": "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/lokacija?apitoken=" + $('meta[name="apitoken"]').attr("content"),
      "method": "GET",
      "timeout": 0,
      "headers": {
         "Accept": "application/json",
         "Authorization": "Bearer " +localStorage.getItem("token")
      },
      "success": function (response) {
         //console.log(response);
         response.forEach((elem,index) => {
            $('#izaberi_lokaciju').append('<option value="' + elem.id + '"> ' + elem.naziv + ' </option>>');
         })
      },
      "error": function (response) {
         console.log(response);
      }
   });

   let forma_azuriranje = $("#forma_azuriranje");
   forma_azuriranje.on("submit", function (e) {
      e.preventDefault();
      // console.log($("#uloga_korisnika").val());
      // console.log(typeof($("#uloga_korisnika").val()));
      let greska_azuriranje = $('#greska_azuriranje');
      let uspesno_azuriranje = $('#uspesno_azuriranje');

      $.ajax({
         "url": "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik/" + localStorage.getItem("user_id"),
         "method": "PATCH",
         "timeout": 0,
         "headers": {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer " + localStorage.getItem("token")
         },
         "data": {
            "name": $('#ime_prezime').val(),
            "email": $('#email').val(),
            "phone": $('#telefon').val(),
            "password": $('#lozinka').val(),
            "userRoleId": parseInt($("#uloga_korisnika").val()),
            "locationId": parseInt($("#izaberi_lokaciju").val()),
            "apitoken": $('meta[name="apitoken"]').attr("content")
         },
         "success": function (response) {
            console.log(response);
            greska_azuriranje.hide();
            uspesno_azuriranje.show();
            uspesno_azuriranje.html("Успешно сте сачували податке.").css("color", "#0f0");

         },
         "error": function (response) {
            console.log(response);
            uspesno_azuriranje.hide();
            greska_azuriranje.show();
            greska_azuriranje.html(response.responseJSON.message).css("color", "#f00");
         }
      });
   })


});