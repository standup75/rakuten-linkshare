import fetch from 'isomorphic-fetch'
import _ from 'lodash'
import { parseString as parseXML } from 'xml2js'

let exported = {}

function xmlToJSON(xml) {
	return new Promise((resolve, reject) => {
		parseXML(xml, {
			trim: true,
			stripPrefix: true,
			normalizeTags: true,
			normalize: true,
			explicitRoot: false,
			tagNameProcessors: [name => _.camelCase(name)],
		}, (err, json) => {
			if (err) {
				reject(err)
				return
			}

			resolve(json.ns1Return ? json.ns1Return : json)
		})
	})
}

function fetchXml(url, headers) {
	return fetch(url, { headers })
	.then(response => {
		if (!response.ok) {
			throw response.statusText
		}
		return response
	})
	.then(response => response.text())
}

function fetchXmlAsJson(url, headers) {
	return new Promise((resolve, reject) => {
		return exported.fetchXml(url, headers)
			.then(xmlToJSON)
	    .then(data => resolve(data))
	    .catch(reject)
	})
}

function fetchJson(url, headers) {
	return fetch(url, { headers }).then(response => response.json())
}

module.exports = exported = {
	fetchXml,
	fetchXmlAsJson,
	fetchJson,
}
