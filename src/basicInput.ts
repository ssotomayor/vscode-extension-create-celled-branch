import { window } from 'vscode';

/**
 * Shows a pick list using window.showQuickPick().
 */
export async function showQuickPick() {
	return await window.showQuickPick(['feature', 'bug'], {
		placeHolder: 'feature or bug',
	});
}

/**
 * Shows an input box using window.showInputBox().
 */
export async function showInputBox({placeHolder, prompt}: {placeHolder:string, prompt?:string }) {
	return await window.showInputBox({
		value: '',
		valueSelection: [0, 0],
		placeHolder: `${placeHolder}`,
		prompt: prompt,
		validateInput: ((text) => {
			if(placeHolder.toLowerCase().includes('ticket')){
				return isNaN(text as any) || text === "" ? 'Must be a number!' : null;
			}
			return text === '' ? 'Cannot be empty string!' : null;
		})
	});
}