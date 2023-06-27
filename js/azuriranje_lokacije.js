$(function() {
    $('#naziv_lokacije').val(localStorage.getItem("lokacija_naziv"));
    $('#adresa').val(localStorage.getItem("lokacija_adresa"));
    $('#grad').val(localStorage.getItem("lokacija_grad"));
    $('#opis').val(localStorage.getItem("lokacija_opis"));

    //Pretvaranje sati i minuti u minute i dodavanje u JSON
    let radna_vremena = [];
    let dan;
    let vreme_od = 0;
    let vreme_do = 0;

    //Za ponedeljak
    $('#minuti_do_pon').on("blur", function(e) {

        dan = "1";
        vreme_od = parseInt($('#sati_od_pon').val()) * 60 + parseInt($('#minuti_od_pon').val());
        vreme_do = parseInt($('#sati_do_pon').val()) * 60 + parseInt($('#minuti_do_pon').val());

        radna_vremena.push({
            "dan": dan,
            "od": vreme_od,
            "do": vreme_do
        });
        //console.log(radna_vremena);
    });
    //Za utorak
    $('#minuti_do_uto').on("blur", function(e) {

        dan = "2";
        vreme_od = parseInt($('#sati_od_uto').val()) * 60 + parseInt($('#minuti_od_uto').val());
        vreme_do = parseInt($('#sati_do_uto').val()) * 60 + parseInt($('#minuti_do_uto').val());

        radna_vremena.push({
            "dan": dan,
            "od": vreme_od,
            "do": vreme_do
        });
        //console.log(radna_vremena);
    });
    //Za sredu
    $('#minuti_do_sre').on("blur", function(e) {

        dan = "3";
        vreme_od = parseInt($('#sati_od_sre').val()) * 60 + parseInt($('#minuti_od_sre').val());
        vreme_do = parseInt($('#sati_do_sre').val()) * 60 + parseInt($('#minuti_do_sre').val());

        radna_vremena.push({
            "dan": dan,
            "od": vreme_od,
            "do": vreme_do
        });
        //console.log(radna_vremena);
    });
    //Za cetvrtak
    $('#minuti_do_cet').on("blur", function(e) {

        dan = "4";
        vreme_od = parseInt($('#sati_od_cet').val()) * 60 + parseInt($('#minuti_od_cet').val());
        vreme_do = parseInt($('#sati_do_cet').val()) * 60 + parseInt($('#minuti_do_cet').val());

        radna_vremena.push({
            "dan": dan,
            "od": vreme_od,
            "do": vreme_do
        });
        //console.log(radna_vremena);
    });
    //Za petak
    $('#minuti_do_pet').on("blur", function(e) {

        dan = "5";
        vreme_od = parseInt($('#sati_od_pet').val()) * 60 + parseInt($('#minuti_od_pet').val());
        vreme_do = parseInt($('#sati_do_pet').val()) * 60 + parseInt($('#minuti_do_pet').val());

        radna_vremena.push({
            "dan": dan,
            "od": vreme_od,
            "do": vreme_do
        });
        //console.log(radna_vremena);
    });
    //Za subotu
    $('#minuti_do_sub').on("blur", function(e) {

        dan = "6";
        vreme_od = parseInt($('#sati_od_sub').val()) * 60 + parseInt($('#minuti_od_sub').val());
        vreme_do = parseInt($('#sati_do_sub').val()) * 60 + parseInt($('#minuti_do_sub').val());

        radna_vremena.push({
            "dan": dan,
            "od": vreme_od,
            "do": vreme_do
        });
        //console.log(radna_vremena);
    });
    //Za nedelju
    $('#minuti_do_ned').on("blur", function(e) {

        dan = "7";
        vreme_od = parseInt($('#sati_od_ned').val()) * 60 + parseInt($('#minuti_od_ned').val());
        vreme_do = parseInt($('#sati_do_ned').val()) * 60 + parseInt($('#minuti_do_ned').val());

        radna_vremena.push({
            "dan": dan,
            "od": vreme_od,
            "do": vreme_do
        });
        //console.log(radna_vremena);
    });

    let forma_azuriranje = $("#forma_azuriranje");
    forma_azuriranje.on("submit", function (e) {
        e.preventDefault();

        let greska_azuriranje = $('#greska_azuriranje');
        let uspesno_azuriranje = $('#uspesno_azuriranje');


        $.ajax({
            "url": "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/lokacija/" + localStorage.getItem("lokacija_id"),
            "method": "PATCH",
            "timeout": 0,
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            "data": {
                "name": $('#naziv_lokacije').val(),
                "address": $('#adresa').val(),
                "city": $('#grad').val(),
                "description": $('#opis').val(),
                "workingHours": JSON.stringify(radna_vremena),
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
    });
});