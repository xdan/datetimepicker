describe('Test events', function () {
    describe('when the input is disabled after opening', function () {
        [
            ['date', 'td[data-date="17"][data-month="3"][data-year="2011"]', '2011/04/17 12:00'],
            ['time', '.xdsoft_time[data-hour="12"][data-minute="30"]', '2011/04/15 12:30']
        ].forEach(function (selection) {
            it('ignores ' + selection[0] + ' selection until the input is re-enabled', function (done) {
                var initialValue = '2011/04/15 12:00';
                var changes = 0;
                var input = $(getInput()).val(initialValue).on('change', function () {
                    changes++;
                });
                input.datetimepicker({ format: 'Y/m/d H:i', step: 30 });
                input.datetimepicker('toggle');

                setTimeout(function () {
                    try {
                        var option = input.data(PICKER).find(selection[1]);
                        expect(option.length).to.equal(1);

                        input.prop('disabled', true);
                        option.trigger('click');
                        expect(input.val()).to.equal(initialValue);
                        expect(changes).to.equal(0);

                        input.prop('disabled', false);
                        option.trigger('click');
                        expect(input.val()).to.equal(selection[2]);
                        expect(changes).to.equal(1);
                        done();
                    } catch (error) {
                        done(error);
                    }
                }, 100);
            });
        });
    });

    describe('onSelectDate', function () {
        it('Should fired after user selected day', function (done) {
            var input= $(getInput()).val('2011/04/15');

            var picker = input.datetimepicker({
                onSelectDate: function (time, inp, evt) {
                    expect(picker).to.be.equal(this);
                    expect(time.getDate()).to.be.equal(17);
                    expect(time.getMonth()).to.be.equal(3);
                    expect(time.getFullYear()).to.be.equal(2011);
                    expect(inp[0]).to.be.equal(input[0]);
                    expect(evt.type).to.be.equal('click');
                    done();
                },
                format:	'Y/m/d'
            }).trigger('mousedown').data(PICKER);

            setTimeout(function () {
                var select = picker.find('td[data-date="17"][data-month="3"][data-year="2011"]');
                expect(select.length).to.be.equal(1);
                select.trigger('click');
            }, 100);
        });
    });
});