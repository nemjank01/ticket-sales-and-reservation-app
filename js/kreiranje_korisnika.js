$(function() {

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
    $('#ponovljena_lozinka').on('blur', function(e) {
        let lozinka = $('#lozinka').val();
        let ponovljena_lozinka = $(this).val();
        let greska_ponovljena_lozinka = $('#greska_ponovljena_lozinka');


        if (lozinka === ponovljena_lozinka) {
            $(this).css("outline", "none");
            greska_ponovljena_lozinka.hide();
        }else {
            $(this).css("outline", "solid 5px #D95714FF");
            greska_ponovljena_lozinka.show();
            greska_ponovljena_lozinka.html("Лозинке се не поклапају").css('color', '#D95714FF');
        }
    });

    $('#uloga_korisnika').on("change", function(e){
        //console.log($(this).val());
        if($(this).val() === '2') {
            $('#izaberi_lokaciju').show();

        } else {
            $('#izaberi_lokaciju').hide();
        }
    });

    //Ovaj ajax izvlaci sve lokacije sa servera i ubacuje u izbor korisnika ako izabereulogu blagajnik
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

    $('#forma_kreiranje_korisnika').on('submit', function(e) {
        e.preventDefault();

        let greska_email = $('#greska_email');
        let greska_kreiranje_korisnika = $('#greska_kreiranje_korisnika');

        //Vrednosti iz input polja
        let email = $('#email').val();
        let ime_prezime = $('#ime_prezime').val();
        let telefon = $('#telefon').val();
        let lozinka = $('#lozinka').val();
        let userRole = parseInt($('#uloga_korisnika').val()); //ovde sam morao parseInt posto mi je server vracao gresku da userRoleID mora da bude integer
        let lokacija = $('#izaberi_lokaciju').val();

        //Ovaj deo sa proverom da li je nesto uneto u email nema smisla posto je trazeno da email bude required
        if(email === '') {
            $('#email').css("outline", "solid 5px #D95714FF")
            greska_email.show();
            greska_email.html("Нисте унели имејл");
        } else {
            $('#email').css("outline", "none");
            greska_email.hide();
        }

        let form = new FormData();
        form.append("name", ime_prezime);
        form.append("email", email);
        form.append("phone", telefon);
        form.append("password", lozinka);
        form.append("userRoleId", userRole);
        form.append("locationId", lokacija);
        form.append("apitoken", $('meta[name="apitoken"]').attr("content"));

        $.ajax({
            "url": "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Accept": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "dataType": "json",
            "data": form,
            "success": function(response) {
                //console.log(response);
                if(response.error === undefined) {
                    console.log(response);
                    greska_kreiranje_korisnika.hide();
                    window.location = 'lista_svih_korisnika.html';
                } else {
                    greska_kreiranje_korisnika.show();
                    //console.log('Greska u success ');
                    greska_kreiranje_korisnika.html(response.error).css("color", "#f00");// greska se ispod dugmeta pokazuje crvenom bojom
                }
            },
            "error": function(response) {
                //console.log(response);
                greska_kreiranje_korisnika.show();
                //console.log('Greska u error ');
                greska_kreiranje_korisnika.html(response.error);
            }
        });
    });
});