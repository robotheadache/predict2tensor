import { customElement, html, internalProperty, query } from 'lit-element'
import { Component } from '../src/component'

//Confidence = MLP - \frac{\sum AP -MLP}{\left | AP \right | -1} * 100%


@customElement('submitted-page')
export class AppSubmitted extends Component {
	@internalProperty() proteinID = ''
	async connectedCallback(){
		super.connectedCallback()
		const params = new URLSearchParams(window.location.search)
		
		this.proteinID = params.get('id') 
		
	}
	render() {

		return html`
		<h1>Your Query has been submitted!</h1>
        Your query, job id <b>${this.proteinID}</b>, has been queued for prediction. </br>
		If you chose to submit your email address, you will receive an email when it is completed!
		Otherwise, your results will be availible at <a href="/results?query=${this.proteinID}">this link.</a>
		Soon this will dynamically reload the page :)
		`
	}

}