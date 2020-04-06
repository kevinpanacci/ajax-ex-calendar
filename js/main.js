$(document).ready(function () {

//  Gestire prima e dopo 2018 (i limiti imposti dalle API)
//  Gestire al click la visualizzazione del Mese Precedente
//  Aggiornare le API in base al mese selezionato (Quindi rendere dinamici i DATA della chiamata AJAX)
// Separare le settimane nel Calendario
// Utilizzare li vuoti nel caso non sia Lunedi il primo giorno della settimana
    var htmlGiorno = $('#calendar-template').html();
    var templateGiorno = Handlebars.compile(htmlGiorno);

    var dataIniziale = moment('2018-01-01');

    var limiteIniziale = moment('2018-01-01');
    var limiteFinale = moment('2018-11-30');

    stampaGiorniMese(dataIniziale); // Inizializzazione Calendario
    stampaFestivi(2018, 0);

    $('.mese-succ').prop('disabled', false);
    $('.mese-prec').prop('disabled', true);
    $('.mese-succ').click(function () {
        $('.mese-prec').prop('disabled', false);
        if (dataIniziale.isSameOrAfter(limiteFinale)) {
            alert('Hai provato ad hackerarmi!')
        } else {
            dataIniziale.add(1, 'month');
            stampaGiorniMese(dataIniziale);
            stampaFestivi(dataIniziale.year(), dataIniziale.month());
            if (dataIniziale.isSameOrAfter(limiteFinale)) {
                $('.mese-succ').prop('disabled', true);
            }
        }
    });
//devo controllare che non si vada prima di gennaio 2018
    $('.mese-prec').click(function () {
        $('.mese-succ').prop('disabled', false);
        if (dataIniziale.isSameOrBefore(limiteIniziale)) {
            alert('Hai provato ad hackerarmi!')
        } else {
            dataIniziale.subtract(1, 'month');
            stampaGiorniMese(dataIniziale);
            stampaFestivi(dataIniziale.year(), dataIniziale.month());

            if (dataIniziale.isSameOrBefore(limiteIniziale)) {
                $('.mese-prec').prop('disabled', true);
            }
        }
    });

    function stampaFestivi(year2,month2) {
        $.ajax({
            url: 'https://flynn.boolean.careers/exercises/api/holidays',
            method: 'GET',
            data: {
                year: 2018,
                month: month2
            },
            success: function (data) {
                if(data.response != undefined){
                    var giorniFestivi = data.response;
                    for (var i = 0; i < giorniFestivi.length; i++) {
                        var giornoFestivo = giorniFestivi[i];
                        var nomeFestivo = giornoFestivo.name;
                        var dataFestivo = giornoFestivo.date;
                        var dataFestivo = dataFestivo.replace("2018", year2);
                        $('#calendar li[data-day="' + dataFestivo + '"]').addClass('festivo').append(' - ' + nomeFestivo);
                    }
                }

            }
        });
    }

    function stampaGiorniMese(meseDaStampare) {
        var dayToName = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
        $('#calendar').empty();
        var standardDay = meseDaStampare.clone(); // cloniamo il mese da stampare per poterlo inserire dentro all'attributo data-day
        var giorniMese = meseDaStampare.daysInMonth(); // quanti giorni ci sono nel mese corrente
        var nomeMese = meseDaStampare.format('MMMM'); // prendiamo il nome del mese
        var nomeAnno = meseDaStampare.format('YYYY');
        $('#nome-mese').text(nomeMese); // Aggiorniamo il nome del mese in top calendar
        $('#nome-anno').text(nomeAnno); //Aggiorniamo l'anno
        var primoGiornoMese = meseDaStampare.format('YYYY')+ "-" + meseDaStampare.format('MM')+ "-" + 1;
        var ind = moment(primoGiornoMese).isoWeekday();
        var tot = ind - 1;
        for (var i = 0; i < tot; i++) {
            var giornoDaInserire = {
                day: "",
                dataDay:"",
                weekday:  ""
            }
            var templateFinale = templateGiorno(giornoDaInserire); // Stiamo popolando il template con i dati dell'oggetto
            $('#calendar').append(templateFinale);

        }
        for (var i = 1; i <= giorniMese; i++) {
            var actualdate= meseDaStampare.format('YYYY') + "-" + meseDaStampare.format('MM')+ "-" + i;
            ind = moment(actualdate).isoWeekday();
            var giornoDaInserire = {
                day: i + ' ' + nomeMese,
                dataDay: standardDay.format('YYYY-MM-DD'),
                weekday:  dayToName[ind-1]
            }
            var templateFinale = templateGiorno(giornoDaInserire); // Stiamo popolando il template con i dati dell'oggetto
            $('#calendar').append(templateFinale);
            standardDay.add(1, 'day'); //aggiungo un giorno a ogni ciclo
        }
    }
});
