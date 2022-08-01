// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {
	newFormBloc
  } from "./new-form-bloc.command";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(_context: vscode.ExtensionContext) {
	  _context.subscriptions.push(
		vscode.commands.registerCommand("formbloc.new-form-bloc", newFormBloc),
	  );

	// // The command has been defined in the package.json file
	// // Now provide the implementation of the command with registerCommand
	// // The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('formbloc.newformbloc', async () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	const blocName = await promptForBlocName();
	// 	if (!blocName || blocName.trim() === "") {
	// 		vscode.window.showErrorMessage("The bloc name must not be empty");
	// 		return;
	// 	}

	// 	const fieldNumString = await promptForBlocFieldNum();
	// 	if (!fieldNumString || fieldNumString.trim() === "") {
	// 		vscode.window.showErrorMessage("The bloc has to have fields!");
	// 		return;
	// 	}
	// 	const fieldNum = parseInt(fieldNumString);
	// 	if (isNaN(fieldNum)) {
	// 		vscode.window.showErrorMessage("Please type in a valid integer!");
	// 		return;
	// 	} else if (fieldNum < 0) {
	// 		vscode.window.showErrorMessage("Please type in a positive integer!");
	// 		return;
	// 	}

	// 	// for(let i = 0; i < fieldNum; i++ ){
	// 	// 	vscode.window.showInformationMessage('Creating field ${ i }!');

	// 	// }


	// 	vscode.window.showInformationMessage(fieldNum.toString());
	// });

	// context.subscriptions.push(disposable);
}

function promptForBlocFieldNum(): Thenable<string | undefined> {
	const blocFieldNumPromptOptions: vscode.InputBoxOptions = {
		prompt: "Number of fields",
		placeHolder: "1",
	};
	return vscode.window.showInputBox(blocFieldNumPromptOptions);
}

function promptForBlocName(): Thenable<string | undefined> {
	const blocNamePromptOptions: vscode.InputBoxOptions = {
		prompt: "Bloc Name",
		placeHolder: "counter",
	};
	return vscode.window.showInputBox(blocNamePromptOptions);
}

// this method is called when your extension is deactivated
export function deactivate() { }

// import * as _ from "lodash";

// import { commands, ExtensionContext, languages, workspace } from "vscode";
// import { analyzeDependencies } from "./utils";
// import {
//   newBloc,
//   newCubit,
//   convertToMultiBlocListener,
//   convertToMultiBlocProvider,
//   convertToMultiRepositoryProvider,
//   wrapWithBlocBuilder,
//   wrapWithBlocListener,
//   wrapWithBlocConsumer,
//   wrapWithBlocProvider,
//   wrapWithRepositoryProvider,
//   wrapWithBlocSelector,
// } from "./commands";
// import { BlocCodeActionProvider } from "./code-actions";

// const DART_MODE = { language: "dart", scheme: "file" };

// export function activate(_context: ExtensionContext) {
//   if (workspace.getConfiguration("bloc").get<boolean>("checkForUpdates")) {
//     analyzeDependencies();
//   }

//   _context.subscriptions.push(
//     commands.registerCommand("extension.new-bloc", newBloc),
//     commands.registerCommand("extension.new-cubit", newCubit),
//     commands.registerCommand(
//       "extension.convert-multibloclistener",
//       convertToMultiBlocListener
//     ),
//     commands.registerCommand(
//       "extension.convert-multiblocprovider",
//       convertToMultiBlocProvider
//     ),
//     commands.registerCommand(
//       "extension.convert-multirepositoryprovider",
//       convertToMultiRepositoryProvider
//     ),
//     commands.registerCommand("extension.wrap-blocbuilder", wrapWithBlocBuilder),
//     commands.registerCommand(
//       "extension.wrap-blocselector",
//       wrapWithBlocSelector
//     ),
//     commands.registerCommand(
//       "extension.wrap-bloclistener",
//       wrapWithBlocListener
//     ),
//     commands.registerCommand(
//       "extension.wrap-blocconsumer",
//       wrapWithBlocConsumer
//     ),
//     commands.registerCommand(
//       "extension.wrap-blocprovider",
//       wrapWithBlocProvider
//     ),
//     commands.registerCommand(
//       "extension.wrap-repositoryprovider",
//       wrapWithRepositoryProvider
//     ),
//     languages.registerCodeActionsProvider(
//       DART_MODE,
//       new BlocCodeActionProvider()
//     )
//   );
// }

