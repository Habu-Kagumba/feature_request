import ko from 'knockout';

import template from './login.html';
import viewModel from './login';
import './login.scss';

ko.components.register('login', { template, viewModel });
