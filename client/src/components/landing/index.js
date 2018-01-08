import ko from 'knockout';

import viewModel from './landing';
import template from './landing.html';
import './landing.scss';

ko.components.register('landing', { viewModel, template });
