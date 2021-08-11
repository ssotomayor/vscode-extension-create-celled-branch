'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window, extensions } from 'vscode';
import { getGitRepositoryPath, sanitize } from './gitUtils';
import { showQuickPick, showInputBox } from './basicInput';

const api = extensions.getExtension('vscode.git')!.exports;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json


	let disposable = vscode.commands.registerCommand('extension.create-celled-branch', async () => {
		let initials = context.workspaceState.get("initials") || vscode.workspace.getConfiguration().get('conf.celled.initials');

		if(initials === undefined){
			initials = await showInputBox({
				placeHolder: `Your Initials`, 
				prompt: 'First Time? ENTER YOUR INITIALS!'
			});
			context.workspaceState.update("initials", initials);
		}

		const fob = await showQuickPick();
		
		if(fob !== undefined){
			const ticketN = await showInputBox({
				placeHolder: `${fob}/CET-<TICKET NUMBER>`, 
				prompt: 'Enter Ticket Number'
			});
			
			if(ticketN !== undefined) {
				let description = await showInputBox({ 
					placeHolder:`${fob}/CET-${ticketN || ''}-${initials}-<DESCRIPTION>`,
					prompt: `Words describing the ${fob}`
				});
				
				if(description !== undefined) {
					description = description && description.replace(/ /g,"-");
					
					let branchName = sanitize(`${fob}/WEBAPP-${ticketN}-${initials}-${description}`);

					const gitPath = await api.getGitPath();
					let log = '';
					let error = '';
					let spawn = require('child_process').spawn;
					let path = await getGitRepositoryPath(vscode.workspace.rootPath || "");
					let ls = spawn(gitPath, ['checkout', '-b', branchName], {cwd: path});
					ls.stdout.on('data', function(data?:string) {
						log += data + '\n';
					});
					ls.stderr.on('data', function(data?:string) {
						error += data + '\n';
					});
					ls.on('exit', function(code:Number) {
						if(code > 0) {
							return;
						}
						let message = log;
						if(code === 0 && error.length > 0) {
							message += '\n\n' + error;
						}
					});

					window.showInformationMessage(`Branch: ${branchName}`);
				}
			}
		}
	});
	
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}