import ko from 'knockout';

import template from './flash.html';
import viewModel from './flash';
import './flash.scss';

ko.components.register('flash', { template, viewModel });
