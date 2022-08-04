import * as changeCase from "change-case";
import { FormBlocField } from "../form-bloc-field";
import { buildEventNameForField } from "./form-bloc-event.template";


export function getFormBlocTemplate(blocName: string, fields: Array<FormBlocField>): string {
  return getFreezedFormBlocTemplate(blocName, fields);
}

function getFreezedFormBlocTemplate(blocName: string, fields: Array<FormBlocField>) {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  const blocState = `${pascalCaseBlocName}State`;
  const blocEvent = `${pascalCaseBlocName}Event`;
  return `import 'package:bloc/bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part '${snakeCaseBlocName}_event.dart';
part '${snakeCaseBlocName}_state.dart';
part '${snakeCaseBlocName}_bloc.freezed.dart';

class ${pascalCaseBlocName}Bloc extends Bloc<${blocEvent}, ${blocState}> {
  ${pascalCaseBlocName}Bloc() : super(const _${pascalCaseBlocName}Editing(//TODO: fill)) {
    ${fields.map(buildEventHandlerDeclarationForField).join('\n\t\t')}
    on<_Submit${pascalCaseBlocName}>(_onSubmit);
  }

  ${fields.map(buildEventHandlerForField).join('\n\n\t')}

  void _onSubmit(_Submit${pascalCaseBlocName} event, Emitter emit) {
    //TODO: implement event handler
  }
}
`;
}

function buildEventHandlerDeclarationForField(field: FormBlocField): string {
  return `on<_${buildEventNameForField(field, true)}>(${buildInternalBlocEventHandlerNameForField(field)});`;
}

function buildInternalBlocEventHandlerNameForField(field: FormBlocField): string {
  return `_on${buildEventNameForField(field, true)}`;
}

function buildEventHandlerForField(field: FormBlocField): string {
  let action = field.isBool() ? `!state.${field.name}` : `event.new${changeCase.pascalCase(field.name)}`;
  return `void ${buildInternalBlocEventHandlerNameForField(field)}(_${buildEventNameForField(field, true)} event, Emitter emit) => emit(state.copyWith(${field.name}: ${action}));`;
}
