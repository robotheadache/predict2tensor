import { customElement, html, internalProperty, query, LitElement } from 'lit-element'
//Confidence = MLP - \frac{\sum AP -MLP}{\left | AP \right | -1} * 100%

@customElement('submit-page')
export class resultsPage extends LitElement {
	@internalProperty() textbox = '';
	@internalProperty() file: any;

	async connectedCallback(){
		super.connectedCallback()

	}

	render() {


		return html`
		<link rel="stylesheet" href="css/normalize.css">
 		 <link rel="stylesheet" href="css/skeleton.css">
		 
		<div class="row" style=""><h3>Submit a protein:</h3></div> 
		<form action="/inputhandler" method="POST">
		<div class="row" style="margin-left: 5%; background: LightGray; padding: 10px; border-radius: 15px"> 
		<div class="two-thirds column" >
		<input class="u-full-width" placeholder="Give your job a name" id="jobid" name="id" required>
	  
		  <h5>Upload a .FASTA file</h5> 
		  <input type="file" id="fastaFile" name="filename" @change=${this.onUpload}  accept=".fasta">
		  <h4>OR</h4>
		  <h5>Enter a Sequence</h5>
		  </div>
		  <div class="one-third column">
		  <h5>Enter a contact email:</h5>
			  <input class="u-full-width" type="email" placeholder="Enter your email!" id="contactemail" name="email">
				<input class="button-primary" type="submit" value="Submit" style="background-color: rgba(255, 127, 80); border-color: rgba(255, 127, 80);">
			</div>
		  <textarea class="u-full-width" placeholder="Enter a sequence…"  id="sequenceinput", name="sequence" style="resize: vertical;" required>${this.textbox}</textarea> 
		
		</div>
	  </form>
	  
`
	}
	onUpload() {
		this.file = this.renderRoot.getElementById("fastaFile").files[0];

		console.log(this.file)

		var reader = new FileReader();
		reader.onload = (e) => {
			let initialString = e.target.result.split(/\r?\n/);
			let goodString = ""
			for (var i in initialString){
				if (initialString[i].startsWith(">") == false){
					goodString = goodString + initialString[i]
				}
			
			}
			this.textbox =goodString
		});
		reader.readAsText(this.file);

		this.renderRoot.getElementById("fastaFile").files = null;
		}
		
	
		

}