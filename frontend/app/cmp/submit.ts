import { customElement, html, internalProperty, query, LitElement } from 'lit-element'
//Confidence = MLP - \frac{\sum AP -MLP}{\left | AP \right | -1} * 100%

@customElement('submit-page')
export class resultsPage extends LitElement {
	@internalProperty() textbox = ''; //allows us to update the text in the sequence box
	@internalProperty() file: any; //placeholder for user's file

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
	/**
	 * A nice way to fit file uploads into the schema. We use the client's browser to turn the file into a sequence string, and slide it into the text box.
	 */
	onUpload() {
		this.file = this.renderRoot.getElementById("fastaFile").files[0]; //assign the file to the variable

		var reader = new FileReader(); //create an object to parse the file
		reader.onload = (e) => {
			let initialString = e.target.result.split(/\r?\n/); //turn the stringified file into an array, where each index is a new like
			let goodString = "" //placeholder for lines we want to keep
			for (var i in initialString){
				if (initialString[i].startsWith(">") == false){
					goodString = goodString + initialString[i] //if we find a string that doesn't have an arrow (so, not a title line), we add it to goodString (this is in case it's multiple lines)
				}
			
			}
			this.textbox = goodString //then assign the file to the text box.
		});
		reader.readAsText(this.file);

		}
		
	
		

}