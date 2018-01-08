/* eslint-disable object-curly-newline */

import { connect } from 'knockout-store';

class Flash {
  constructor(params) {
    this.params = params;

    this.showFlash = this.params.showFlash;
    this.flashClass = this.params.flashClass;
    this.flashMessage = this.params.flashMessage;

    this.showFlash.subscribe((newValue) => {
      if (newValue) {
        setTimeout(() => this.closeFlash(), 3000);
      }
    });
  }

  closeFlash() {
    this.showFlash(false);
    this.flashClass(undefined);
    this.flashMessage(undefined);
  }

  setIcon() {
    const icons = {
      'is-success': 'fa-check',
      'is-danger': 'fa-warning',
      'is-info': 'fa-info-circle',
    };

    return icons[this.flashClass()];
  }
}

function mapStateParams({ showFlash, flashClass, flashMessage }) {
  return { showFlash, flashClass, flashMessage };
}

export default connect(mapStateParams)(Flash);
