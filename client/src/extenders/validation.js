import ko from 'knockout';
import { isEmail, matches, normalizeEmail, trim, isLength, equals } from 'validator';
import _ from 'lodash';

ko.validation = {};

function ErrorViewModel(key, message) {
  this.key = ko.observable(key);
  this.message = ko.observable(message);
}

const initializeErrors = (target) => {
  target.errors = target.errors || ko.observableArray([]);
};

const findError = (target, key) => _.find(target.errors(), e => e.key() === key);

const addError = (target, error, key, message) => {
  if (!error) {
    error = new ErrorViewModel(key, message);
    target.errors.push(error);
  }
};

ko.validation.register = (name, fail, defaultErrorMessage) => {
  ko.extenders[name] = (target, options) => {
    initializeErrors(target);

    const validate = (newValue) => {
      if (newValue !== undefined) {
        const error = findError(target, name);
        fail(newValue, options)
          .then((failed) => {
            if (failed) {
              addError(target, error, name, options.message || defaultErrorMessage);
            } else {
              target.errors.remove(error);
            }
          });
      }
    };

    validate(target());

    target.subscribe(validate);

    return target;
  };
};


ko.validation.register(
  'required',
  (newValue) => {
    return new Promise((resolve) => {
      resolve(_.isNull(newValue) || _.isUndefined(newValue) || newValue === '');
    });
  },
  'This field is required.',
);

ko.validation.register(
  'alphanumeric',
  (newValue) => {
    return new Promise((resolve) => {
      if (typeof newValue === 'function' || newValue === undefined) newValue = '';
      resolve(!matches(trim(newValue), /^[a-z\d\-_\s]{3,25}$/i));
    });
  },
  'This filed should only contain alphanumeric characters.',
);

ko.validation.register(
  'availability',
  (newValue, options) => {
    if (newValue.length < 3) return new Promise(resolve => resolve(null));
    return fetch(`/${ko.unwrap(options.model)}/${newValue}`)
      .then(response => (ko.unwrap(options.exist) ? !response.ok : response.ok));
  },
  'Not available!',
);

ko.validation.register(
  'email',
  (newValue) => {
    return new Promise((resolve) => {
      resolve(!isEmail(normalizeEmail(newValue)));
    });
  },
  'Not a valid email.',
);

ko.validation.register(
  'minLength',
  (newValue, options) => {
    return new Promise((resolve) => {
      resolve(!isLength(trim(newValue), { min: ko.unwrap(options.min) }));
    });
  },
  'Input too short',
);

ko.validation.register(
  'passwordMatch',
  (newValue, options) => {
    return new Promise((resolve) => {
      const val = document.getElementById(ko.unwrap(options.element)).value;
      resolve(!equals(trim(newValue), trim(val)));
    });
  },
  'Passwords do not match',
);
