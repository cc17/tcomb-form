'use strict';

import t from 'tcomb-validation';

function getAlert(type, children) {
  var className = {
    ui: true,
    message: true
  };
  className[type] = true;
  return {
    tag: 'div',
    attrs: { className: className },
    children: children
  };
}

function getLabel(opts) {
  if (!opts.label) { return; }
  return {
    tag: 'label',
    attrs: {
      htmlFor: opts.htmlFor,
      id: opts.id
    },
    children: opts.label
  };
}

function getHelp(locals) {
  if (!locals.help) { return; }
  return {
    tag: 'div',
    attrs: {
      className: 'ui pointing label visible',
      id: locals.id + '-tip'
    },
    children: locals.help
  };
}

function getError(locals) {
  if (!locals.hasError || !locals.error) { return; }
  return {
    tag: 'div',
    attrs: {
      className: 'ui pointing label visible red'
    },
    children: locals.error
  };
}

function getHiddenTextbox(locals) {
  return {
    tag: 'input',
    attrs: {
      type: 'hidden',
      value: locals.value,
      name: locals.name
    },
    events: {
      change: function (evt) {
        locals.onChange(evt.target.value);
      }
    }
  };
}

function getOption(opts) {
  return {
    tag: 'option',
    attrs: {
      disabled: opts.disabled,
      value: opts.value
    },
    children: opts.text,
    key: opts.value
  };
}

function getOptGroup(opts) {
  return {
    tag: 'optgroup',
    attrs: {
      disabled: opts.disabled,
      label: opts.label
    },
    children: opts.options.map(getOption),
    key: opts.label
  };
}

function getButton(options) {
  return {
    tag: 'button',
    attrs: {
      className: {
        ui: true,
        basic: true,
        button: true
      }
    },
    events: {
      click: options.click
    },
    children: options.label,
    key: options.key
  };
}

function getRow(options) {
  return {
    tag: 'div',
    attrs: {
      className: {
        ui: true,
        grid: true
      }
    },
    children: options.children,
    key: options.key
  };
}

function getCol(options) {
  return {
    tag: 'div',
    attrs: {
      className: options.className
    },
    children: options.children
  };
}

function getButtonGroup(buttons) {
  return {
    tag: 'div',
    attrs: {
      className: {
        ui: true,
        basic: true,
        buttons: true
      }
    },
    children: buttons
  };
}

export function textbox(locals) {

  if (locals.type === 'hidden') {
    return getHiddenTextbox(locals);
  }

  const attrs = t.mixin({}, locals.attrs);

  let tag = 'textarea';
  if (locals.type !== 'textarea') {
    tag = 'input';
    attrs.type = locals.type;
  }

  attrs.className = t.mixin({}, attrs.className);
  attrs.className['form-control'] = true;

  attrs.disabled = locals.disabled;
  if (locals.type !== 'file') {
    attrs.value = locals.value;
  }
  attrs.onChange = locals.type === 'file' ?
    evt => locals.onChange(evt.target.files[0]) :
    evt => locals.onChange(evt.target.value);

  if (locals.help) {
    attrs['aria-describedby'] = attrs['aria-describedby'] || attrs.id + '-tip';
  }

  const control = {
    tag,
    attrs: attrs
  };

  const label = getLabel({
    label: locals.label,
    htmlFor: attrs.id
  });
  const help = getHelp(locals);
  const error = getError(locals);

  return {
    tag: 'div',
    attrs: {
      className: {
        field: true,
        error: locals.hasError,
        disabled: locals.disabled
      }
    },
    children: [
      label,
      control,
      help,
      error
    ]
  };
}

export function checkbox(locals) {

  const attrs = t.mixin({}, locals.attrs);
  attrs.type = 'checkbox';
  attrs.disabled = locals.disabled;
  attrs.checked = locals.value;
  attrs.onChange = evt => locals.onChange(evt.target.checked);

  if (locals.help) {
    attrs['aria-describedby'] = attrs['aria-describedby'] || (attrs.id + '-tip');
  }

  const control = {
    tag: 'input',
    attrs: attrs
  };
  const label = getLabel({
    label: locals.label,
    htmlFor: attrs.id
  });
  const help = getHelp(locals);
  const error = getError(locals);

  return {
    tag: 'div',
    attrs: {
      className: {
        field: true,
        inline: true,
        error: locals.hasError,
        disabled: locals.disabled
      }
    },
    children: {
      tag: 'div',
      attrs: {
        className: {
          ui: true,
          checkbox: true
        }
      },
      children: [
        control,
        label,
        help,
        error
      ]
    }
  };
}

