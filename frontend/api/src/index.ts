import { createServer, IncomingMessage, ServerResponse } from 'http'
import { parse } from 'url'
import { cfg } from './config'
import { respondFile, respondJSON, respondJSONFile, respondText, respondRedirect } from './respond'
import {queueJob} from './server'



let server = createServer()

// Log to console on startup
.on('listening', () => {
	console.log(`Listening on port ${cfg.server.port}`)
})

// Log on every request
.on('request', (req: IncomingMessage, res: ServerResponse) => {
	// Default status code
	res.statusCode = 200
	// Get info about request
	let info = parse(req.url!, true);

	if (info.pathname === '/') {
		// Serve up index
		respondFile(res, 'index.html');
		//For when we want to submit queries
	} else if (info.pathname === '/inputhandler') {
		if (req.method === 'POST') {
			let body = '';
			req.on('data', chunk => {
				body += chunk.toString(); // convert Buffer to string
			});
			req.on('end', () => {
				//add the request to a bull queue, then catch the unique identifier
				let parsedResponse = queueJob(body);
				//give the browser a waiting page.
				respondRedirect(res, "/submitted?id="+parsedResponse)
			});
				}
	} else if (info.pathname?.endsWith(".json")) {

		respondJSONFile(res, info.pathname);
	}
	else if (info.pathname === '/results') {
		respondFile(res, 'results.html');
	}
	else if (info.pathname === '/submitted') {
		respondFile(res, 'submitted.html');
	} else {
		// Serve up requested file
		respondFile(res, info.path?.slice(1)!)
	}
})

// Log any critical connection errors
.on('error', (error: any) => {
	if (error.syscall !== 'listen') throw error
	switch (error.code) {
		case 'EACCES':
			console.error(`Port ${cfg.server.port} requires elevated privileges`)
			process.exit(1)
		case 'EADDRINUSE':
			console.error(`Port ${cfg.server.port} is already in use`)
			process.exit(1)
		default:
			throw error
	}
})

// Start listening for requests
.listen(cfg.server.port)

process.on('exit', () => {
	server.close()
})
