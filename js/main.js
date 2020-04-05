$(document).ready(function () {

//  Gestire prima e dopo 2018 (i limiti imposti dalle API)
//  Gestire al click la visualizzazione del Mese Precedente
//  Aggiornare le API in base al mese selezionato (Quindi rendere dinamici i DATA della chiamata AJAX)

    var htmlGiorno = $('#calendar-template').html();
    var templateGiorno = Handlebars.compile(htmlGiorno);

    var dataIniziale = moment('2018-01-01');

    stampaGiorniMese(dataIniziale); // Inizializzazione Calendario
    stampaFestivi(2018, 0);
    $('.mese-succ').click(function () {
        dataIniziale.add(1, 'month');
        stampaGiorniMese(dataIniziale);
            stampaFestivi(dataIniziale.year(), dataIniziale.month());
    });

    $('.mese-prec').click(function () {
        dataIniziale.subtract(1, 'month');
        stampaGiorniMese(dataIniziale);
            stampaFestivi(dataIniziale.year(), dataIniziale.month());
    });

    function stampaFestivi(year_,month_) {
        $.ajax({
            url: 'https://flynn.boolean.careers/exercises/api/holidays',
            method: 'GET',
            data: {
                year: 2018,
                month: month_
            },
            success: function (data) {
                if(data.response != undefined){
                    var giorniFestivi = data.response;
                    for (var i = 0; i < giorniFestivi.length; i++) {
                        var giornoFestivo = giorniFestivi[i];
                        var nomeFestivo = giornoFestivo.name;
                        var dataFestivo = giornoFestivo.date;
                        dataFestivo = dataFestivo.replace("2018", year_);
                        $('#calendar li[data-day="' + dataFestivo + '"]').addClass('festivo').append(' - ' + nomeFestivo);
                    }
                }

            }
        });
    }

    function stampaGiorniMese(meseDaStampare) {
        $('#calendar').empty();
        var standardDay = meseDaStampare.clone();
        var giorniMese = meseDaStampare.daysInMonth();
        var nomeMese = meseDaStampare.format('MMMM');
        var nomeAnno = meseDaStampare.format('YYYY');
        $('#nome-mese').text(nomeMese); // Aggiorniamo il nome del mese in top calendar
        $('#nome-anno').text(nomeAnno);
        for (var i = 1; i <= giorniMese; i++) {
            // $('#calendar').append('<li>' + i + ' ' + nomeMese + '</li>');
            var giornoDaInserire = {
                day: i + ' ' + nomeMese,
                dataDay: standardDay.format('YYYY-MM-DD')
            }
            var templateFinale = templateGiorno(giornoDaInserire); // Stiamo popolando il template con i dati dell'oggetto
            $('#calendar').append(templateFinale);
            standardDay.add(1, 'day');
        }
    }
});
