
import * as vscode from 'vscode';
import {
	newFormBloc
  } from "./new-form-bloc.command";

export function activate(_context: vscode.ExtensionContext) {
	  _context.subscriptions.push(
		vscode.commands.registerCommand("formbloc.new-form-bloc", newFormBloc),
	  );
}

