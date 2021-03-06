import { createReadStream, existsSync } from 'fs'
import * as fs from "fs";
import { ServerResponse, STATUS_CODES } from 'http'
import { extname } from 'path'
import { queryResult } from '../../src/interface'
import { setHeaders } from './html'

var {connect, getdb} = require('./mongoconn')
var mongodb;
connect(() => ( mongodb = getdb() ))

/** Respond with a generic error response. */
export function respondError(res: ServerResponse, code: number, message: string) {
	res.statusCode = code
	setHeaders(res, 'json')
	res.end(JSON.stringify({ code, status: STATUS_CODES[code], message }))
}

/** Respond with a JSON object. */
export function respondJSON<T>(res: ServerResponse, object: T) {
	setHeaders(res, 'json')
	res.end(JSON.stringify(object, null, ' '))
}

/** Respond with a JSON file stored in the object database. */
export function respondJSONFile<T>(res: ServerResponse, path: string) {
	path = path.replace(".json","").replace("/","");
	var dataObject : queryResult = {};
	mongodb.collection("results").findOne({'id' : path},{projection: {_id:0}}, function(err, result) {
		if (err) throw err;
		dataObject = result;
		setHeaders(res, 'json');
		res.end(JSON.stringify(dataObject, null, ' '));
	  });


}

/** Respond with a file. */
export function respondFile(res: ServerResponse, path: string) {
	if (existsSync(`dist/${path}`)) {
		let stream = createReadStream(`dist/${path}`)
		.on('open', () => {
			setHeaders(res, extname(path).slice(1))
			stream.pipe(res)
		})
		.on('error', () => {
			respondError(res, 404, `File was not found on our server: ${path}`)
		})

		return true
	}

	return false
}


/** Respond with a plaintext message. */
export function respondText(res: ServerResponse, message: string) {
    setHeaders(res, 'txt')
    res.end(message)
}
/** Respond with a redirect to a new url (for when index.ts has fancy stuff to do) **/
export function respondRedirect(res: ServerResponse, path: string){
	res.writeHead(307,
		{Location: path}
	  );
	  res.end();	  

}
