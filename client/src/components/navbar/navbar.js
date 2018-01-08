import { connect } from 'knockout-store';
import _ from 'lodash';

class Navbar {
  constructor(params) {
    this.params = params;
    this.isAuthenticated = this.params.isAuthenticated;

    this.constructor.burgerMenu();
  }

  static burgerMenu() {
    const navbarBurgers = _.slice(document.querySelectorAll('.navbar-burger'), 0);

    if (navbarBurgers.length > 0) {
      navbarBurgers.forEach((el) => {
        el.addEventListener('click', () => {
          const { dataset: { target } } = el;
          const $target = document.getElementById(target);

          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
        });
      });
    }
  }
}

function mapStateParams({ isAuthenticated }) {
  return { isAuthenticated };
}

export default connect(mapStateParams)(Navbar);
