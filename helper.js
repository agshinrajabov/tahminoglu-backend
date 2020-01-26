const exphbs  = require('express3-handlebars');
const moment = require('moment');

moment.locale('tr');
var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        striptags: function (txt) { 
            if(typeof txt == "undefined") return;
            var regexp = /<\/?[^>]+(>|$)/g
            return txt.replace(regexp, '').substring(0,120) + "...".trim();
        },
        eq: function() {
            const args = Array.prototype.slice.call(arguments, 0, -1);
            return args.every(function (expression) {
                return args[0] === expression;
            });
        },
        switch: function(value, options) {
            this._switch_value_ = value;
            var html = options.fn(this); // Process the body of the switch block
            delete this._switch_value_;
            return html;
        },
        case: function(value, options) {
            if (value == this._switch_value_) {
            return options.fn(this);
            }
        },
    },
    partialsDir: [
        "views/partials"
    ], 
    extname: 'hbs',
    layoutsDir: 'views',
    defaultLayout: false
});

module.exports = hbs