$(function () {

    $.ajax({
        "url": "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/lokacija?apitoken=" + $('meta[name="apitoken"]').attr("content"),
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        "success": function (response) {
            console.log(response);

            dodajVreme = function(lista) {
                lista.forEach((elem,index) => {
                   $('.radno-vreme').append('<span>Dan ' + elem.dan + ': Od: ' + elem.od + ' Do: ' + elem.do + '</span> <br>');
                });
            }

            let tabela_sdrzaj = $('#tabela-sadrzaj');
            response.forEach((elem, index) => {
            tabela_sdrzaj.append('<tr>' +'<td>' + elem.id + '</td>' +  '<td>' + elem.naziv + '</td>' +  '<td>' + elem.grad +  '</td>'+'<td>' + elem.adresa + '</td>'+ '<td>' + elem.opis + '</td>' + '<td class="radno-vreme">' + elem.radnoVreme + '</td>' +
                '<td>' + elem.blagajnici.length + '</td>' + '<td>' + elem.dogadjaji.length + '</td>' + '<td>' + elem.dogadjaji.length + '</td>' +
                '<td>' + '<button class="izmeni-btn" data-id="' + elem.id + '" data-naziv="' + elem.naziv + '" data-adresa="' + elem.adresa + '" data-grad="' + elem.grad + '" data-opis="' + elem.opis + '" data-radnoVreme="' + elem.radnoVreme +'">'
                + 'Izmeni' + '</button>' + '<button class="obrisi-btn" data-id="' + elem.id + '">' + 'Obrisi' + '</button>'+ '</td>' +  '</tr>')
            });

            let izmeni_btn = $(".izmeni-btn");
            let obrisi_btn = $(".obrisi-btn");

            //Izmena lokacije
            izmeni_btn.on("click", function (e) {

                $.ajax({
                    "url": "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/lokacija/" + $(this).attr('data-id') +"?apitoken=" + $('meta[name="apitoken"]').attr('content'),
                    "method": "GET",
                    "timeout": 0,
                    "headers": {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    "success": function (response) {
                        console.log(response);
                        localStorage.setItem("lokacija_id", response.id);
                        localStorage.setItem("lokacija_naziv", response.naziv);
                        localStorage.setItem("lokacija_adresa", response.adresa);
                        localStorage.setItem("lokacija_grad", response.grad);
                        localStorage.setItem("lokacija_opis", response.opis);
                        localStorage.setItem("lokacija_radnoVreme", response.radnoVreme);

                        window.location = "azuriranje_lokacije.html";
                    },
                    "error": function (response) {
                        console.log(response);
                    }
                });
            })

            //Brisanje lokacije
            obrisi_btn.on("click", function (e) {

                let form = new FormData();
                form.append("id", $(this).attr('data-id'));
                form.append("apitoken", $('meta[name="apitoken"]').attr('content'));

                $.ajax({
                    "url": "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/lokacija/" + $(this).attr('data-id') +"?apitoken=" + $('meta[name="apitoken"]').attr('content'),
                    "method": "DELETE",
                    "timeout": 0,
                    "headers": {
                        "Accept": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form,
                    "success": function (response) {
                        console.log(response);
                        alert("Локација успешно обрисана");
                    },
                    "error": function (response) {
                        console.log(response);
                    }
                });

            });

        },
        "error": function (response) {
            console.log(response);
        }
    });
});