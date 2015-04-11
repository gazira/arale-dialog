var $ = require('jquery'),
    btnTpl = require('./btn.handlebars'),
    Dialog = require('./dialog');

var template = require('./confirmbox.handlebars');

var btnId = 0;
var defaultConfig = {
    title: '',
    content: '',
    width: 375,
    height: 275,
    buttons: [
        {
            text: '关闭',
            action: 'close'
        }
    ]
};

// ConfirmBox
// -------
// ConfirmBox 是一个有基础模板和样式的对话框组件。
var ConfirmBox = Dialog.extend({

  attrs: {
    title: defaultConfig.title,
    content: defaultConfig.content,
    width: defaultConfig.width,
    height: defaultConfig.height,
    buttonTpl: '',
    buttons: []
  },

  setup: function () {
    ConfirmBox.superclass.setup.call(this);

    var buttons = this.get('buttons');
    var container = this.$('[data-role=buttons]').eq(0);
    var html = [];
    for(var i = 0, len = buttons.length; i < len; i++) {
        var btn = buttons[i];
        var actionName = typeof btn.action === 'string' ? btn.action : 'click_' + (++btnId);
        html.push(btnTpl({
            className: btn.className || 'btn-default',
            action: actionName,
            text: btn.text
        }));
        if(actionName !== 'close' && actionName !== 'confirm') {
            this.delegateEvents('click [data-action=' + actionName + ']', (function(actionName) {
                return function(e) {
                    e.preventDefault();
                    this.trigger(actionName, e, $(e.target));
                };
            })(actionName));
        }
    }
    container.html(html.join(''));
    this.after('show', function() {
        for(var i = 0, len = buttons.length; i < len; i++) {
            var btn = buttons[i];
            if(btn.focus === true) {
                container.children().eq(i).focus();
            }
        }
    })
  },

  events: {
    'click [data-action=confirm]': function (e) {
      e.preventDefault();
      this.trigger('confirm');
    },
    'click [data-action=close]': function (e) {
      e.preventDefault();
      this.trigger('close');
      this.hide();
    }
  },

  _onChangeContent: function (val) {
    this.$('[data-role=content]').html(val);
  },

  _onChangeTitle: function (val) {
    this.$('[data-role=title]').html(val);
  }
});

ConfirmBox.alert = function (options) {
    options = options || {};
    options = $.extend(true, {}, defaultConfig, options);
    if(options.buttons.length !== 1) {
        options.buttons = [options.buttons[0]];
    }
    return new ConfirmBox(options).show().after('hide', function() {
        this.destroy();
    });
};

ConfirmBox.confirm = function (options) {
    options = options || {};
    options = $.extend(true, defaultConfig, {
        buttons: [
            {
                text: '确认',
                action: 'confirm'
            },
            {
                text: '取消',
                action: 'close'
            }
        ]
    }, options);
    options.buttons = options.buttons.slice(0, 2);
    return new ConfirmBox(options).show().after('hide', function() {
        this.destroy();
    });
};

ConfirmBox.show = function (options) {
    options = options || {};
    options = $.extend({}, defaultConfig, options);
    return new ConfirmBox(options).show().after('hide', function() {
        this.destroy();
    });
};

module.exports = ConfirmBox;
