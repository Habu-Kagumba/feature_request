import ko from 'knockout';

import template from './app.html';
import viewModel from './app';
import './app.scss';
import '../navbar';
import '../flash';
import '../landing';
import '../signup';
import '../login';
import '../logout';

ko.components.register('app', { template, viewModel });
