import { LitElement } from 'lit-element'

/** Base class for all application components. */
export class Component extends LitElement {
	/** Override default shadow DOM behavior. */
	createRenderRoot() {
		return this
	}
}