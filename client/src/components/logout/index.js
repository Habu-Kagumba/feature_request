import ko from 'knockout';

import template from './logout.html';
import viewModel from './logout';
import './logout.scss';

ko.components.register('logout', { template, viewModel });
