// @ts-nocheck
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');
const xml2js = require('xml2js');

// const parser = new xml2js.Parser({attrkey: "ATTR"});
const parser = xml2js.parseString;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "rss-news" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.showVNExpress', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World!');

		const panel = vscode.window.createWebviewPanel(
			'showVNExpress', // Identifies the type of the webview. Used internally
			'VN Express News', // Title of the panel displayed to the user
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
			{} // Webview options. More on these later.
		);
		getWebviewContent(panel);
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

function getWebviewContent(panel) {
	axios.get("https://vnexpress.net/rss/tin-moi-nhat.rss").then((response) => {
		if (response.status === 200) {
			// const html = response.data;
			// panel.webview.html = html;
			let html = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <!--
                Use a content security policy to only allow loading images from https or from our extension directory,
                and only allow scripts that have a specific nonce.
                -->
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cat Coding</title>
            </head>
            <body>`;
			parser(response.data, function(error, result){
				if (error == null) {
					// console.log(result);
					// console.log(result.rss.channel[0]);	
					let items = result.rss.channel[0].item;
					html += `<ul>`;
					for (let i=0; i<items.length; i++) {
						html += `<li><h3><a href="`+items[i].link[0]+`">`+items[i].title[0]+`</a></h3>`+items[i].description[0]+`</li>`;
					}
					html += `</ul>`;
				} else {
					console.log(error);
				}
			})
			html += `</body></html>`;
			// console.log(html);
			panel.webview.html = html;
			// console.log(response.data);
		}
	}, (error)=>console.log(error));
}

module.exports = {
	activate,
	deactivate
}
