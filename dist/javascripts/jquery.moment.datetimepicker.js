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
    var NS, XDE_KEYUP, XDE_AFTEROPEN, XDE_BLUR, XDE_CHANGEDATETIME, XDE_CLICK, XDE_CLOSE, XDE_DBLCLICK, XDE_FOCUSIN, XDE_GENERATE, XDE_KEYDOWN,
        XDE_MOUSEDOWN, XDE_MOUSEUP, XDE_MOUSEWHEEL, XDE_OPEN, XDE_RESIZE, XDE_TOGGLE, XDE_XCHANGE, XDE_ERROR_INPUT, XDE_SELECT, XDE_RESIZE_SCROLL,
        XDE_SCROLL_ELEMENT, XDE_SCROLLER_MOUSEDOWN, XDE_SCROLLER_MOUSEMOVE, XDE_SCROLLER_MOUSEUP, XDE_SCROLLER_RESIZE_SCROLL, XDE_SCROLLER_SCROLL_ELEMENT,
        XDE_SCROLLER_TOUCHSTART, XDE_CTRL_KEYDOWN, XDE_CTRL_KEYUP, XDC_CALENDAR,XDC_COPYRIGHT, XDC_CURRENT, XDC_DATE, XDC_DATEPICKER, XDC_DATETIME,
        XDC_DATETIMEPICKER, XDC_DAY_OF_WEEK, XDC_DISABLED, XDC_INIT_TIME, XDC_INLINE, XDC_LABEL, XDC_MONTH, XDC_MONTHSELECT, XDC_MONTHPICKER, XDC_NEXT,
        XDC_NOSELECT, XDC_OPTION, XDC_OTHER_MONTH, XDC_PREV, XDC_SCROLLBAR, XDC_SCROLLER, XDC_SCROLLER_BOX, XDC_SELECT, XDC_SHOWWEEKS, XDC_TIME,
        XDC_TIME_BOX, XDC_TIME_VARIANT, XDC_TIMEPICKER, XDC_TODAY, XDC_TODAY_BUTTON, XDC_WEEKEND, XDC_YEAR, XDC_YEARSELECT,
        setNamespace=function (ns){
            (NS = ns,
            XDE_KEYUP = 'keyup.'+NS+'ctrl',
            XDE_AFTEROPEN = 'afterOpen.'+NS,
            XDE_BLUR = 'blur.'+NS,
            XDE_CHANGEDATETIME = 'changedatetime.'+NS,
            XDE_CLICK = 'click.'+NS,
            XDE_CLOSE = 'close.'+NS,
            XDE_DBLCLICK = 'dblclick.'+NS,
            XDE_FOCUSIN = 'focusin.'+NS,
            XDE_GENERATE = 'generate.'+NS,
            XDE_KEYDOWN = 'keydown.'+NS,
            XDE_MOUSEDOWN = 'mousedown.'+NS,
            XDE_MOUSEUP = 'mouseup.'+NS,
            XDE_MOUSEWHEEL = 'mousewheel.'+NS,
            XDE_OPEN = 'open.'+NS,
            XDE_RESIZE = 'resize.'+NS,
            XDE_TOGGLE = 'toggle.'+NS,
            XDE_XCHANGE = 'xchange.'+NS,
            XDE_ERROR_INPUT = 'error_input.'+NS,
            XDE_SELECT = 'select.'+NS,
            XDE_RESIZE_SCROLL = 'resize_scroll.'+NS+'_scroller',
            XDE_SCROLL_ELEMENT = 'scroll_element.'+NS+'_scroller',    
            XDE_SCROLLER_MOUSEDOWN = 'mousedown.'+NS+'_scroller',
            XDE_SCROLLER_MOUSEMOVE = 'mousemove.'+NS+'_scroller',
            XDE_SCROLLER_MOUSEUP = 'mouseup.'+NS+'_scroller',
            XDE_SCROLLER_RESIZE_SCROLL = 'resize_scroll.'+NS+'_scroller',
            XDE_SCROLLER_SCROLL_ELEMENT = 'scroll_element.'+NS+'_scroller',
            XDE_SCROLLER_TOUCHSTART = 'touchstart.'+NS+'_scroller',
            XDE_CTRL_KEYDOWN = 'keydown.'+NS+'ctrl',
            XDE_CTRL_KEYUP = 'keyup.'+NS+'ctrl',
            XDC_CALENDAR = NS+'_calendar',
            XDC_COPYRIGHT = NS+'_copyright',
            XDC_CURRENT = NS+'_current',
            XDC_DATE = NS+'_date',
            XDC_DATEPICKER = NS+'_datepicker',
            XDC_DATETIME = NS+'_datetime',
            XDC_DATETIMEPICKER = NS+'_datetimepicker',
            XDC_DAY_OF_WEEK = NS+'_day_of_week',
            XDC_DISABLED = NS+'_disabled',
            XDC_INIT_TIME = NS+'_init_time',
            XDC_INLINE = NS+'_inline',
            XDC_LABEL = NS+'_label',
            XDC_MONTH = NS+'_month',
            XDC_MONTHSELECT = NS+'_monthselect',
            XDC_MONTHPICKER = NS+'_monthpicker',
            XDC_NEXT = NS+'_next',
            XDC_NOSELECT = NS+'_noselect',
            XDC_OPTION = NS+'_option',
            XDC_OTHER_MONTH = NS+'_other_month',
            XDC_PREV = NS+'_prev',
            XDC_SCROLLBAR = NS+'_scrollbar',
            XDC_SCROLLER = NS+'_scroller',
            XDC_SCROLLER_BOX = NS+'_scroller_box',
            XDC_SELECT = NS+'_select',
            XDC_SHOWWEEKS = NS+'_showweeks',
            XDC_TIME = NS+'_time',
            XDC_TIME_BOX = NS+'_time_box',
            XDC_TIME_VARIANT = NS+'_time_variant',
            XDC_TIMEPICKER = NS+'_timepicker',
            XDC_TODAY = NS+'_today',
            XDC_TODAY_BUTTON = NS+'_today_button',
            XDC_WEEKEND = NS+'_weekend',
            XDC_YEAR = NS+'_year',
            XDC_YEARSELECT = NS+'_yearselect');
        };
        setNamespace('xdsoft');
    var default_options = {
        i18n: I18N,
        template: {
            datepicker: function() {
                return '<div class="' + XDC_DATEPICKER + ' active"></div>';
            },
            month_picker: function() {
                return '<div class="' + XDC_MONTHPICKER + '"><button type="button" class="' + XDC_PREV + '"></button><button type="button" class="' + XDC_TODAY_BUTTON + '"></button>' +
                    '<div class="' + XDC_LABEL + ' ' + XDC_MONTH + '"><span></span><i></i></div>' +
                    '<div class="' + XDC_LABEL + ' ' + XDC_YEAR + '"><span></span><i></i></div>' +
                    '<button type="button" class="' + XDC_NEXT + '"></button></div>';
            },
            calendar: function() {
                return '<div class="' + XDC_CALENDAR + '"></div>';
            },
            timepicker: function() {
                return '<div class="' + XDC_TIMEPICKER + ' active"><button type="button" class="' + XDC_PREV + '"></button><div class="' + XDC_TIME_BOX + '"></div><button type="button" class="' + XDC_NEXT + '"></button></div>';
            },
            timebox: function() {
                return '<div class="' + XDC_TIME_VARIANT + '"></div>';
            },
            monthselect: function() {
                return '<div class="' + XDC_SELECT + ' ' + XDC_MONTHSELECT + '"><div></div></div>';
            },
            yearselect: function() {
                return '<div class="' + XDC_SELECT + ' ' + XDC_YEARSELECT + '"><div></div></div>';
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
        next: XDC_NEXT,
        prev: XDC_PREV,
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
                timeboxparent.find('.' + XDC_SCROLLBAR).hide();
                return;
            }
            if (!$(this).hasClass(XDC_SCROLLER_BOX)) {
                timebox = timeboxparent.children().eq(0);
                parentHeight = timeboxparent[0].clientHeight;
                height = timebox[0].offsetHeight;
                scrollbar = $('<div class="' + XDC_SCROLLBAR + '"></div>');
                scroller = $('<div class="' + XDC_SCROLLER + '"></div>');
                scrollbar.append(scroller);
    
                timeboxparent.addClass(XDC_SCROLLER_BOX).append(scrollbar);
                calcOffset = function calcOffset(event) {
                    var offset = pointerEventToXY(event).y - startY + startTopScroll;
                    if (offset < 0) {
                        offset = 0;
                    }
                    if (offset + scroller[0].offsetHeight > h1) {
                        offset = h1 - scroller[0].offsetHeight;
                    }
                    timeboxparent.trigger(XDE_SCROLLER_SCROLL_ELEMENT, [maximumOffset ? offset / maximumOffset : 0]);
                };
    
                scroller
                    .on([XDE_SCROLLER_TOUCHSTART, XDE_SCROLLER_MOUSEDOWN].join(' '), function(event) {
                        if (!parentHeight) {
                            timeboxparent.trigger(XDE_SCROLLER_RESIZE_SCROLL, [percent]);
                        }
    
                        startY = pointerEventToXY(event).y;
                        startTopScroll = parseInt(scroller.css('margin-top'), 10);
                        h1 = scrollbar[0].offsetHeight;
    
                        if (event.type === 'mousedown') {
                            if (document) {
                                $(document.body).addClass(XDC_NOSELECT);
                            }
                            $([document.body, window]).on(XDE_SCROLLER_MOUSEUP, function arguments_callee() {
                                $([document.body, window]).off(XDE_SCROLLER_MOUSEUP, arguments_callee)
                                    .off(XDE_SCROLLER_MOUSEMOVE, calcOffset)
                                    .removeClass(XDC_NOSELECT);
                            });
                            $(document.body).on(XDE_SCROLLER_MOUSEMOVE, calcOffset);
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
                    .on(XDE_SCROLLER_SCROLL_ELEMENT, function(event, percentage) {
                        if (!parentHeight) {
                            timeboxparent.trigger(XDE_SCROLLER_RESIZE_SCROLL, [percentage, true]);
                        }
                        percentage = percentage > 1 ? 1 : (percentage < 0 || isNaN(percentage)) ? 0 : percentage;
    
                        scroller.css('margin-top', maximumOffset * percentage);
    
                        setTimeout(function() {
                            timebox.css('marginTop', -parseInt((timebox[0].offsetHeight - parentHeight) * percentage, 10));
                        }, 10);
                    })
                    .on(XDE_SCROLLER_RESIZE_SCROLL, function(event, percentage, noTriggerScroll) {
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
                                timeboxparent.trigger(XDE_SCROLLER_SCROLL_ELEMENT, [percentage || Math.abs(parseInt(timebox.css('marginTop'), 10)) / (height - parentHeight)]);
                            }
                        }
                    });
    
                timeboxparent.on('mousewheel', function(event) {
                    var top = Math.abs(parseInt(timebox.css('marginTop'), 10));
    
                    top = top - (event.deltaY * 20);
                    if (top < 0) {
                        top = 0;
                    }
    
                    timeboxparent.trigger(XDE_SCROLLER_SCROLL_ELEMENT, [top / (height - parentHeight)]);
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
                        timeboxparent.trigger(XDE_SCROLLER_SCROLL_ELEMENT, [(startTop - (coord.y - start.y)) / (height - parentHeight)]);
                    }
                });
    
                timeboxparent.on('touchend touchcancel', function(event) {
                    start = false;
                    startTop = 0;
                });
            }
            timeboxparent.trigger(XDE_SCROLLER_RESIZE_SCROLL, [percent]);
        });
    };
    var nosetNamespace=function(){};
    $.fn.datetimepicker = function(opt) {
        $.fn.datetimepicker.setNamespace=nosetNamespace;
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
                    .on([XDE_OPEN, XDE_FOCUSIN, XDE_MOUSEDOWN].join(' '), function initOnActionCallback(event) {
                        if (input.is(':disabled') || input.data(XDC_DATETIMEPICKER)) {
                            return;
                        }
                        clearTimeout(lazyInitTimer);
                        lazyInitTimer = setTimeout(function() {
    
                            if (!input.data(XDC_DATETIMEPICKER)) {
                                createDateTimePicker(input);
                            }
                            input
                                .off([XDE_OPEN, XDE_FOCUSIN, XDE_MOUSEDOWN].join(' '), initOnActionCallback)
                                .trigger(XDE_OPEN);
                        }, 100);
                    });
            };
        var xdsoft_copyright = '<div class="' + XDC_COPYRIGHT + '"><a target="_blank" href="http://xdsoft.net/jqplugins/datetimepicker/">xdsoft.net</a></div>';
        createDateTimePicker = function(input) {
            var datetimepicker = $('<div ' + (options.id ? 'id="' + options.id + '"' : '') + ' ' + (options.style ? 'style="' + options.style + '"' : '') + ' class="' + XDC_DATETIMEPICKER + ' '+NS+'_' + options.theme + ' ' + XDC_NOSELECT + ' ' + (options.weeks ? ' ' + XDC_SHOWWEEKS + '' : '') + options.className + '"></div>'),
                xdsoft_copyright = $(xdsoft_copyright),
                datepicker = $(options.template.datepicker()),
                month_picker = $(options.template.month_picker()),
                calendar = $(options.template.calendar()),
                timepicker = $(options.template.timepicker()),
                timeboxparent = timepicker.find('.' + XDC_TIME_BOX).eq(0),
                timebox = $(options.template.timebox()),
                /*scrollbar = $('<div class="'+XDC_SCROLLBAR+'"></div>'),
                scroller = $('<div class="'+XDC_SCROLLER+'"></div>'),*/
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
                .find('.' + XDC_MONTH + ' span')
                .after(monthselect);
            month_picker
                .find('.' + XDC_YEAR + ' span')
                .after(yearselect);
    
            month_picker
                .find('.' + XDC_MONTH + ',.' + XDC_YEAR)
                .on(XDE_MOUSEDOWN, function(event) {
                    var select = $(this).find('.' + XDC_SELECT).eq(0),
                        val = 0,
                        top = 0,
                        visible = select.is(':visible'),
                        items,
                        i;
    
                    month_picker
                        .find('.' + XDC_SELECT)
                        .hide();
                    if (_xdsoft_datetime.currentTime) {
                        val = _xdsoft_datetime.currentTime[$(this).hasClass(XDC_MONTH) ? 'getMonth' : 'getFullYear']();
                    }
    
                    select[visible ? 'hide' : 'show']();
                    for (items = select.find('div.' + XDC_OPTION), i = 0; i < items.length; i += 1) {
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
                .find('.' + XDC_SELECT)
                .xdsoftScroller()
                .on(XDE_MOUSEDOWN, function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                })
                .on(XDE_MOUSEDOWN, '.' + XDC_OPTION, function(event) {
                    var year = _xdsoft_datetime.currentTime.getFullYear();
                    if (_xdsoft_datetime && _xdsoft_datetime.currentTime) {
                        _xdsoft_datetime.currentTime[$(this).parent().parent().hasClass(XDC_MONTHSELECT) ? 'setMonth' : 'setFullYear']($(this).data('value'));
                    }
    
                    $(this).parent().parent().hide();
    
                    datetimepicker.trigger(XDE_XCHANGE);
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
                    input.trigger(XDE_OPEN);
                }
    
                if (options.inline) {
                    triggerAfterOpen = true;
                    datetimepicker.addClass(XDC_INLINE);
                    input.after(datetimepicker).hide();
                }
    
                if (options.inverseButton) {
                    options.next = XDC_PREV;
                    options.prev = XDC_NEXT;
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
                    .find('.' + XDC_TODAY_BUTTON)
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
                    input.off(XDE_KEYDOWN);
    
                    setMaskFormat(options);
    
                    if ($.type(options.mask) === 'string') {
                        if (!isValidValue(options.mask, input.val())) {
                            input.val(options.mask.replace(/[0-9]/g, '_'));
                        }
    
                        input.on(XDE_KEYDOWN, function(event) {
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
                                    input.trigger(XDE_ERROR_INPUT);
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
                        .off(XDE_BLUR)
                        .on(XDE_BLUR, function() {
                            if (options.allowBlank && !$.trim($(this).val()).length) {
                                $(this).val(null);
                                datetimepicker.data(XDC_DATETIME).empty();
                            } else if (!Date.parseDate($(this).val(), options.format)) {
                                $(this).val((_xdsoft_datetime.now()).dateFormat(options.format));
                                datetimepicker.data(XDC_DATETIME).setCurrentTime($(this).val());
                            } else {
                                datetimepicker.data(XDC_DATETIME).setCurrentTime($(this).val());
                            }
                            datetimepicker.trigger(XDE_CHANGEDATETIME);
                        });
                }
                options.dayOfWeekStartPrev = (options.dayOfWeekStart === 0) ? 6 : options.dayOfWeekStart - 1;
    
                datetimepicker
                    .trigger(XDE_XCHANGE)
                    .trigger(XDE_AFTEROPEN);
            };
    
            datetimepicker
                .data('options', options)
                .on(XDE_MOUSEDOWN, function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    yearselect.hide();
                    monthselect.hide();
                    return false;
                });
    
            //scroll_element = timepicker.find('.'+XDC_TIME_BOX);
            timeboxparent.append(timebox);
            timeboxparent.xdsoftScroller();
    
            datetimepicker.on(XDE_AFTEROPEN, function() {
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
                    datetimepicker.trigger(XDE_XCHANGE);
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
    
                    datetimepicker.trigger(XDE_XCHANGE);
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
                    datetimepicker.trigger(XDE_XCHANGE);
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
                .find('.' + XDC_TODAY_BUTTON)
                .on(XDE_MOUSEDOWN, function() {
                    datetimepicker.data('changed', true);
                    _xdsoft_datetime.setCurrentTime(0);
                    datetimepicker.trigger(XDE_AFTEROPEN);
                }).on(XDE_DBLCLICK, function() {
                    input.val(_xdsoft_datetime.str());
                    datetimepicker.trigger(XDE_CLOSE);
                });
            month_picker
                .find('.' + XDC_PREV + ',.' + XDC_NEXT)
                .on(XDE_MOUSEDOWN, function() {
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
    
                    $([document.body, window]).on(XDE_MOUSEUP, function arguments_callee2() {
                        clearTimeout(timer);
                        stop = true;
                        $([document.body, window]).off(XDE_MOUSEUP, arguments_callee2);
                    });
                });
    
            timepicker
                .find('.' + XDC_PREV + ',.' + XDC_NEXT)
                .on(XDE_MOUSEDOWN, function() {
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
                        timeboxparent.trigger(XDE_SCROLLER_SCROLL_ELEMENT, [Math.abs(parseInt(timebox.css('marginTop'), 10) / (height - pheight))]);
                        period = (period > 10) ? 10 : period - 10;
                        if (!stop) {
                            timer = setTimeout(arguments_callee4, v || period);
                        }
                    }(500));
                    $([document.body, window]).on(XDE_MOUSEUP, function arguments_callee5() {
                        clearTimeout(timer);
                        stop = true;
                        $([document.body, window])
                            .off(XDE_MOUSEUP, arguments_callee5);
                    });
                });
    
            xchangeTimer = 0;
            // base handler - generating a calendar and timepicker
            datetimepicker
                .on(XDE_XCHANGE, function(event) {
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
    
                            classes.push(XDC_DATE);
    
                            if (options.beforeShowDay && $.isFunction(options.beforeShowDay.call)) {
                                customDateSettings = options.beforeShowDay.call(datetimepicker, start);
                            } else {
                                customDateSettings = null;
                            }
    
                            if ((maxDate !== false && start > maxDate) || (minDate !== false && start < minDate) || (customDateSettings && customDateSettings[0] === false)) {
                                classes.push(XDC_DISABLED);
                            } else if (options.disabledDates.indexOf(start.dateFormat(options.formatDate)) !== -1) {
                                classes.push(XDC_DISABLED);
                            }
    
                            if (customDateSettings && customDateSettings[1] !== "") {
                                classes.push(customDateSettings[1]);
                            }
    
                            if (_xdsoft_datetime.currentTime.getMonth() !== m) {
                                classes.push(XDC_OTHER_MONTH);
                            }
    
                            if ((options.defaultSelect || datetimepicker.data('changed')) && _xdsoft_datetime.currentTime.dateFormat(options.formatDate) === start.dateFormat(options.formatDate)) {
                                classes.push(XDC_CURRENT);
                            }
    
                            if (today.dateFormat(options.formatDate) === start.dateFormat(options.formatDate)) {
                                classes.push(XDC_TODAY);
                            }
    
                            if (start.getDay() === 0 || start.getDay() === 6 || ~options.weekends.indexOf(start.dateFormat(options.formatDate))) {
                                classes.push(XDC_WEEKEND);
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
    
                            table += '<td data-date="' + d + '" data-month="' + m + '" data-year="' + y + '"' + ' class="' + XDC_DATE + ' ' + XDC_DAY_OF_WEEK + '' + start.getDay() + ' ' + classes.join(' ') + '">' +
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
    
                        month_picker.find('.' + XDC_LABEL + ' span').eq(0).text(getI18n(options.lang,'months')[_xdsoft_datetime.currentTime.getMonth()]);
                        month_picker.find('.' + XDC_LABEL + ' span').eq(1).text(_xdsoft_datetime.currentTime.getFullYear());
    
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
                                classes.push(XDC_DISABLED);
                            }
                            if ((options.initTime || options.defaultSelect || datetimepicker.data('changed')) && parseInt(_xdsoft_datetime.currentTime.getHours(), 10) === parseInt(h, 10) && (options.step > 59 || Math[options.roundTime](_xdsoft_datetime.currentTime.getMinutes() / options.step) * options.step === parseInt(m, 10))) {
                                if (options.defaultSelect || datetimepicker.data('changed')) {
                                    classes.push(XDC_CURRENT);
                                } else if (options.initTime) {
                                    classes.push(XDC_INIT_TIME);
                                }
                            }
                            if (parseInt(today.getHours(), 10) === parseInt(h, 10) && parseInt(today.getMinutes(), 10) === parseInt(m, 10)) {
                                classes.push(XDC_TODAY);
                            }
                            time += '<div class="' + XDC_TIME + ' ' + classes.join(' ') + '" data-hour="' + h + '" data-minute="' + m + '">' + now.dateFormat(options.formatTime) + '</div>';
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
                            opt += '<div class="' + XDC_OPTION + ' ' + (_xdsoft_datetime.currentTime.getFullYear() === i ? XDC_CURRENT : '') + '" data-value="' + i + '">' + i + '</div>';
                        }
                        yearselect.children().eq(0)
                            .html(opt);
    
                        for (i = 0, opt = ''; i <= 11; i += 1) {
                            opt += '<div class="' + XDC_OPTION + ' ' + (_xdsoft_datetime.currentTime.getMonth() === i ? XDC_CURRENT : '') + '" data-value="' + i + '">' + getI18n(options.lang,'months')[i] + '</div>';
                        }
                        monthselect.children().eq(0).html(opt);
                        $(datetimepicker)
                            .trigger(XDE_GENERATE);
                    }, 10);
                    event.stopPropagation();
                })
                .on(XDE_AFTEROPEN, function() {
                    if (options.timepicker) {
                        var classType, pheight, height, top;
                        if (timebox.find('.' + XDC_CURRENT).length) {
                            classType = '.' + XDC_CURRENT;
                        } else if (timebox.find('.' + XDC_INIT_TIME).length) {
                            classType = '.' + XDC_INIT_TIME;
                        }
                        if (classType) {
                            pheight = timeboxparent[0].clientHeight;
                            height = timebox[0].offsetHeight;
                            top = timebox.find(classType).index() * options.timeHeightInTimePicker + 1;
                            if ((height - pheight) < top) {
                                top = height - pheight;
                            }
                            timeboxparent.trigger(XDE_SCROLLER_SCROLL_ELEMENT, [parseInt(top, 10) / (height - pheight)]);
                        } else {
                            timeboxparent.trigger(XDE_SCROLLER_SCROLL_ELEMENT, [0]);
                        }
                    }
                });
    
            timerclick = 0;
            calendar
                .on(XDE_CLICK, 'td', function(xdevent) {
                    xdevent.stopPropagation(); // Prevents closing of Pop-ups, Modals and Flyouts in Bootstrap
                    timerclick += 1;
                    var $this = $(this),
                        currentTime = _xdsoft_datetime.currentTime;
    
                    if (currentTime === undefined || currentTime === null) {
                        _xdsoft_datetime.currentTime = _xdsoft_datetime.now();
                        currentTime = _xdsoft_datetime.currentTime;
                    }
    
                    if ($this.hasClass(XDC_DISABLED)) {
                        return false;
                    }
    
                    currentTime.setDate(1);
                    currentTime.setFullYear($this.data('year'));
                    currentTime.setMonth($this.data('month'));
                    currentTime.setDate($this.data('date'));
    
                    datetimepicker.trigger(XDE_SELECT, [currentTime]);
    
                    input.val(_xdsoft_datetime.str());
                    if ((timerclick > 1 || (options.closeOnDateSelect === true || (options.closeOnDateSelect === 0 && !options.timepicker))) && !options.inline) {
                        datetimepicker.trigger(XDE_CLOSE);
                    }
    
                    if (options.onSelectDate && $.isFunction(options.onSelectDate)) {
                        options.onSelectDate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), xdevent);
                    }
    
                    datetimepicker.data('changed', true);
                    datetimepicker.trigger(XDE_XCHANGE);
                    datetimepicker.trigger(XDE_CHANGEDATETIME);
                    setTimeout(function() {
                        timerclick = 0;
                    }, 200);
                });
    
            timebox
                .on(XDE_CLICK, 'div', function(xdevent) {
                    xdevent.stopPropagation();
                    var $this = $(this),
                        currentTime = _xdsoft_datetime.currentTime;
    
                    if (currentTime === undefined || currentTime === null) {
                        _xdsoft_datetime.currentTime = _xdsoft_datetime.now();
                        currentTime = _xdsoft_datetime.currentTime;
                    }
    
                    if ($this.hasClass(XDC_DISABLED)) {
                        return false;
                    }
                    currentTime.setHours($this.data('hour'));
                    currentTime.setMinutes($this.data('minute'));
                    datetimepicker.trigger(XDE_SELECT, [currentTime]);
    
                    datetimepicker.data('input').val(_xdsoft_datetime.str());
                    if (!options.inline) {
                        datetimepicker.trigger(XDE_CLOSE);
                    }
    
                    if (options.onSelectTime && $.isFunction(options.onSelectTime)) {
                        options.onSelectTime.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), xdevent);
                    }
                    datetimepicker.data('changed', true);
                    datetimepicker.trigger(XDE_XCHANGE);
                    datetimepicker.trigger(XDE_CHANGEDATETIME);
                });
    
    
            datepicker
                .on(XDE_MOUSEWHEEL, function(event) {
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
                .on(XDE_MOUSEWHEEL, function(event) {
                    if (!options.scrollInput) {
                        return true;
                    }
                    if (!options.datepicker && options.timepicker) {
                        current_time_index = timebox.find('.' + XDC_CURRENT).length ? timebox.find('.' + XDC_CURRENT).eq(0).index() : 0;
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
                        datetimepicker.trigger(XDE_CHANGEDATETIME);
                        return false;
                    }
                });
    
            datetimepicker
                .on(XDE_CHANGEDATETIME, function(event) {
                    if (options.onChangeDateTime && $.isFunction(options.onChangeDateTime)) {
                        var $input = datetimepicker.data('input');
                        options.onChangeDateTime.call(datetimepicker, _xdsoft_datetime.currentTime, $input, event);
                        delete options.value;
                        $input.trigger('change');
                    }
                })
                .on(XDE_GENERATE, function() {
                    if (options.onGenerate && $.isFunction(options.onGenerate)) {
                        options.onGenerate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }
                    if (triggerAfterOpen) {
                        datetimepicker.trigger(XDE_AFTEROPEN);
                        triggerAfterOpen = false;
                    }
                })
                .on(XDE_CLICK, function(xdevent) {
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
                .on(XDE_OPEN, function(event) {
                    var onShow = true;
                    if (options.onShow && $.isFunction(options.onShow)) {
                        onShow = options.onShow.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), event);
                    }
                    if (onShow !== false) {
                        datetimepicker.show();
                        setPos();
                        $(window)
                            .off(XDE_RESIZE, setPos)
                            .on(XDE_RESIZE, setPos);
    
                        if (options.closeOnWithoutClick) {
                            $([document.body, window]).on(XDE_MOUSEDOWN, function arguments_callee6() {
                                datetimepicker.trigger(XDE_CLOSE);
                                $([document.body, window]).off(XDE_MOUSEDOWN, arguments_callee6);
                            });
                        }
                    }
                })
                .on(XDE_CLOSE, function(event) {
                    var onClose = true;
                    month_picker
                        .find('.' + XDC_MONTH + ',.' + XDC_YEAR)
                        .find('.' + XDC_SELECT)
                        .hide();
                    if (options.onClose && $.isFunction(options.onClose)) {
                        onClose = options.onClose.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), event);
                    }
                    if (onClose !== false && !options.opened && !options.inline) {
                        datetimepicker.hide();
                    }
                    event.stopPropagation();
                })
                .on(XDE_TOGGLE, function(event) {
                    if (datetimepicker.is(':visible')) {
                        datetimepicker.trigger(XDE_CLOSE);
                    } else {
                        datetimepicker.trigger(XDE_OPEN);
                    }
                })
                .data('input', input);
    
            timer = 0;
            timer1 = 0;
    
            datetimepicker.data(XDC_DATETIME, _xdsoft_datetime);
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
                .data(XDC_DATETIMEPICKER, datetimepicker)
                .on([XDE_OPEN, XDE_FOCUSIN, XDE_MOUSEDOWN].join(' '), function(event) {
                    if (input.is(':disabled') || (input.data(XDC_DATETIMEPICKER).is(':visible') && options.closeOnInputClick)) {
                        return;
                    }
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        if (input.is(':disabled')) {
                            return;
                        }
    
                        triggerAfterOpen = true;
                        _xdsoft_datetime.setCurrentTime(getCurrentValue());
    
                        datetimepicker.trigger(XDE_OPEN);
                    }, 100);
                })
                .on(XDE_KEYDOWN, function(event) {
                    var val = this.value,
                        elementSelector,
                        key = event.which;
                    if ([ENTER].indexOf(key) !== -1 && options.enterLikeTab) {
                        elementSelector = $("input:visible,textarea:visible");
                        datetimepicker.trigger(XDE_CLOSE);
                        elementSelector.eq(elementSelector.index(this) + 1).focus();
                        return false;
                    }
                    if ([TAB].indexOf(key) !== -1) {
                        datetimepicker.trigger(XDE_CLOSE);
                        return true;
                    }
                });
        };
        destroyDateTimePicker = function(input) {
            var datetimepicker = input.data(XDC_DATETIMEPICKER);
            if (datetimepicker) {
                datetimepicker.data(XDC_DATETIME, null);
                datetimepicker.remove();
                input
                    .data(XDC_DATETIMEPICKER, null)
                    .off('.'+NS);
                $(window).off(XDE_RESIZE);
                $([window, document.body]).off(XDE_MOUSEDOWN);
                if (input.unmousewheel) {
                    input.unmousewheel();
                }
            }
        };
        $(document)
            .off([XDE_CTRL_KEYDOWN, XDE_CTRL_KEYUP].join(' '))
            .on(XDE_CTRL_KEYDOWN, function(e) {
                if (e.keyCode === CTRLKEY) {
                    ctrlDown = true;
                }
            })
            .on(XDE_CTRL_KEYUP, function(e) {
                if (e.keyCode === CTRLKEY) {
                    ctrlDown = false;
                }
            });
        return this.each(function() {
            var datetimepicker = $(this).data(XDC_DATETIMEPICKER);
            if (datetimepicker) {
                if ($.type(opt) === 'string') {
                    switch (opt) {
                        case 'show':
                            $(this).select().focus();
                            datetimepicker.trigger(XDE_OPEN);
                            break;
                        case 'hide':
                            datetimepicker.trigger(XDE_CLOSE);
                            break;
                        case 'toggle':
                            datetimepicker.trigger(XDE_TOGGLE);
                            break;
                        case 'destroy':
                            destroyDateTimePicker($(this));
                            break;
                        case 'reset':
                            this.value = this.defaultValue;
                            if (!this.value || !datetimepicker.data(XDC_DATETIME).isValidDate(Date.parseDate(this.value, options.format))) {
                                datetimepicker.data('changed', false);
                            }
                            datetimepicker.data(XDC_DATETIME).setCurrentTime(this.value);
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
    $.fn.datetimepicker.setNamespace=setNamespace;
});