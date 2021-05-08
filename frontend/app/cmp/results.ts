import { customElement, html, internalProperty, query } from 'lit-element'
import { Component } from '../src/component'
import { queryResult } from "../../src/interface"
//Confidence = MLP - \frac{\sum AP -MLP}{\left | AP \right | -1} * 100%

@customElement('results-page')
export class resultsPage extends Component {
	@internalProperty() secStrucTemplates = []
	@internalProperty() lengthMarkers = ''
	@internalProperty() json : queryResult = {}
	async connectedCallback(){
		super.connectedCallback()

		const params = new URLSearchParams(window.location.search)
		
		let protein = params.get('query') 
		
		console.log("query = "+protein)
		
		//so long as an ID was passed
		if (protein != null) {
			
			//wait for the server to send us the JSON file
			let file = await fetch(protein+".json")
	
			this.json = await file.json();
			//Here, we build a position marker. We start with a sequence of stars as long as the protein.
			this.lengthMarkers = '*'.repeat(this.json.sequence.length)
			//for each position, we give it a span with text highlight, but the alpha channel is just the confidence.
			for (let i =0; i < this.json.confidence?.length; i++){
				let ssElement = this.json.secStruc[i];
				let ssConfidence = this.json.confidence[i];
				this.secStrucTemplates.push(html`<span style='background: rgba(255, 127, 80, ${ssConfidence});'>${ssElement}</span>`);
			
				let indexBump = i+1;
				//If this iteration is an axis label, we carve out a splot in the sequence for a number.
				if (indexBump %10 === 0){
					this.lengthMarkers = this.lengthMarkers.slice(0, i) + indexBump + this.lengthMarkers.slice(i+indexBump.toString.length) 
				}
			}
			//to be honest, I have no idea why, but the markers have  to be truncated to protein length because even with the carving out it still runs off a little.
			this.lengthMarkers =this.lengthMarkers.slice(0, this.json.sequence.length)
		}
	}
	render() {


		return html`
		<h1>Results for query id ${this.json.id}</h1>
		<h3>Submitted: ${this.json.submitted}</h3>
		<h5>Sequences:</h5>
		<div style="overflow-x: scroll; white-space: nowrap;"><h6>
			<div class='row'><div class="two columns" style="display:inline;">Position:</div><div class='ten columns' style=' font-family: monospace; display:inline;'>${this.lengthMarkers}</div></div>
			<div class='row'><div class="two columns" style="display:inline;">Amino Acid:</div><div class='ten columns' style=' font-family: monospace; display:inline;'>${this.json.sequence}</div></div>
			<div class='row'><div id='secStruc' class="two columns" style="display:inline;">Secondary Structure: </div><div class='ten columns' style=' font-family: monospace; display:inline;'>${this.secStrucTemplates}</div></div>

		</h6></div>
		<div class='row'>
			<div class='one-third column'><h3>Color Key:</h3></div>
			<div class='two-thirds column'><h3>Symbol Key:</h3></div>

		</div>
		<div class='row'>
		<div class='one-third column'>
		<div class='row' style ='background-image: linear-gradient(to right, rgba(255, 127, 80,0), rgba(255, 127, 80,1)); border: 3px solid lightgray; border-radius: 15px;'>
		
			<span style='float:left;'>0%</span><span style='float:right;'>100%</span>
			</div>
		Color is representative of the confidence of prediction for each residue. It is calculated as 
		<img style="max-width:100%;max-height:100%;" src="confEQ.gif">
		Where MLP is the most likely predictions and AP is the set of all predictions. Since the neural network predicts for 8 categories, the cardinality of AP is 8.
		</div>
		<div class="two-thirds column" style="background: LightGray; padding: 10px; border-radius: 15px;" >
	
		<table style="width:100%">
		<tr>
		  <th>Code</th>
		  <th>Element</th>
		</tr>
		<tr>
		  <td>H</td>
		  <td>α-helix</td>
		</tr>
		<tr>
		  <td>B</td>
		  <td>residue in isolated β-bridge</td>
		</tr>
		<tr>
		  <td>E</td>
		  <td>extended strand, participates in β ladder</td>
		</tr>
		<tr>
			<td>G</td>
			<td> 3-helix (3<sub>10</sub> helix)</td>
	  	</tr>
		<tr>
			<td>I</td>
			<td>5 helix (π-helix)</td>
		</tr>
		<tr>
			<td>T</td>
			<td>hydrogen bonded turn</td>
	  	</tr>
		<tr>
		  <td>S</td>
		  <td>bend</td>
		</tr>
		<tr>
			<td>-</td>
			<td>unstructured coil</td>
	  </tr>
	  </table> 
	  </div>
	  </div>

		<h4><a href="/${this.json.id}.json">Click for Raw Output</a></h4>

		
		`
	}

}