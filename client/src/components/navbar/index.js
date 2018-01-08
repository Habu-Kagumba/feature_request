import ko from 'knockout';

import template from './navbar.html';
import viewModel from './navbar';
import './navbar.scss';

ko.components.register('navbar', { template, viewModel });
