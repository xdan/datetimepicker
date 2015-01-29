/**
 * @preserve jQuery DateTimePicker plugin v2.4.1
 * @homepage http://xdsoft.net/jqplugins/datetimepicker/
 * (c) 2014, Chupurnov Valeriy.
 */
/*global document,window,jQuery,setTimeout,clearTimeout*/
(function(a) {
    ('function' == typeof(define) && define.amd) ? define(['jquery', 'moment', 'jquery.mousewheel'], a): 'object' == typeof exports ? module.exports = a : a(jQuery,moment);
})(function($, moment) {
    'use strict';
    Date.prototype.dateFormat = function(format) {
        return moment(this).format(format);
    };
    Date.parseDate = function(date, format) {
        return moment(date, format).toDate();
    };
    var defaultFormat= 'YYYY/MM/DD HH:mm',
    defaultFormatTime= 'HH:mm',
    defaultFormatDate= 'YYYY/MM/DD';
    var I18N = { 
        months:'months',
        dayOfWeek:'weekdaysShort'
    };
    var getI18n=function(lang, prop){
        return moment[I18N[prop]]();
    };
    var setDayOfWeekStart=function(options){
        options.dayOfWeekStart=moment.localeData().firstDayOfWeek();
    };    
    var setMaskFormat=function(options){        
        if (options.mask === true) {
            options.mask = options.format
                .replace(/Y/g, '9')
                .replace(/MM/g, '19')
                .replace(/DD/g, '39')
                .replace(/M/g, '19')
                .replace(/D/g, '39')
                .replace(/HH/g, '29')
                .replace(/hh/g, '19')
                .replace(/H/g, '29')
                .replace(/h/g, '19')
                .replace(/mm/g, '59')
                .replace(/ss/g, '59')
                .replace(/m/g, '59')
                .replace(/s/g, '59');
        }
    };
    //= datetimepicker.base.js
});