/**
 * @preserve jQuery DateTimePicker plugin v2.4.1
 * @homepage http://xdsoft.net/jqplugins/datetimepicker/
 * (c) 2014, Chupurnov Valeriy.
 */
/*global document,window,jQuery,setTimeout,clearTimeout*/
(function(a) {
    ('function' == typeof(define) && define.amd) ? define(['jquery', 'moment', 'jquery-mousewheel'], a): 'object' == typeof exports ? module.exports = a : a(jQuery);
})(function($, moment) {
    'use strict';
    var I18N={
        ar: { // Arabic
            months: [
                "كانون الثاني", "شباط", "آذار", "نيسان", "مايو", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"
            ],
            dayOfWeek: [
                "ن", "ث", "ع", "خ", "ج", "س", "ح"
            ]
        },
        ro: { // Romanian
            months: [
                "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"
            ],
            dayOfWeek: [
                "l", "ma", "mi", "j", "v", "s", "d"
            ]
        },
        id: { // Indonesian
            months: [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
            ],
            dayOfWeek: [
                "Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"
            ]
        },
        bg: { // Bulgarian
            months: [
                "Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"
            ],
            dayOfWeek: [
                "Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"
            ]
        },
        fa: { // Persian/Farsi
            months: [
                'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
            ],
            dayOfWeek: [
                'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'
            ]
        },
        ru: { // Russian
            months: [
                'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
            ],
            dayOfWeek: [
                "Вск", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"
            ]
        },
        uk: { // Ukrainian
            months: [
                'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
            ],
            dayOfWeek: [
                "Ндл", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Сбт"
            ]
        },
        en: { // English
            months: [
                "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
            ],
            dayOfWeek: [
                "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
            ]
        },
        el: { // Ελληνικά
            months: [
                "Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"
            ],
            dayOfWeek: [
                "Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"
            ]
        },
        de: { // German
            months: [
                'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
            ],
            dayOfWeek: [
                "So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"
            ]
        },
        nl: { // Dutch
            months: [
                "januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"
            ],
            dayOfWeek: [
                "zo", "ma", "di", "wo", "do", "vr", "za"
            ]
        },
        tr: { // Turkish
            months: [
                "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
            ],
            dayOfWeek: [
                "Paz", "Pts", "Sal", "Çar", "Per", "Cum", "Cts"
            ]
        },
        fr: { //French
            months: [
                "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
            ],
            dayOfWeek: [
                "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"
            ]
        },
        es: { // Spanish
            months: [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ],
            dayOfWeek: [
                "Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"
            ]
        },
        th: { // Thai
            months: [
                'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
            ],
            dayOfWeek: [
                'อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'
            ]
        },
        pl: { // Polish
            months: [
                "styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"
            ],
            dayOfWeek: [
                "nd", "pn", "wt", "śr", "cz", "pt", "sb"
            ]
        },
        pt: { // Portuguese
            months: [
                "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
            ],
            dayOfWeek: [
                "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"
            ]
        },
        ch: { // Simplified Chinese
            months: [
                "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
            ],
            dayOfWeek: [
                "日", "一", "二", "三", "四", "五", "六"
            ]
        },
        se: { // Swedish
            months: [
                "Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"
            ],
            dayOfWeek: [
                "Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"
            ]
        },
        kr: { // Korean
            months: [
                "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
            ],
            dayOfWeek: [
                "일", "월", "화", "수", "목", "금", "토"
            ]
        },
        it: { // Italian
            months: [
                "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
            ],
            dayOfWeek: [
                "Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"
            ]
        },
        da: { // Dansk
            months: [
                "January", "Februar", "Marts", "April", "Maj", "Juni", "July", "August", "September", "Oktober", "November", "December"
            ],
            dayOfWeek: [
                "Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"
            ]
        },
        no: { // Norwegian
            months: [
                "Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"
            ],
            dayOfWeek: [
                "Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"
            ]
        },
        ja: { // Japanese
            months: [
                "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"
            ],
            dayOfWeek: [
                "日", "月", "火", "水", "木", "金", "土"
            ]
        },
        vi: { // Vietnamese
            months: [
                "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
            ],
            dayOfWeek: [
                "CN", "T2", "T3", "T4", "T5", "T6", "T7"
            ]
        },
        sl: { // Slovenščina
            months: [
                "Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"
            ],
            dayOfWeek: [
                "Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"
            ]
        },
        cs: { // Čeština
            months: [
                "Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
            ],
            dayOfWeek: [
                "Ne", "Po", "Út", "St", "Čt", "Pá", "So"
            ]
        },
        hu: { // Hungarian
            months: [
                "Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"
            ],
            dayOfWeek: [
                "Va", "Hé", "Ke", "Sze", "Cs", "Pé", "Szo"
            ]
        },
        az: { //Azerbaijanian (Azeri)
            months: [
                "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
            ],
            dayOfWeek: [
                "B", "Be", "Ça", "Ç", "Ca", "C", "Ş"
            ]
        },
        bs: { //Bosanski
            months: [
                "Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
            ],
            dayOfWeek: [
                "Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"
            ]
        },
        ca: { //Català
            months: [
                "Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
            ],
            dayOfWeek: [
                "Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"
            ]
        },
        'en-GB': { //English (British)
            months: [
                "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
            ],
            dayOfWeek: [
                "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
            ]
        },
        et: { //"Eesti"
            months: [
                "Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni", "Juuli", "August", "September", "Oktoober", "November", "Detsember"
            ],
            dayOfWeek: [
                "P", "E", "T", "K", "N", "R", "L"
            ]
        },
        eu: { //Euskara
            months: [
                "Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua"
            ],
            dayOfWeek: [
                "Ig.", "Al.", "Ar.", "Az.", "Og.", "Or.", "La."
            ]
        },
        fi: { //Finnish (Suomi)
            months: [
                "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
            ],
            dayOfWeek: [
                "Su", "Ma", "Ti", "Ke", "To", "Pe", "La"
            ]
        },
        gl: { //Galego
            months: [
                "Xan", "Feb", "Maz", "Abr", "Mai", "Xun", "Xul", "Ago", "Set", "Out", "Nov", "Dec"
            ],
            dayOfWeek: [
                "Dom", "Lun", "Mar", "Mer", "Xov", "Ven", "Sab"
            ]
        },
        hr: { //Hrvatski
            months: [
                "Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"
            ],
            dayOfWeek: [
                "Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"
            ]
        },
        ko: { //Korean (한국어)
            months: [
                "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
            ],
            dayOfWeek: [
                "일", "월", "화", "수", "목", "금", "토"
            ]
        },
        lt: { //Lithuanian (lietuvių)
            months: [
                "Sausio", "Vasario", "Kovo", "Balandžio", "Gegužės", "Birželio", "Liepos", "Rugpjūčio", "Rugsėjo", "Spalio", "Lapkričio", "Gruodžio"
            ],
            dayOfWeek: [
                "Sek", "Pir", "Ant", "Tre", "Ket", "Pen", "Šeš"
            ]
        },
        lv: { //Latvian (Latviešu)
            months: [
                "Janvāris", "Februāris", "Marts", "Aprīlis ", "Maijs", "Jūnijs", "Jūlijs", "Augusts", "Septembris", "Oktobris", "Novembris", "Decembris"
            ],
            dayOfWeek: [
                "Sv", "Pr", "Ot", "Tr", "Ct", "Pk", "St"
            ]
        },
        mk: { //Macedonian (Македонски)
            months: [
                "јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември"
            ],
            dayOfWeek: [
                "нед", "пон", "вто", "сре", "чет", "пет", "саб"
            ]
        },
        mn: { //Mongolian (Монгол)
            months: [
                "1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"
            ],
            dayOfWeek: [
                "Дав", "Мяг", "Лха", "Пүр", "Бсн", "Бям", "Ням"
            ]
        },
        'pt-BR': { //Português(Brasil)
            months: [
                "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
            ],
            dayOfWeek: [
                "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"
            ]
        },
        sk: { //Slovenčina
            months: [
                "Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"
            ],
            dayOfWeek: [
                "Ne", "Po", "Ut", "St", "Št", "Pi", "So"
            ]
        },
        sq: { //Albanian (Shqip)
            months: [
                "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
            ],
            dayOfWeek: [
                "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
            ]
        },
        'sr-YU': { //Serbian (Srpski)
            months: [
                "Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
            ],
            dayOfWeek: [
                "Ned", "Pon", "Uto", "Sre", "čet", "Pet", "Sub"
            ]
        },
        sr: { //Serbian Cyrillic (Српски)
            months: [
                "јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар"
            ],
            dayOfWeek: [
                "нед", "пон", "уто", "сре", "чет", "пет", "суб"
            ]
        },
        sv: { //Svenska
            months: [
                "Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"
            ],
            dayOfWeek: [
                "Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"
            ]
        },
        'zh-TW': { //Traditional Chinese (繁體中文)
            months: [
                "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
            ],
            dayOfWeek: [
                "日", "一", "二", "三", "四", "五", "六"
            ]
        },
        zh: { //Simplified Chinese (简体中文)
            months: [
                "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
            ],
            dayOfWeek: [
                "日", "一", "二", "三", "四", "五", "六"
            ]
        },
        he: { //Hebrew (עברית)
            months: [
                'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
            ],
            dayOfWeek: [
                'א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'שבת'
            ]
        }
    };

    var getI18n=function(lang, prop){
    	return I18N[lang][prop];
    };
    var setDayOfWeekStart=function(options){
    	if (isNaN(options.dayOfWeekStart)) {
            options.dayOfWeekStart = 0;
        } else {
            options.dayOfWeekStart = parseInt(options.dayOfWeekStart, 10) % 7;
        }
    };
    //= datetimepicker.base.js
    //= parse.js
});
//= https://raw.githubusercontent.com/jquery/jquery-mousewheel/3.1.12/jquery.mousewheel.js