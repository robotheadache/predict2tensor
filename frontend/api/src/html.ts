import { ServerResponse } from 'http'

/** List of valid mime types. */
export const enum MimeType {
	Application	= 'application',
	Audio		= 'audio',
	Font		= 'font',
	Image		= 'image',
	Text		= 'text',
	Video		= 'video'
}

/** Mapping from file extensions to MIME types. */
let MIME_TYPES: Record<string, MimeType> = {
	'css': MimeType.Text,
	'html': MimeType.Text, 
	'json': MimeType.Application,
	'ico': MimeType.Image
}

/** Get a MIME type from a file's extension. */
export function mimeType(path: string) {
	let mime = MIME_TYPES[path]
	return mime ? `${mime}/${path}` : 'application/octet-stream'
}

/** Set HTML headers of a file's response. */
export function setHeaders(res: ServerResponse, path: string) {
	let mime = MIME_TYPES[path]
	res.setHeader('Content-Type', mime ? `${mime}/${path}` : 'application/octet-stream')
}