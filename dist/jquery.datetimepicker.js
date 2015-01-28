/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.12
 *
 * Requires: jQuery 1.2.2+
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define('jquery.mousewheel',['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));
/**
 * @preserve jQuery DateTimePicker plugin v2.4.1
 * @homepage http://xdsoft.net/jqplugins/datetimepicker/
 * (c) 2014, Chupurnov Valeriy.
 */
/*global document,window,jQuery,setTimeout,clearTimeout*/
(function(a) {
    ('function' == typeof(define) && define.amd) ? define(['jquery','jquery.mousewheel'], a): 'object' == typeof exports ? module.exports = a : a(jQuery);
})(function($, moment) {
    'use strict';
    var defaultFormat='Y/m/d H:i',
    defaultFormatTime='H:i',
    defaultFormatDate='Y/m/d';
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
    
    var xde = {
        'keyup': 'keyup.xdsoftctrl',
        'afterOpen': 'afterOpen.xdsoft',
        'blur': 'blur.xdsoft',
        'changedatetime': 'changedatetime.xdsoft',
        'click': 'click.xdsoft',
        'close': 'close.xdsoft',
        'dblclick': 'dblclick.xdsoft',
        'focusin': 'focusin.xdsoft',
        'generate': 'generate.xdsoft',
        'keydown': 'keydown.xdsoft',
        'mousedown': 'mousedown.xdsoft',
        'mouseup': 'mouseup.xdsoft',
        'mousewheel': 'mousewheel.xdsoft',
        'open': 'open.xdsoft',
        'resize': 'resize.xdsoft',
        'toggle': 'toggle.xdsoft',
        'xchange': 'xchange.xdsoft',
        'error_input': 'error_input.xdsoft',
        'select': 'select.xdsoft',
        'resize_scroll': 'resize_scroll.xdsoft_scroller',
        'scroll_element': 'scroll_element.xdsoft_scroller',
        'scroller': {
            'mousedown': 'mousedown.xdsoft_scroller',
            'mousemove': 'mousemove.xdsoft_scroller',
            'mouseup': 'mouseup.xdsoft_scroller',
            'resize_scroll': 'resize_scroll.xdsoft_scroller',
            'scroll_element': 'scroll_element.xdsoft_scroller',
            'touchstart': 'touchstart.xdsoft_scroller'
        },
        'ctrl': {
            'keydown': 'keydown.xdsoftctrl',
            'keyup': 'keyup.xdsoftctrl'
        }
    };
    var xdc = {
        'calendar': 'xdsoft_calendar',
        'copyright': 'xdsoft_copyright',
        'current': 'xdsoft_current',
        'date': 'xdsoft_date',
        'datepicker': 'xdsoft_datepicker',
        'datetime': 'xdsoft_datetime',
        'datetimepicker': 'xdsoft_datetimepicker',
        'day_of_week': 'xdsoft_day_of_week',
        'disabled': 'xdsoft_disabled',
        'init_time': 'xdsoft_init_time',
        'inline': 'xdsoft_inline',
        'label': 'xdsoft_label',
        'month': 'xdsoft_month',
        'monthselect': 'xdsoft_monthselect',
        'monthpicker': 'xdsoft_monthpicker',
        'next': 'xdsoft_next',
        'noselect': 'xdsoft_noselect',
        'option': 'xdsoft_option',
        'other_month': 'xdsoft_other_month',
        'prev': 'xdsoft_prev',
        'scrollbar': 'xdsoft_scrollbar',
        'scroller': 'xdsoft_scroller',
        'scroller_box': 'xdsoft_scroller_box',
        'select': 'xdsoft_select',
        'showweeks': 'xdsoft_showweeks',
        'time': 'xdsoft_time',
        'time_box': 'xdsoft_time_box',
        'time_variant': 'xdsoft_time_variant',
        'timepicker': 'xdsoft_timepicker',
        'today': 'xdsoft_today',
        'today_button': 'xdsoft_today_button',
        'weekend': 'xdsoft_weekend',
        'year': 'xdsoft_year',
        'yearselect': 'xdsoft_yearselect',
    };
    var XDSOFT = '.xdsoft';
    var default_options = {
        i18n: I18N,
        template: {
            datepicker: function() {
                return '<div class="' + xdc.datepicker + ' active"></div>';
            },
            month_picker: function() {
                return '<div class="' + xdc.monthpicker + '"><button type="button" class="' + xdc.prev + '"></button><button type="button" class="' + xdc.today_button + '"></button>' +
                    '<div class="' + xdc.label + ' ' + xdc.month + '"><span></span><i></i></div>' +
                    '<div class="' + xdc.label + ' ' + xdc.year + '"><span></span><i></i></div>' +
                    '<button type="button" class="' + xdc.next + '"></button></div>';
            },
            calendar: function() {
                return '<div class="' + xdc.calendar + '"></div>';
            },
            timepicker: function() {
                return '<div class="' + xdc.timepicker + ' active"><button type="button" class="' + xdc.prev + '"></button><div class="' + xdc.time_box + '"></div><button type="button" class="' + xdc.next + '"></button></div>';
            },
            timebox: function() {
                return '<div class="' + xdc.time_variant + '"></div>';
            },
            monthselect: function() {
                return '<div class="' + xdc.select + ' ' + xdc.monthselect + '"><div></div></div>';
            },
            yearselect: function() {
                return '<div class="' + xdc.select + ' ' + xdc.yearselect + '"><div></div></div>';
            }
        },
        value: '',
        lang: 'en',
    
        format:defaultFormat,
        formatTime:defaultFormatTime,
        formatDate:defaultFormatDate,
    
        startDate: false, // new Date(), '1986/12/08', '-1970/01/05','-1970/01/05',
        step: 60,
        monthChangeSpinner: true,
    
        closeOnDateSelect: false,
        closeOnWithoutClick: true,
        closeOnInputClick: true,
    
        timepicker: true,
        datepicker: true,
        weeks: false,
    
        defaultTime: false, // use formatTime format (ex. '10:00' for formatTime: 'H:i')
        defaultDate: false, // use formatDate format (ex new Date() or '1986/12/08' or '-1970/01/05' or '-1970/01/05')
    
        minDate: false,
        maxDate: false,
        minTime: false,
        maxTime: false,
    
        allowTimes: [],
        opened: false,
        initTime: true,
        inline: false,
        theme: '',
    
        onSelectDate: function() {},
        onSelectTime: function() {},
        onChangeMonth: function() {},
        onChangeYear: function() {},
        onChangeDateTime: function() {},
        onShow: function() {},
        onClose: function() {},
        onGenerate: function() {},
    
        withoutCopyright: true,
        inverseButton: false,
        hours12: false,
        next: xdc.next,
        prev: xdc.prev,
        dayOfWeekStart: 0,
        parentID: 'body',
        timeHeightInTimePicker: 25,
        timepickerScrollbar: true,
        todayButton: true,
        defaultSelect: true,
    
        scrollMonth: true,
        scrollTime: true,
        scrollInput: true,
    
        lazyInit: false,
        mask: false,
        validateOnBlur: true,
        allowBlank: true,
        yearStart: 1950,
        yearEnd: 2050,
        style: '',
        id: '',
        fixed: false,
        roundTime: 'round', // ceil, floor
        className: '',
        weekends: [],
        disabledDates: [],
        yearOffset: 0,
        beforeShowDay: null,
    
        enterLikeTab: true
    };
    // fix for ie8
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
            var i, j;
            for (i = (start || 0), j = this.length; i < j; i += 1) {
                if (this[i] === obj) {
                    return i;
                }
            }
            return -1;
        };
    }
    Date.prototype.countDaysInMonth = function() {
        return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
    };
    $.fn.xdsoftScroller = function(percent) {
        return this.each(function() {
            var timeboxparent = $(this),
                pointerEventToXY = function(e) {
                    var out = {
                            x: 0,
                            y: 0
                        },
                        touch;
                    if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
                        touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                        out.x = touch.clientX;
                        out.y = touch.clientY;
                    } else if (e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
                        out.x = e.clientX;
                        out.y = e.clientY;
                    }
                    return out;
                },
                move = 0,
                timebox,
                parentHeight,
                height,
                scrollbar,
                scroller,
                maximumOffset = 100,
                start = false,
                startY = 0,
                startTop = 0,
                h1 = 0,
                touchStart = false,
                startTopScroll = 0,
                calcOffset = function() {};
            if (percent === 'hide') {
                timeboxparent.find('.' + xdc.scrollbar).hide();
                return;
            }
            if (!$(this).hasClass(xdc.scroller_box)) {
                timebox = timeboxparent.children().eq(0);
                parentHeight = timeboxparent[0].clientHeight;
                height = timebox[0].offsetHeight;
                scrollbar = $('<div class="' + xdc.scrollbar + '"></div>');
                scroller = $('<div class="' + xdc.scroller + '"></div>');
                scrollbar.append(scroller);
    
                timeboxparent.addClass(xdc.scroller_box).append(scrollbar);
                calcOffset = function calcOffset(event) {
                    var offset = pointerEventToXY(event).y - startY + startTopScroll;
                    if (offset < 0) {
                        offset = 0;
                    }
                    if (offset + scroller[0].offsetHeight > h1) {
                        offset = h1 - scroller[0].offsetHeight;
                    }
                    timeboxparent.trigger(xde.scroller.scroll_element, [maximumOffset ? offset / maximumOffset : 0]);
                };
    
                scroller
                    .on([xde.scroller.touchstart, xde.scroller.mousedown].join(' '), function(event) {
                        if (!parentHeight) {
                            timeboxparent.trigger(xde.scroller.resize_scroll, [percent]);
                        }
    
                        startY = pointerEventToXY(event).y;
                        startTopScroll = parseInt(scroller.css('margin-top'), 10);
                        h1 = scrollbar[0].offsetHeight;
    
                        if (event.type === 'mousedown') {
                            if (document) {
                                $(document.body).addClass(xdc.noselect);
                            }
                            $([document.body, window]).on(xde.scroller.mouseup, function arguments_callee() {
                                $([document.body, window]).off(xde.scroller.mouseup, arguments_callee)
                                    .off(xde.scroller.mousemove, calcOffset)
                                    .removeClass(xdc.noselect);
                            });
                            $(document.body).on(xde.scroller.mousemove, calcOffset);
                        } else {
                            touchStart = true;
                            event.stopPropagation();
                            event.preventDefault();
                        }
                    })
                    .on('touchmove', function(event) {
                        if (touchStart) {
                            event.preventDefault();
                            calcOffset(event);
                        }
                    })
                    .on('touchend touchcancel', function(event) {
                        touchStart = false;
                        startTopScroll = 0;
                    });
    
                timeboxparent
                    .on(xde.scroller.scroll_element, function(event, percentage) {
                        if (!parentHeight) {
                            timeboxparent.trigger(xde.scroller.resize_scroll, [percentage, true]);
                        }
                        percentage = percentage > 1 ? 1 : (percentage < 0 || isNaN(percentage)) ? 0 : percentage;
    
                        scroller.css('margin-top', maximumOffset * percentage);
    
                        setTimeout(function() {
                            timebox.css('marginTop', -parseInt((timebox[0].offsetHeight - parentHeight) * percentage, 10));
                        }, 10);
                    })
                    .on(xde.scroller.resize_scroll, function(event, percentage, noTriggerScroll) {
                        var percent, sh;
                        parentHeight = timeboxparent[0].clientHeight;
                        height = timebox[0].offsetHeight;
                        percent = parentHeight / height;
                        sh = percent * scrollbar[0].offsetHeight;
                        if (percent > 1) {
                            scroller.hide();
                        } else {
                            scroller.show();
                            scroller.css('height', parseInt(sh > 10 ? sh : 10, 10));
                            maximumOffset = scrollbar[0].offsetHeight - scroller[0].offsetHeight;
                            if (noTriggerScroll !== true) {
                                timeboxparent.trigger(xde.scroller.scroll_element, [percentage || Math.abs(parseInt(timebox.css('marginTop'), 10)) / (height - parentHeight)]);
                            }
                        }
                    });
    
                timeboxparent.on('mousewheel', function(event) {
                    var top = Math.abs(parseInt(timebox.css('marginTop'), 10));
    
                    top = top - (event.deltaY * 20);
                    if (top < 0) {
                        top = 0;
                    }
    
                    timeboxparent.trigger(xde.scroller.scroll_element, [top / (height - parentHeight)]);
                    event.stopPropagation();
                    return false;
                });
    
                timeboxparent.on('touchstart', function(event) {
                    start = pointerEventToXY(event);
                    startTop = Math.abs(parseInt(timebox.css('marginTop'), 10));
                });
    
                timeboxparent.on('touchmove', function(event) {
                    if (start) {
                        event.preventDefault();
                        var coord = pointerEventToXY(event);
                        timeboxparent.trigger(xde.scroller.scroll_element, [(startTop - (coord.y - start.y)) / (height - parentHeight)]);
                    }
                });
    
                timeboxparent.on('touchend touchcancel', function(event) {
                    start = false;
                    startTop = 0;
                });
            }
            timeboxparent.trigger(xde.scroller.resize_scroll, [percent]);
        });
    };
    
    $.fn.datetimepicker = function(opt) {
        var KEY0 = 48,
            KEY9 = 57,
            _KEY0 = 96,
            _KEY9 = 105,
            CTRLKEY = 17,
            DEL = 46,
            ENTER = 13,
            ESC = 27,
            BACKSPACE = 8,
            ARROWLEFT = 37,
            ARROWUP = 38,
            ARROWRIGHT = 39,
            ARROWDOWN = 40,
            TAB = 9,
            F5 = 116,
            AKEY = 65,
            CKEY = 67,
            VKEY = 86,
            ZKEY = 90,
            YKEY = 89,
            ctrlDown = false,
            options = ($.isPlainObject(opt) || !opt) ? $.extend(true, {}, default_options, opt) : $.extend(true, {}, default_options),
    
            lazyInitTimer = 0,
            createDateTimePicker,
            destroyDateTimePicker,
    
            lazyInit = function(input) {
                input
                    .on([xde.open, xde.focusin, xde.mousedown].join(' '), function initOnActionCallback(event) {
                        if (input.is(':disabled') || input.data(xdc.datetimepicker)) {
                            return;
                        }
                        clearTimeout(lazyInitTimer);
                        lazyInitTimer = setTimeout(function() {
    
                            if (!input.data(xdc.datetimepicker)) {
                                createDateTimePicker(input);
                            }
                            input
                                .off([xde.open, xde.focusin, xde.mousedown].join(' '), initOnActionCallback)
                                .trigger(xde.open);
                        }, 100);
                    });
            };
        var xdsoft_copyright = '<div class="' + xdc.copyright + '"><a target="_blank" href="http://xdsoft.net/jqplugins/datetimepicker/">xdsoft.net</a></div>';
        createDateTimePicker = function(input) {
            var datetimepicker = $('<div ' + (options.id ? 'id="' + options.id + '"' : '') + ' ' + (options.style ? 'style="' + options.style + '"' : '') + ' class="' + xdc.datetimepicker + ' xdsoft_' + options.theme + ' ' + xdc.noselect + ' ' + (options.weeks ? ' ' + xdc.showweeks + '' : '') + options.className + '"></div>'),
                xdsoft_copyright = $(xdsoft_copyright),
                datepicker = $(options.template.datepicker()),
                month_picker = $(options.template.month_picker()),
                calendar = $(options.template.calendar()),
                timepicker = $(options.template.timepicker()),
                timeboxparent = timepicker.find('.' + xdc.time_box).eq(0),
                timebox = $(options.template.timebox()),
                /*scrollbar = $('<div class="'+xdc.scrollbar+'"></div>'),
                scroller = $('<div class="'+xdc.scroller+'"></div>'),*/
                monthselect = $(options.template.monthselect()),
                yearselect = $(options.template.yearselect()),
                triggerAfterOpen = false,
                XDSoft_datetime,
                //scroll_element,
                xchangeTimer,
                timerclick,
                current_time_index,
                setPos,
                timer = 0,
                timer1 = 0,
                _xdsoft_datetime;
    
            month_picker
                .find('.' + xdc.month + ' span')
                .after(monthselect);
            month_picker
                .find('.' + xdc.year + ' span')
                .after(yearselect);
    
            month_picker
                .find('.' + xdc.month + ',.' + xdc.year)
                .on(xde.mousedown, function(event) {
                    var select = $(this).find('.' + xdc.select).eq(0),
                        val = 0,
                        top = 0,
                        visible = select.is(':visible'),
                        items,
                        i;
    
                    month_picker
                        .find('.' + xdc.select)
                        .hide();
                    if (_xdsoft_datetime.currentTime) {
                        val = _xdsoft_datetime.currentTime[$(this).hasClass(xdc.month) ? 'getMonth' : 'getFullYear']();
                    }
    
                    select[visible ? 'hide' : 'show']();
                    for (items = select.find('div.' + xdc.option), i = 0; i < items.length; i += 1) {
                        if (items.eq(i).data('value') === val) {
                            break;
                        } else {
                            top += items[0].offsetHeight;
                        }
                    }
    
                    select.xdsoftScroller(top / (select.children()[0].offsetHeight - (select[0].clientHeight)));
                    event.stopPropagation();
                    return false;
                });
    
            month_picker
                .find('.' + xdc.select)
                .xdsoftScroller()
                .on(xde.mousedown, function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                })
                .on(xde.mousedown, '.' + xdc.option, function(event) {
                    var year = _xdsoft_datetime.currentTime.getFullYear();
                    if (_xdsoft_datetime && _xdsoft_datetime.currentTime) {
                        _xdsoft_datetime.currentTime[$(this).parent().parent().hasClass(xdc.monthselect) ? 'setMonth' : 'setFullYear']($(this).data('value'));
                    }
    
                    $(this).parent().parent().hide();
    
                    datetimepicker.trigger(xde.xchange);
                    if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
                        options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }
    
                    if (year !== _xdsoft_datetime.currentTime.getFullYear() && $.isFunction(options.onChangeYear)) {
                        options.onChangeYear.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }
                });
    
            datetimepicker.setOptions = function(_options) {
                options = $.extend(true, {}, options, _options);
    
                if (_options.allowTimes && $.isArray(_options.allowTimes) && _options.allowTimes.length) {
                    options.allowTimes = $.extend(true, [], _options.allowTimes);
                }
    
                if (_options.weekends && $.isArray(_options.weekends) && _options.weekends.length) {
                    options.weekends = $.extend(true, [], _options.weekends);
                }
    
                if (_options.disabledDates && $.isArray(_options.disabledDates) && _options.disabledDates.length) {
                    options.disabledDates = $.extend(true, [], _options.disabledDates);
                }
    
                if ((options.open || options.opened) && (!options.inline)) {
                    input.trigger(xde.open);
                }
    
                if (options.inline) {
                    triggerAfterOpen = true;
                    datetimepicker.addClass(xdc.inline);
                    input.after(datetimepicker).hide();
                }
    
                if (options.inverseButton) {
                    options.next = xdc.prev;
                    options.prev = xdc.next;
                }
    
                if (options.datepicker) {
                    datepicker.addClass('active');
                } else {
                    datepicker.removeClass('active');
                }
    
                if (options.timepicker) {
                    timepicker.addClass('active');
                } else {
                    timepicker.removeClass('active');
                }
    
                if (options.value) {
                    if (input && input.val) {
                        input.val(options.value);
                    }
                    _xdsoft_datetime.setCurrentTime(options.value);
                }
    
                setDayOfWeekStart(options);
    
                if (!options.timepickerScrollbar) {
                    timeboxparent.xdsoftScroller('hide');
                }
    
                if (options.minDate && /^-(.*)$/.test(options.minDate)) {
                    options.minDate = _xdsoft_datetime.strToDateTime(options.minDate).dateFormat(options.formatDate);
                }
    
                if (options.maxDate && /^\+(.*)$/.test(options.maxDate)) {
                    options.maxDate = _xdsoft_datetime.strToDateTime(options.maxDate).dateFormat(options.formatDate);
                }
    
                month_picker
                    .find('.' + xdc.today_button)
                    .css('visibility', !options.todayButton ? 'hidden' : 'visible');
    
                if (options.mask) {
                    var e,
                        getCaretPos = function(input) {
                            try {
                                if (document.selection && document.selection.createRange) {
                                    var range = document.selection.createRange();
                                    return range.getBookmark().charCodeAt(2) - 2;
                                }
                                if (input.setSelectionRange) {
                                    return input.selectionStart;
                                }
                            } catch (e) {
                                return 0;
                            }
                        },
                        setCaretPos = function(node, pos) {
                            node = (typeof node === "string" || node instanceof String) ? document.getElementById(node) : node;
                            if (!node) {
                                return false;
                            }
                            if (node.createTextRange) {
                                var textRange = node.createTextRange();
                                textRange.collapse(true);
                                textRange.moveEnd('character', pos);
                                textRange.moveStart('character', pos);
                                textRange.select();
                                return true;
                            }
                            if (node.setSelectionRange) {
                                node.setSelectionRange(pos, pos);
                                return true;
                            }
                            return false;
                        },
                        isValidValue = function(mask, value) {
                            var reg = mask
                                .replace(/([\[\]\/\{\}\(\)\-\.\+]{1})/g, '\\$1')
                                .replace(/_/g, '{digit+}')
                                .replace(/([0-9]{1})/g, '{digit$1}')
                                .replace(/\{digit([0-9]{1})\}/g, '[0-$1_]{1}')
                                .replace(/\{digit[\+]\}/g, '[0-9_]{1}');
                            return (new RegExp(reg)).test(value);
                        };
                    input.off(xde.keydown);
    
                    if (options.mask === true) {
                        options.mask = options.format
                            .replace(/Y/g, '9999')
                            .replace(/F/g, '9999')
                            .replace(/m/g, '19')
                            .replace(/d/g, '39')
                            .replace(/H/g, '29')
                            .replace(/i/g, '59')
                            .replace(/s/g, '59');
                    }
    
                    if ($.type(options.mask) === 'string') {
                        if (!isValidValue(options.mask, input.val())) {
                            input.val(options.mask.replace(/[0-9]/g, '_'));
                        }
    
                        input.on(xde.keydown, function(event) {
                            var val = this.value,
                                key = event.which,
                                pos,
                                digit;
    
                            if (((key >= KEY0 && key <= KEY9) || (key >= _KEY0 && key <= _KEY9)) || (key === BACKSPACE || key === DEL)) {
                                pos = getCaretPos(this);
                                digit = (key !== BACKSPACE && key !== DEL) ? String.fromCharCode((_KEY0 <= key && key <= _KEY9) ? key - KEY0 : key) : '_';
    
                                if ((key === BACKSPACE || key === DEL) && pos) {
                                    pos -= 1;
                                    digit = '_';
                                }
    
                                while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
                                    pos += (key === BACKSPACE || key === DEL) ? -1 : 1;
                                }
    
                                val = val.substr(0, pos) + digit + val.substr(pos + 1);
                                if ($.trim(val) === '') {
                                    val = options.mask.replace(/[0-9]/g, '_');
                                } else {
                                    if (pos === options.mask.length) {
                                        event.preventDefault();
                                        return false;
                                    }
                                }
    
                                pos += (key === BACKSPACE || key === DEL) ? 0 : 1;
                                while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
                                    pos += (key === BACKSPACE || key === DEL) ? -1 : 1;
                                }
    
                                if (isValidValue(options.mask, val)) {
                                    this.value = val;
                                    setCaretPos(this, pos);
                                } else if ($.trim(val) === '') {
                                    this.value = options.mask.replace(/[0-9]/g, '_');
                                } else {
                                    input.trigger(xde.error_input);
                                }
                            } else {
                                if (([AKEY, CKEY, VKEY, ZKEY, YKEY].indexOf(key) !== -1 && ctrlDown) || [ESC, ARROWUP, ARROWDOWN, ARROWLEFT, ARROWRIGHT, F5, CTRLKEY, TAB, ENTER].indexOf(key) !== -1) {
                                    return true;
                                }
                            }
    
                            event.preventDefault();
                            return false;
                        });
                    }
                }
                if (options.validateOnBlur) {
                    input
                        .off(xde.blur)
                        .on(xde.blur, function() {
                            if (options.allowBlank && !$.trim($(this).val()).length) {
                                $(this).val(null);
                                datetimepicker.data(xdc.datetime).empty();
                            } else if (!Date.parseDate($(this).val(), options.format)) {
                                $(this).val((_xdsoft_datetime.now()).dateFormat(options.format));
                                datetimepicker.data(xdc.datetime).setCurrentTime($(this).val());
                            } else {
                                datetimepicker.data(xdc.datetime).setCurrentTime($(this).val());
                            }
                            datetimepicker.trigger(xde.changedatetime);
                        });
                }
                options.dayOfWeekStartPrev = (options.dayOfWeekStart === 0) ? 6 : options.dayOfWeekStart - 1;
    
                datetimepicker
                    .trigger(xde.xchange)
                    .trigger(xde.afterOpen);
            };
    
            datetimepicker
                .data('options', options)
                .on(xde.mousedown, function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    yearselect.hide();
                    monthselect.hide();
                    return false;
                });
    
            //scroll_element = timepicker.find('.'+xdc.time_box);
            timeboxparent.append(timebox);
            timeboxparent.xdsoftScroller();
    
            datetimepicker.on(xde.afterOpen, function() {
                timeboxparent.xdsoftScroller();
            });
    
            datetimepicker
                .append(datepicker)
                .append(timepicker);
    
            if (options.withoutCopyright !== true) {
                datetimepicker
                    .append(xdsoft_copyright);
            }
    
            datepicker
                .append(month_picker)
                .append(calendar);
    
            $(options.parentID)
                .append(datetimepicker);
    
            XDSoft_datetime = function() {
                var _this = this;
                _this.now = function(norecursion) {
                    var d = new Date(),
                        date,
                        time;
    
                    if (!norecursion && options.defaultDate) {
                        date = _this.strToDate(options.defaultDate);
                        d.setFullYear(date.getFullYear());
                        d.setMonth(date.getMonth());
                        d.setDate(date.getDate());
                    }
    
                    if (options.yearOffset) {
                        d.setFullYear(d.getFullYear() + options.yearOffset);
                    }
    
                    if (!norecursion && options.defaultTime) {
                        time = _this.strtotime(options.defaultTime);
                        d.setHours(time.getHours());
                        d.setMinutes(time.getMinutes());
                    }
    
                    return d;
                };
    
                _this.isValidDate = function(d) {
                    if (Object.prototype.toString.call(d) !== "[object Date]") {
                        return false;
                    }
                    return !isNaN(d.getTime());
                };
    
                _this.setCurrentTime = function(dTime) {
                    _this.currentTime = (typeof dTime === 'string') ? _this.strToDateTime(dTime) : _this.isValidDate(dTime) ? dTime : _this.now();
                    datetimepicker.trigger(xde.xchange);
                };
    
                _this.empty = function() {
                    _this.currentTime = null;
                };
    
                _this.getCurrentTime = function(dTime) {
                    return _this.currentTime;
                };
    
                _this.nextMonth = function() {
                    var month = _this.currentTime.getMonth() + 1,
                        year;
                    if (month === 12) {
                        _this.currentTime.setFullYear(_this.currentTime.getFullYear() + 1);
                        month = 0;
                    }
    
                    year = _this.currentTime.getFullYear();
    
                    _this.currentTime.setDate(
                        Math.min(
                            new Date(_this.currentTime.getFullYear(), month + 1, 0).getDate(),
                            _this.currentTime.getDate()
                        )
                    );
                    _this.currentTime.setMonth(month);
    
                    if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
                        options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }
    
                    if (year !== _this.currentTime.getFullYear() && $.isFunction(options.onChangeYear)) {
                        options.onChangeYear.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }
    
                    datetimepicker.trigger(xde.xchange);
                    return month;
                };
    
                _this.prevMonth = function() {
                    var month = _this.currentTime.getMonth() - 1;
                    if (month === -1) {
                        _this.currentTime.setFullYear(_this.currentTime.getFullYear() - 1);
                        month = 11;
                    }
                    _this.currentTime.setDate(
                        Math.min(
                            new Date(_this.currentTime.getFullYear(), month + 1, 0).getDate(),
                            _this.currentTime.getDate()
                        )
                    );
                    _this.currentTime.setMonth(month);
                    if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
                        options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }
                    datetimepicker.trigger(xde.xchange);
                    return month;
                };
    
                _this.getWeekOfYear = function(datetime) {
                    var onejan = new Date(datetime.getFullYear(), 0, 1);
                    return Math.ceil((((datetime - onejan) / 86400000) + onejan.getDay() + 1) / 7);
                };
    
                _this.strToDateTime = function(sDateTime) {
                    var tmpDate = [],
                        timeOffset, currentTime;
    
                    if (sDateTime && sDateTime instanceof Date && _this.isValidDate(sDateTime)) {
                        return sDateTime;
                    }
    
                    tmpDate = /^(\+|\-)(.*)$/.exec(sDateTime);
                    if (tmpDate) {
                        tmpDate[2] = Date.parseDate(tmpDate[2], options.formatDate);
                    }
                    if (tmpDate && tmpDate[2]) {
                        timeOffset = tmpDate[2].getTime() - (tmpDate[2].getTimezoneOffset()) * 60000;
                        currentTime = new Date((_xdsoft_datetime.now()).getTime() + parseInt(tmpDate[1] + '1', 10) * timeOffset);
                    } else {
                        currentTime = sDateTime ? Date.parseDate(sDateTime, options.format) : _this.now();
                    }
    
                    if (!_this.isValidDate(currentTime)) {
                        currentTime = _this.now();
                    }
    
                    return currentTime;
                };
    
                _this.strToDate = function(sDate) {
                    if (sDate && sDate instanceof Date && _this.isValidDate(sDate)) {
                        return sDate;
                    }
    
                    var currentTime = sDate ? Date.parseDate(sDate, options.formatDate) : _this.now(true);
                    if (!_this.isValidDate(currentTime)) {
                        currentTime = _this.now(true);
                    }
                    return currentTime;
                };
    
                _this.strtotime = function(sTime) {
                    if (sTime && sTime instanceof Date && _this.isValidDate(sTime)) {
                        return sTime;
                    }
                    var currentTime = sTime ? Date.parseDate(sTime, options.formatTime) : _this.now(true);
                    if (!_this.isValidDate(currentTime)) {
                        currentTime = _this.now(true);
                    }
                    return currentTime;
                };
    
                _this.str = function() {
                    return _this.currentTime.dateFormat(options.format);
                };
                _this.currentTime = this.now();
            };
    
            _xdsoft_datetime = new XDSoft_datetime();
    
            month_picker
                .find('.' + xdc.today_button)
                .on(xde.mousedown, function() {
                    datetimepicker.data('changed', true);
                    _xdsoft_datetime.setCurrentTime(0);
                    datetimepicker.trigger(xde.afterOpen);
                }).on(xde.dblclick, function() {
                    input.val(_xdsoft_datetime.str());
                    datetimepicker.trigger(xde.close);
                });
            month_picker
                .find('.' + xdc.prev + ',.' + xdc.next)
                .on(xde.mousedown, function() {
                    var $this = $(this),
                        timer = 0,
                        stop = false;
    
                    (function arguments_callee1(v) {
                        var month = _xdsoft_datetime.currentTime.getMonth();
                        if ($this.hasClass(options.next)) {
                            _xdsoft_datetime.nextMonth();
                        } else if ($this.hasClass(options.prev)) {
                            _xdsoft_datetime.prevMonth();
                        }
                        if (options.monthChangeSpinner) {
                            if (!stop) {
                                timer = setTimeout(arguments_callee1, v || 100);
                            }
                        }
                    }(500));
    
                    $([document.body, window]).on(xde.mouseup, function arguments_callee2() {
                        clearTimeout(timer);
                        stop = true;
                        $([document.body, window]).off(xde.mouseup, arguments_callee2);
                    });
                });
    
            timepicker
                .find('.' + xdc.prev + ',.' + xdc.next)
                .on(xde.mousedown, function() {
                    var $this = $(this),
                        timer = 0,
                        stop = false,
                        period = 110;
                    (function arguments_callee4(v) {
                        var pheight = timeboxparent[0].clientHeight,
                            height = timebox[0].offsetHeight,
                            top = Math.abs(parseInt(timebox.css('marginTop'), 10));
                        if ($this.hasClass(options.next) && (height - pheight) - options.timeHeightInTimePicker >= top) {
                            timebox.css('marginTop', '-' + (top + options.timeHeightInTimePicker) + 'px');
                        } else if ($this.hasClass(options.prev) && top - options.timeHeightInTimePicker >= 0) {
                            timebox.css('marginTop', '-' + (top - options.timeHeightInTimePicker) + 'px');
                        }
                        timeboxparent.trigger(xde.scroller.scroll_element, [Math.abs(parseInt(timebox.css('marginTop'), 10) / (height - pheight))]);
                        period = (period > 10) ? 10 : period - 10;
                        if (!stop) {
                            timer = setTimeout(arguments_callee4, v || period);
                        }
                    }(500));
                    $([document.body, window]).on(xde.mouseup, function arguments_callee5() {
                        clearTimeout(timer);
                        stop = true;
                        $([document.body, window])
                            .off(xde.mouseup, arguments_callee5);
                    });
                });
    
            xchangeTimer = 0;
            // base handler - generating a calendar and timepicker
            datetimepicker
                .on(xde.xchange, function(event) {
                    clearTimeout(xchangeTimer);
                    xchangeTimer = setTimeout(function() {
                        var table = '',
                            start = new Date(_xdsoft_datetime.currentTime.getFullYear(), _xdsoft_datetime.currentTime.getMonth(), 1, 12, 0, 0),
                            i = 0,
                            j,
                            today = _xdsoft_datetime.now(),
                            maxDate = false,
                            minDate = false,
                            d,
                            y,
                            m,
                            w,
                            classes = [],
                            customDateSettings,
                            newRow = true,
                            time = '',
                            h = '',
                            line_time;
    
                        while (start.getDay() !== options.dayOfWeekStart) {
                            start.setDate(start.getDate() - 1);
                        }
    
                        table += '<table><thead><tr>';
    
                        if (options.weeks) {
                            table += '<th></th>';
                        }
    
                        for (j = 0; j < 7; j += 1) {
                            table += '<th>' + getI18n(options.lang,'dayOfWeek')[(j + options.dayOfWeekStart) % 7] + '</th>';
                        }
    
                        table += '</tr></thead>';
                        table += '<tbody>';
    
                        if (options.maxDate !== false) {
                            maxDate = _xdsoft_datetime.strToDate(options.maxDate);
                            maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59, 999);
                        }
    
                        if (options.minDate !== false) {
                            minDate = _xdsoft_datetime.strToDate(options.minDate);
                            minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
                        }
    
                        while (i < _xdsoft_datetime.currentTime.countDaysInMonth() || start.getDay() !== options.dayOfWeekStart || _xdsoft_datetime.currentTime.getMonth() === start.getMonth()) {
                            classes = [];
                            i += 1;
    
                            d = start.getDate();
                            y = start.getFullYear();
                            m = start.getMonth();
                            w = _xdsoft_datetime.getWeekOfYear(start);
    
                            classes.push(xdc.date);
    
                            if (options.beforeShowDay && $.isFunction(options.beforeShowDay.call)) {
                                customDateSettings = options.beforeShowDay.call(datetimepicker, start);
                            } else {
                                customDateSettings = null;
                            }
    
                            if ((maxDate !== false && start > maxDate) || (minDate !== false && start < minDate) || (customDateSettings && customDateSettings[0] === false)) {
                                classes.push(xdc.disabled);
                            } else if (options.disabledDates.indexOf(start.dateFormat(options.formatDate)) !== -1) {
                                classes.push(xdc.disabled);
                            }
    
                            if (customDateSettings && customDateSettings[1] !== "") {
                                classes.push(customDateSettings[1]);
                            }
    
                            if (_xdsoft_datetime.currentTime.getMonth() !== m) {
                                classes.push(xdc.other_month);
                            }
    
                            if ((options.defaultSelect || datetimepicker.data('changed')) && _xdsoft_datetime.currentTime.dateFormat(options.formatDate) === start.dateFormat(options.formatDate)) {
                                classes.push(xdc.current);
                            }
    
                            if (today.dateFormat(options.formatDate) === start.dateFormat(options.formatDate)) {
                                classes.push(xdc.today);
                            }
    
                            if (start.getDay() === 0 || start.getDay() === 6 || ~options.weekends.indexOf(start.dateFormat(options.formatDate))) {
                                classes.push(xdc.weekend);
                            }
    
                            if (options.beforeShowDay && $.isFunction(options.beforeShowDay)) {
                                classes.push(options.beforeShowDay(start));
                            }
    
                            if (newRow) {
                                table += '<tr>';
                                newRow = false;
                                if (options.weeks) {
                                    table += '<th>' + w + '</th>';
                                }
                            }
    
                            table += '<td data-date="' + d + '" data-month="' + m + '" data-year="' + y + '"' + ' class="' + xdc.date + ' ' + xdc.day_of_week + '' + start.getDay() + ' ' + classes.join(' ') + '">' +
                                '<div>' + d + '</div>' +
                                '</td>';
    
                            if (start.getDay() === options.dayOfWeekStartPrev) {
                                table += '</tr>';
                                newRow = true;
                            }
    
                            start.setDate(d + 1);
                        }
                        table += '</tbody></table>';
    
                        calendar.html(table);
    
                        month_picker.find('.' + xdc.label + ' span').eq(0).text(getI18n(options.lang,'months')[_xdsoft_datetime.currentTime.getMonth()]);
                        month_picker.find('.' + xdc.label + ' span').eq(1).text(_xdsoft_datetime.currentTime.getFullYear());
    
                        // generate timebox
                        time = '';
                        h = '';
                        m = '';
                        line_time = function line_time(h, m) {
                            var now = _xdsoft_datetime.now();
                            now.setHours(h);
                            h = parseInt(now.getHours(), 10);
                            now.setMinutes(m);
                            m = parseInt(now.getMinutes(), 10);
                            var optionDateTime = new Date(_xdsoft_datetime.currentTime);
                            optionDateTime.setHours(h);
                            optionDateTime.setMinutes(m);
                            classes = [];
                            if ((options.minDateTime !== false && options.minDateTime > optionDateTime) || (options.maxTime !== false && _xdsoft_datetime.strtotime(options.maxTime).getTime() < now.getTime()) || (options.minTime !== false && _xdsoft_datetime.strtotime(options.minTime).getTime() > now.getTime())) {
                                classes.push(xdc.disabled);
                            }
                            if ((options.initTime || options.defaultSelect || datetimepicker.data('changed')) && parseInt(_xdsoft_datetime.currentTime.getHours(), 10) === parseInt(h, 10) && (options.step > 59 || Math[options.roundTime](_xdsoft_datetime.currentTime.getMinutes() / options.step) * options.step === parseInt(m, 10))) {
                                if (options.defaultSelect || datetimepicker.data('changed')) {
                                    classes.push(xdc.current);
                                } else if (options.initTime) {
                                    classes.push(xdc.init_time);
                                }
                            }
                            if (parseInt(today.getHours(), 10) === parseInt(h, 10) && parseInt(today.getMinutes(), 10) === parseInt(m, 10)) {
                                classes.push(xdc.today);
                            }
                            time += '<div class="' + xdc.time + ' ' + classes.join(' ') + '" data-hour="' + h + '" data-minute="' + m + '">' + now.dateFormat(options.formatTime) + '</div>';
                        };
    
                        if (!options.allowTimes || !$.isArray(options.allowTimes) || !options.allowTimes.length) {
                            for (i = 0, j = 0; i < (options.hours12 ? 12 : 24); i += 1) {
                                for (j = 0; j < 60; j += options.step) {
                                    h = (i < 10 ? '0' : '') + i;
                                    m = (j < 10 ? '0' : '') + j;
                                    line_time(h, m);
                                }
                            }
                        } else {
                            for (i = 0; i < options.allowTimes.length; i += 1) {
                                h = _xdsoft_datetime.strtotime(options.allowTimes[i]).getHours();
                                m = _xdsoft_datetime.strtotime(options.allowTimes[i]).getMinutes();
                                line_time(h, m);
                            }
                        }
    
                        timebox.html(time);
    
                        opt = '';
                        i = 0;
    
                        for (i = parseInt(options.yearStart, 10) + options.yearOffset; i <= parseInt(options.yearEnd, 10) + options.yearOffset; i += 1) {
                            opt += '<div class="' + xdc.option + ' ' + (_xdsoft_datetime.currentTime.getFullYear() === i ? xdc.current : '') + '" data-value="' + i + '">' + i + '</div>';
                        }
                        yearselect.children().eq(0)
                            .html(opt);
    
                        for (i = 0, opt = ''; i <= 11; i += 1) {
                            opt += '<div class="' + xdc.option + ' ' + (_xdsoft_datetime.currentTime.getMonth() === i ? xdc.current : '') + '" data-value="' + i + '">' + getI18n(options.lang,'months')[i] + '</div>';
                        }
                        monthselect.children().eq(0).html(opt);
                        $(datetimepicker)
                            .trigger(xde.generate);
                    }, 10);
                    event.stopPropagation();
                })
                .on(xde.afterOpen, function() {
                    if (options.timepicker) {
                        var classType, pheight, height, top;
                        if (timebox.find('.' + xdc.current).length) {
                            classType = '.' + xdc.current;
                        } else if (timebox.find('.' + xdc.init_time).length) {
                            classType = '.' + xdc.init_time;
                        }
                        if (classType) {
                            pheight = timeboxparent[0].clientHeight;
                            height = timebox[0].offsetHeight;
                            top = timebox.find(classType).index() * options.timeHeightInTimePicker + 1;
                            if ((height - pheight) < top) {
                                top = height - pheight;
                            }
                            timeboxparent.trigger(xde.scroller.scroll_element, [parseInt(top, 10) / (height - pheight)]);
                        } else {
                            timeboxparent.trigger(xde.scroller.scroll_element, [0]);
                        }
                    }
                });
    
            timerclick = 0;
            calendar
                .on(xde.click, 'td', function(xdevent) {
                    xdevent.stopPropagation(); // Prevents closing of Pop-ups, Modals and Flyouts in Bootstrap
                    timerclick += 1;
                    var $this = $(this),
                        currentTime = _xdsoft_datetime.currentTime;
    
                    if (currentTime === undefined || currentTime === null) {
                        _xdsoft_datetime.currentTime = _xdsoft_datetime.now();
                        currentTime = _xdsoft_datetime.currentTime;
                    }
    
                    if ($this.hasClass(xdc.disabled)) {
                        return false;
                    }
    
                    currentTime.setDate(1);
                    currentTime.setFullYear($this.data('year'));
                    currentTime.setMonth($this.data('month'));
                    currentTime.setDate($this.data('date'));
    
                    datetimepicker.trigger(xde.select, [currentTime]);
    
                    input.val(_xdsoft_datetime.str());
                    if ((timerclick > 1 || (options.closeOnDateSelect === true || (options.closeOnDateSelect === 0 && !options.timepicker))) && !options.inline) {
                        datetimepicker.trigger(xde.close);
                    }
    
                    if (options.onSelectDate && $.isFunction(options.onSelectDate)) {
                        options.onSelectDate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), xdevent);
                    }
    
                    datetimepicker.data('changed', true);
                    datetimepicker.trigger(xde.xchange);
                    datetimepicker.trigger(xde.changedatetime);
                    setTimeout(function() {
                        timerclick = 0;
                    }, 200);
                });
    
            timebox
                .on(xde.click, 'div', function(xdevent) {
                    xdevent.stopPropagation();
                    var $this = $(this),
                        currentTime = _xdsoft_datetime.currentTime;
    
                    if (currentTime === undefined || currentTime === null) {
                        _xdsoft_datetime.currentTime = _xdsoft_datetime.now();
                        currentTime = _xdsoft_datetime.currentTime;
                    }
    
                    if ($this.hasClass(xdc.disabled)) {
                        return false;
                    }
                    currentTime.setHours($this.data('hour'));
                    currentTime.setMinutes($this.data('minute'));
                    datetimepicker.trigger(xde.select, [currentTime]);
    
                    datetimepicker.data('input').val(_xdsoft_datetime.str());
                    if (!options.inline) {
                        datetimepicker.trigger(xde.close);
                    }
    
                    if (options.onSelectTime && $.isFunction(options.onSelectTime)) {
                        options.onSelectTime.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), xdevent);
                    }
                    datetimepicker.data('changed', true);
                    datetimepicker.trigger(xde.xchange);
                    datetimepicker.trigger(xde.changedatetime);
                });
    
    
            datepicker
                .on(xde.mousewheel, function(event) {
                    if (!options.scrollMonth) {
                        return true;
                    }
                    if (event.deltaY < 0) {
                        _xdsoft_datetime.nextMonth();
                    } else {
                        _xdsoft_datetime.prevMonth();
                    }
                    return false;
                });
    
            input
                .on(xde.mousewheel, function(event) {
                    if (!options.scrollInput) {
                        return true;
                    }
                    if (!options.datepicker && options.timepicker) {
                        current_time_index = timebox.find('.' + xdc.current).length ? timebox.find('.' + xdc.current).eq(0).index() : 0;
                        if (current_time_index + event.deltaY >= 0 && current_time_index + event.deltaY < timebox.children().length) {
                            current_time_index += event.deltaY;
                        }
                        if (timebox.children().eq(current_time_index).length) {
                            timebox.children().eq(current_time_index).trigger('mousedown');
                        }
                        return false;
                    }
                    if (options.datepicker && !options.timepicker) {
                        datepicker.trigger(event, [event.deltaY, event.deltaX, event.deltaY]);
                        if (input.val) {
                            input.val(_xdsoft_datetime.str());
                        }
                        datetimepicker.trigger(xde.changedatetime);
                        return false;
                    }
                });
    
            datetimepicker
                .on(xde.changedatetime, function(event) {
                    if (options.onChangeDateTime && $.isFunction(options.onChangeDateTime)) {
                        var $input = datetimepicker.data('input');
                        options.onChangeDateTime.call(datetimepicker, _xdsoft_datetime.currentTime, $input, event);
                        delete options.value;
                        $input.trigger('change');
                    }
                })
                .on(xde.generate, function() {
                    if (options.onGenerate && $.isFunction(options.onGenerate)) {
                        options.onGenerate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }
                    if (triggerAfterOpen) {
                        datetimepicker.trigger(xde.afterOpen);
                        triggerAfterOpen = false;
                    }
                })
                .on(xde.click, function(xdevent) {
                    xdevent.stopPropagation();
                });
    
            current_time_index = 0;
    
            setPos = function() {
                var offset = datetimepicker.data('input').offset(),
                    top = offset.top + datetimepicker.data('input')[0].offsetHeight - 1,
                    left = offset.left,
                    position = "absolute";
                if (options.fixed) {
                    top -= $(window).scrollTop();
                    left -= $(window).scrollLeft();
                    position = "fixed";
                } else {
                    if (top + datetimepicker[0].offsetHeight > $(window).height() + $(window).scrollTop()) {
                        top = offset.top - datetimepicker[0].offsetHeight + 1;
                    }
                    if (top < 0) {
                        top = 0;
                    }
                    if (left + datetimepicker[0].offsetWidth > $(window).width()) {
                        left = $(window).width() - datetimepicker[0].offsetWidth;
                    }
                }
                datetimepicker.css({
                    left: left,
                    top: top,
                    position: position
                });
            };
            datetimepicker
                .on(xde.open, function(event) {
                    var onShow = true;
                    if (options.onShow && $.isFunction(options.onShow)) {
                        onShow = options.onShow.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), event);
                    }
                    if (onShow !== false) {
                        datetimepicker.show();
                        setPos();
                        $(window)
                            .off(xde.resize, setPos)
                            .on(xde.resize, setPos);
    
                        if (options.closeOnWithoutClick) {
                            $([document.body, window]).on(xde.mousedown, function arguments_callee6() {
                                datetimepicker.trigger(xde.close);
                                $([document.body, window]).off(xde.mousedown, arguments_callee6);
                            });
                        }
                    }
                })
                .on(xde.close, function(event) {
                    var onClose = true;
                    month_picker
                        .find('.' + xdc.month + ',.' + xdc.year)
                        .find('.' + xdc.select)
                        .hide();
                    if (options.onClose && $.isFunction(options.onClose)) {
                        onClose = options.onClose.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), event);
                    }
                    if (onClose !== false && !options.opened && !options.inline) {
                        datetimepicker.hide();
                    }
                    event.stopPropagation();
                })
                .on(xde.toggle, function(event) {
                    if (datetimepicker.is(':visible')) {
                        datetimepicker.trigger(xde.close);
                    } else {
                        datetimepicker.trigger(xde.open);
                    }
                })
                .data('input', input);
    
            timer = 0;
            timer1 = 0;
    
            datetimepicker.data(xdc.datetime, _xdsoft_datetime);
            datetimepicker.setOptions(options);
    
            function getCurrentValue() {
    
                var ct = false,
                    time;
    
                if (options.startDate) {
                    ct = _xdsoft_datetime.strToDate(options.startDate);
                } else {
                    ct = options.value || ((input && input.val && input.val()) ? input.val() : '');
                    if (ct) {
                        ct = _xdsoft_datetime.strToDateTime(ct);
                    } else if (options.defaultDate) {
                        ct = _xdsoft_datetime.strToDate(options.defaultDate);
                        if (options.defaultTime) {
                            time = _xdsoft_datetime.strtotime(options.defaultTime);
                            ct.setHours(time.getHours());
                            ct.setMinutes(time.getMinutes());
                        }
                    }
                }
    
                if (ct && _xdsoft_datetime.isValidDate(ct)) {
                    datetimepicker.data('changed', true);
                } else {
                    ct = '';
                }
    
                return ct || 0;
            }
    
            _xdsoft_datetime.setCurrentTime(getCurrentValue());
    
            input
                .data(xdc.datetimepicker, datetimepicker)
                .on([xde.open, xde.focusin, xde.mousedown].join(' '), function(event) {
                    if (input.is(':disabled') || (input.data(xdc.datetimepicker).is(':visible') && options.closeOnInputClick)) {
                        return;
                    }
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        if (input.is(':disabled')) {
                            return;
                        }
    
                        triggerAfterOpen = true;
                        _xdsoft_datetime.setCurrentTime(getCurrentValue());
    
                        datetimepicker.trigger(xde.open);
                    }, 100);
                })
                .on(xde.keydown, function(event) {
                    var val = this.value,
                        elementSelector,
                        key = event.which;
                    if ([ENTER].indexOf(key) !== -1 && options.enterLikeTab) {
                        elementSelector = $("input:visible,textarea:visible");
                        datetimepicker.trigger(xde.close);
                        elementSelector.eq(elementSelector.index(this) + 1).focus();
                        return false;
                    }
                    if ([TAB].indexOf(key) !== -1) {
                        datetimepicker.trigger(xde.close);
                        return true;
                    }
                });
        };
        destroyDateTimePicker = function(input) {
            var datetimepicker = input.data(xdc.datetimepicker);
            if (datetimepicker) {
                datetimepicker.data(xdc.datetime, null);
                datetimepicker.remove();
                input
                    .data(xdc.datetimepicker, null)
                    .off(XDSOFT);
                $(window).off(xde.resize);
                $([window, document.body]).off(xde.mousedown);
                if (input.unmousewheel) {
                    input.unmousewheel();
                }
            }
        };
        $(document)
            .off([xde.ctrl.keydown, xde.ctrl.keyup].join(' '))
            .on(xde.ctrl.keydown, function(e) {
                if (e.keyCode === CTRLKEY) {
                    ctrlDown = true;
                }
            })
            .on(xde.ctrl.keyup, function(e) {
                if (e.keyCode === CTRLKEY) {
                    ctrlDown = false;
                }
            });
        return this.each(function() {
            var datetimepicker = $(this).data(xdc.datetimepicker);
            if (datetimepicker) {
                if ($.type(opt) === 'string') {
                    switch (opt) {
                        case 'show':
                            $(this).select().focus();
                            datetimepicker.trigger(xde.open);
                            break;
                        case 'hide':
                            datetimepicker.trigger(xde.close);
                            break;
                        case 'toggle':
                            datetimepicker.trigger(xde.toggle);
                            break;
                        case 'destroy':
                            destroyDateTimePicker($(this));
                            break;
                        case 'reset':
                            this.value = this.defaultValue;
                            if (!this.value || !datetimepicker.data(xdc.datetime).isValidDate(Date.parseDate(this.value, options.format))) {
                                datetimepicker.data('changed', false);
                            }
                            datetimepicker.data(xdc.datetime).setCurrentTime(this.value);
                            break;
                    }
                } else {
                    datetimepicker
                        .setOptions(opt);
                }
                return 0;
            }
            if ($.type(opt) !== 'string') {
                if (!options.lazyInit || options.open || options.inline) {
                    createDateTimePicker($(this));
                } else {
                    lazyInit($(this));
                }
            }
        });
    };
    $.fn.datetimepicker.defaults = default_options;
    // Parse and Format Library
    //http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/
    /*
     * Copyright (C) 2004 Baron Schwartz <baron at sequent dot org>
     *
     * This program is free software; you can redistribute it and/or modify it
     * under the terms of the GNU Lesser General Public License as published by the
     * Free Software Foundation, version 2.1.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
     * details.
     */
    Date.parseFunctions = {
        count: 0
    };
    Date.parseRegexes = [];
    Date.formatFunctions = {
        count: 0
    };
    Date.prototype.dateFormat = function(b) {
        if (b == "unixtime") {
            return parseInt(this.getTime() / 1000);
        }
        if (Date.formatFunctions[b] == null) {
            Date.createNewFormat(b);
        }
        var a = Date.formatFunctions[b];
        return this[a]();
    };
    Date.createNewFormat = function(format) {
        var funcName = "format" + Date.formatFunctions.count++;
        Date.formatFunctions[format] = funcName;
        var code = "Date.prototype." + funcName + " = function() {return ";
        var special = false;
        var ch = "";
        for (var i = 0; i < format.length; ++i) {
            ch = format.charAt(i);
            if (!special && ch == "\\") {
                special = true;
            } else {
                if (special) {
                    special = false;
                    code += "'" + String.escape(ch) + "' + ";
                } else {
                    code += Date.getFormatCode(ch);
                }
            }
        }
        eval(code.substring(0, code.length - 3) + ";}");
    };
    Date.getFormatCode = function(a) {
        switch (a) {
            case "d":
                return "String.leftPad(this.getDate(), 2, '0') + ";
            case "D":
                return "Date.dayNames[this.getDay()].substring(0, 3) + ";
            case "j":
                return "this.getDate() + ";
            case "l":
                return "Date.dayNames[this.getDay()] + ";
            case "S":
                return "this.getSuffix() + ";
            case "w":
                return "this.getDay() + ";
            case "z":
                return "this.getDayOfYear() + ";
            case "W":
                return "this.getWeekOfYear() + ";
            case "F":
                return "Date.monthNames[this.getMonth()] + ";
            case "m":
                return "String.leftPad(this.getMonth() + 1, 2, '0') + ";
            case "M":
                return "Date.monthNames[this.getMonth()].substring(0, 3) + ";
            case "n":
                return "(this.getMonth() + 1) + ";
            case "t":
                return "this.getDaysInMonth() + ";
            case "L":
                return "(this.isLeapYear() ? 1 : 0) + ";
            case "Y":
                return "this.getFullYear() + ";
            case "y":
                return "('' + this.getFullYear()).substring(2, 4) + ";
            case "a":
                return "(this.getHours() < 12 ? 'am' : 'pm') + ";
            case "A":
                return "(this.getHours() < 12 ? 'AM' : 'PM') + ";
            case "g":
                return "((this.getHours() %12) ? this.getHours() % 12 : 12) + ";
            case "G":
                return "this.getHours() + ";
            case "h":
                return "String.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";
            case "H":
                return "String.leftPad(this.getHours(), 2, '0') + ";
            case "i":
                return "String.leftPad(this.getMinutes(), 2, '0') + ";
            case "s":
                return "String.leftPad(this.getSeconds(), 2, '0') + ";
            case "O":
                return "this.getGMTOffset() + ";
            case "T":
                return "this.getTimezone() + ";
            case "Z":
                return "(this.getTimezoneOffset() * -60) + ";
            default:
                return "'" + String.escape(a) + "' + ";
        }
    };
    Date.parseDate = function(a, c) {
        if (c == "unixtime") {
            return new Date(!isNaN(parseInt(a)) ? parseInt(a) * 1000 : 0);
        }
        if (Date.parseFunctions[c] == null) {
            Date.createParser(c);
        }
        var b = Date.parseFunctions[c];
        return Date[b](a);
    };
    Date.createParser = function(format) {
        var funcName = "parse" + Date.parseFunctions.count++;
        var regexNum = Date.parseRegexes.length;
        var currentGroup = 1;
        Date.parseFunctions[format] = funcName;
        var code = "Date." + funcName + " = function(input) {\nvar y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, z = -1;\nvar d = new Date();\ny = d.getFullYear();\nm = d.getMonth();\nd = d.getDate();\nvar results = input.match(Date.parseRegexes[" + regexNum + "]);\nif (results && results.length > 0) {";
        var regex = "";
        var special = false;
        var ch = "";
        for (var i = 0; i < format.length; ++i) {
            ch = format.charAt(i);
            if (!special && ch == "\\") {
                special = true;
            } else {
                if (special) {
                    special = false;
                    regex += String.escape(ch);
                } else {
                    obj = Date.formatCodeToRegex(ch, currentGroup);
                    currentGroup += obj.g;
                    regex += obj.s;
                    if (obj.g && obj.c) {
                        code += obj.c;
                    }
                }
            }
        }
        code += "if (y > 0 && z > 0){\nvar doyDate = new Date(y,0);\ndoyDate.setDate(z);\nm = doyDate.getMonth();\nd = doyDate.getDate();\n}";
        code += "if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n{return new Date(y, m, d, h, i, s);}\nelse if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n{return new Date(y, m, d, h, i);}\nelse if (y > 0 && m >= 0 && d > 0 && h >= 0)\n{return new Date(y, m, d, h);}\nelse if (y > 0 && m >= 0 && d > 0)\n{return new Date(y, m, d);}\nelse if (y > 0 && m >= 0)\n{return new Date(y, m);}\nelse if (y > 0)\n{return new Date(y);}\n}return null;}";
        Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$");
        eval(code);
    };
    Date.formatCodeToRegex = function(b, a) {
        switch (b) {
            case "D":
                return {
                    g: 0,
                    c: null,
                    s: "(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"
                };
            case "j":
            case "d":
                return {
                    g: 1,
                    c: "d = parseInt(results[" + a + "], 10);\n",
                    s: "(\\d{1,2})"
                };
            case "l":
                return {
                    g: 0,
                    c: null,
                    s: "(?:" + Date.dayNames.join("|") + ")"
                };
            case "S":
                return {
                    g: 0,
                    c: null,
                    s: "(?:st|nd|rd|th)"
                };
            case "w":
                return {
                    g: 0,
                    c: null,
                    s: "\\d"
                };
            case "z":
                return {
                    g: 1,
                    c: "z = parseInt(results[" + a + "], 10);\n",
                    s: "(\\d{1,3})"
                };
            case "W":
                return {
                    g: 0,
                    c: null,
                    s: "(?:\\d{2})"
                };
            case "F":
                return {
                    g: 1,
                    c: "m = parseInt(Date.monthNumbers[results[" + a + "].substring(0, 3)], 10);\n",
                    s: "(" + Date.monthNames.join("|") + ")"
                };
            case "M":
                return {
                    g: 1,
                    c: "m = parseInt(Date.monthNumbers[results[" + a + "]], 10);\n",
                    s: "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"
                };
            case "n":
            case "m":
                return {
                    g: 1,
                    c: "m = parseInt(results[" + a + "], 10) - 1;\n",
                    s: "(\\d{1,2})"
                };
            case "t":
                return {
                    g: 0,
                    c: null,
                    s: "\\d{1,2}"
                };
            case "L":
                return {
                    g: 0,
                    c: null,
                    s: "(?:1|0)"
                };
            case "Y":
                return {
                    g: 1,
                    c: "y = parseInt(results[" + a + "], 10);\n",
                    s: "(\\d{4})"
                };
            case "y":
                return {
                    g: 1,
                    c: "var ty = parseInt(results[" + a + "], 10);\ny = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
                    s: "(\\d{1,2})"
                };
            case "a":
                return {
                    g: 1,
                    c: "if (results[" + a + "] == 'am') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",
                    s: "(am|pm)"
                };
            case "A":
                return {
                    g: 1,
                    c: "if (results[" + a + "] == 'AM') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",
                    s: "(AM|PM)"
                };
            case "g":
            case "G":
            case "h":
            case "H":
                return {
                    g: 1,
                    c: "h = parseInt(results[" + a + "], 10);\n",
                    s: "(\\d{1,2})"
                };
            case "i":
                return {
                    g: 1,
                    c: "i = parseInt(results[" + a + "], 10);\n",
                    s: "(\\d{2})"
                };
            case "s":
                return {
                    g: 1,
                    c: "s = parseInt(results[" + a + "], 10);\n",
                    s: "(\\d{2})"
                };
            case "O":
                return {
                    g: 0,
                    c: null,
                    s: "[+-]\\d{4}"
                };
            case "T":
                return {
                    g: 0,
                    c: null,
                    s: "[A-Z]{3}"
                };
            case "Z":
                return {
                    g: 0,
                    c: null,
                    s: "[+-]\\d{1,5}"
                };
            default:
                return {
                    g: 0,
                    c: null,
                    s: String.escape(b)
                };
        }
    };
    Date.prototype.getTimezone = function() {
        return this.toString().replace(/^.*? ([A-Z]{3}) [0-9]{4}.*$/, "$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, "$1$2$3");
    };
    Date.prototype.getGMTOffset = function() {
        return (this.getTimezoneOffset() > 0 ? "-" : "+") + String.leftPad(Math.floor(Math.abs(this.getTimezoneOffset()) / 60), 2, "0") + String.leftPad(Math.abs(this.getTimezoneOffset()) % 60, 2, "0");
    };
    Date.prototype.getDayOfYear = function() {
        var a = 0;
        Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
        for (var b = 0; b < this.getMonth(); ++b) {
            a += Date.daysInMonth[b];
        }
        return a + this.getDate();
    };
    Date.prototype.getWeekOfYear = function() {
        var b = this.getDayOfYear() + (4 - this.getDay());
        var a = new Date(this.getFullYear(), 0, 1);
        var c = (7 - a.getDay() + 4);
        return String.leftPad(Math.ceil((b - c) / 7) + 1, 2, "0");
    };
    Date.prototype.isLeapYear = function() {
        var a = this.getFullYear();
        return ((a & 3) == 0 && (a % 100 || (a % 400 == 0 && a)));
    };
    Date.prototype.getFirstDayOfMonth = function() {
        var a = (this.getDay() - (this.getDate() - 1)) % 7;
        return (a < 0) ? (a + 7) : a;
    };
    Date.prototype.getLastDayOfMonth = function() {
        var a = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7;
        return (a < 0) ? (a + 7) : a;
    };
    Date.prototype.getDaysInMonth = function() {
        Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
        return Date.daysInMonth[this.getMonth()];
    };
    Date.prototype.getSuffix = function() {
        switch (this.getDate()) {
            case 1:
            case 21:
            case 31:
                return "st";
            case 2:
            case 22:
                return "nd";
            case 3:
            case 23:
                return "rd";
            default:
                return "th";
        }
    };
    String.escape = function(a) {
        return a.replace(/('|\\)/g, "\\$1");
    };
    String.leftPad = function(d, b, c) {
        var a = new String(d);
        if (c == null) {
            c = " ";
        }
        while (a.length < b) {
            a = c + a;
        }
        return a;
    };
    Date.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    Date.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    Date.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    Date.y2kYear = 50;
    Date.monthNumbers = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11
    };
    Date.patterns = {
        ISO8601LongPattern: "Y-m-d H:i:s",
        ISO8601ShortPattern: "Y-m-d",
        ShortDatePattern: "n/j/Y",
        LongDatePattern: "l, F d, Y",
        FullDateTimePattern: "l, F d, Y g:i:s A",
        MonthDayPattern: "F d",
        ShortTimePattern: "g:i A",
        LongTimePattern: "g:i:s A",
        SortableDateTimePattern: "Y-m-d\\TH:i:s",
        UniversalSortableDateTimePattern: "Y-m-d H:i:sO",
        YearMonthPattern: "F, Y"
    };
});