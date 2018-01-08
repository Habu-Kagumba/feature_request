import ko from 'knockout';
import _ from 'lodash';

const loadState = (key) => {
  try {
    const serializedState = window.localStorage.getItem(key);
    if (_.isNull(serializedState)) {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};

const saveState = (key, newValue) => {
  try {
    const serializedState = JSON.stringify(newValue);
    window.localStorage.setItem(key, serializedState);
  } catch (e) {
    // Handle write errors
  }
};

ko.extenders.localStore = (target, key) => {
  const value = loadState(key) || target();

  const result = ko.computed({
    read: target,
    write: (newValue) => {
      saveState(key, newValue);
      target(newValue);
    },
  });

  result(value);

  return result;
};
