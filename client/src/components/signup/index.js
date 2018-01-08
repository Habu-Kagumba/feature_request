import ko from 'knockout';

import template from './signup.html';
import viewModel from './signup';
import './signup.scss';

ko.components.register('signup', { template, viewModel });
