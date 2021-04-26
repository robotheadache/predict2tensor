/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import {LitElement, html, css} from 'lit-element';
var plotly = require('plotly')("theodoredomingo", "l4CWBdysjxvZ7HDU32nL")
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class RangeChart extends LitElement {
 
  static get properties() {
    return {
      /**
       * The name to say "Hello" to.
       */
      ID: {type: String},
    };
  }

  constructor() {
    super();
    this.name = ;
  }

  render() {
    return html``;
  }
  }
}

window.customElements.define('my-element', RangeChart);