export function select(locals) {

  const attrs = t.mixin({}, locals.attrs);

  attrs.className = t.mixin({}, attrs.className);
  attrs.className['form-control'] = true;

  attrs.multiple = locals.isMultiple;
  attrs.disabled = locals.disabled;
  attrs.value = locals.value;
  attrs.onChange = evt => {
    const value = locals.isMultiple ?
      Array.prototype.slice.call(evt.target.options)
        .filter(option => option.selected)
        .map(option => option.value) :
      evt.target.value;
    locals.onChange(value);
  };

  if (locals.help) {
    attrs['aria-describedby'] = attrs['aria-describedby'] || (attrs.id + '-tip');
  }

  const options = locals.options.map(x => x.label ?
    getOptGroup(x) :
    getOption(x)
  );

  const control = {
    tag: 'select',
    attrs,
    children: options
  };

  const label = getLabel({
    label: locals.label,
    htmlFor: attrs.id
  });
  const help = getHelp(locals);
  const error = getError(locals);

  return {
    tag: 'div',
    attrs: {
      className: {
        field: true,
        error: locals.hasError,
        disabled: locals.disabled
      }
    },
    children: [
      label,
      control,
      help,
      error
    ]
  };
}

export function radio(locals) {

  const id = locals.attrs.id;
  const onChange = evt => locals.onChange(evt.target.value);

  var control = {
    tag: 'div',
    attrs: {
      className: {
        fields: true,
        grouped: true
      }
    },
    children: locals.options.map(function (option, i) {

      const attrs = t.mixin({}, locals.attrs);
      attrs.type = 'radio';
      attrs.checked = (option.value === locals.value);
      attrs.disabled = locals.disabled;
      attrs.value = option.value;
      attrs.autoFocus = attrs.autoFocus && (i === 0);
      attrs.id = `${id}_${i}`;
      attrs['aria-describedby'] = attrs['aria-describedby'] || (locals.label ? id : null);
      attrs.onChange = onChange;

      return {
        tag: 'div',
        attrs: {
          className: {
            field: true
          }
        },
        children: {
          tag: 'div',
          attrs: {
            className: {
              ui: true,
              radio: true,
              checkbox: true
            }
          },
          children: [
            {
              tag: 'input',
              attrs: attrs
            },
            {
              tag: 'label',
              children: option.text,
              events: {
                click: function () {
                  document.getElementById(attrs.id).click();
                }
              }
            }
          ],
        },
        key: option.value
      };
    })
  };

  const label = getLabel({
    label: locals.label,
    htmlFor: id
  });
  const help = getHelp(locals);
  const error = getError(locals);

  return {
    tag: 'div',
    attrs: {
      className: {
        field: true,
        error: locals.hasError,
        disabled: locals.disabled
      }
    },
    children: [
      label,
      control,
      help,
      error
    ]
  };
}

export function date() {
  throw new Error('dates are not (yet) supported');
}

export function struct(locals) {

  var rows = [];

  if (locals.label) {
    rows.push({
      tag: 'legend',
      attrs: {
        className: {
          ui: true,
          header: true
        }
      },
      children: locals.label
    });
  }

  if (locals.help) {
    rows.push(getAlert('info', locals.help));
  }

  rows = rows.concat(locals.order.map(function (name) {
    return locals.inputs[name];
  }));

  if (locals.error && locals.hasError) {
    rows.push(getAlert('error', locals.error));
  }

  return {
    tag: 'fieldset',
    attrs: {
      disabled: locals.disabled,
      style: {
        border: 0,
        margin: 0,
        padding: 0
      },
      className: {
        ui: true,
        form: true,
        segment: locals.path.length > 0,
        error: locals.hasError
      }
    },
    children: rows
  };

}

export function list(locals) {

  var rows = [];

  if (locals.label) {
    rows.push({
      tag: 'legend',
      attrs: {
        className: {
          ui: true,
          header: true
        }
      },
      children: locals.label
    });
  }

  if (locals.help) {
    rows.push(getAlert('info', locals.help));
  }

  rows = rows.concat(locals.items.map(function (item) {
    if (item.buttons.length === 0) {
      return getRow({
        key: item.key,
        children: [
          getCol({
            className: {
              six: true,
              wide: true,
              column: true
            },
            children: item.input
          })
        ]
      });
    }
    return getRow({
      key: item.key,
      children: [
        getCol({
          className: {
            eight: true,
            wide: true,
            column: true
          },
          children: item.input
        }),
        getCol({
          className: {
            four: true,
            wide: true,
            column: true
          },
          children: getButtonGroup(item.buttons.map(function (button, i) {
            return getButton({
              click: button.click,
              key: i,
              label: button.label
            });
          }))
        })
      ]
    });
  }));

  if (locals.error && locals.hasError) {
    rows.push(getAlert('error', locals.error));
  }

  if (locals.add) {
    rows.push(getButton(locals.add));
  }

  return {
    tag: 'fieldset',
    attrs: {
      disabled: locals.disabled,
      style: {
        border: 0,
        margin: 0,
        padding: 0
      },
      className: {
        ui: true,
        form: true,
        segment: locals.path.length > 0,
        error: locals.hasError
      }
    },
    children: rows
  };
}

