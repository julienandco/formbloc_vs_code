import * as changeCase from "change-case";
import { BlocType } from "../utils";
import { FormBlocField } from "../form-bloc-field";

export function getFormBlocStateTemplate(blocName: string, type: BlocType, fields: Array<FormBlocField>): string {
  switch (type) {
    case BlocType.Freezed:
      return getFreezedFormBlocStateTemplate(blocName, fields);
    case BlocType.Equatable:
      return getEquatableFormBlocStateTemplate(blocName, fields);
    default:
      return getDefaultFormBlocStateTemplate(blocName, fields);
  }
}

//TODO correctly (can abstract class have contstructor etc)
function getEquatableFormBlocStateTemplate(blocName: string, fields: Array<FormBlocField>): string {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  let fieldsString = getFieldsString(fields);
  let constructorString = getConstructorString(fields);
  let propString = getPropsString(fields);
  return `part of '${snakeCaseBlocName}_bloc.dart';

abstract class ${pascalCaseBlocName}State extends Equatable {
  ${fieldsString}
  final bool isSubmitting;
  const ${pascalCaseBlocName}State(${constructorString});
  
  @override
  List<Object> get props => ${propString};
}

class ${pascalCaseBlocName}Initial extends ${pascalCaseBlocName}State {}
`;
}

//TODO
function getDefaultFormBlocStateTemplate(blocName: string, fields: Array<FormBlocField>): string {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  return `part of '${snakeCaseBlocName}_bloc.dart';

@immutable
abstract class ${pascalCaseBlocName}State {}

class ${pascalCaseBlocName}Initial extends ${pascalCaseBlocName}State {}
`;
}

function getFreezedFormBlocStateTemplate(blocName: string, fields: Array<FormBlocField>): string {
  const pascalCaseBlocName = changeCase.pascalCase(blocName) + "State";
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  return `part of '${snakeCaseBlocName}_bloc.dart';

@freezed
class ${pascalCaseBlocName} with _\$${pascalCaseBlocName} {
  const factory ${pascalCaseBlocName}.editing(${getFreezedFactoryString(fields)}) = _${pascalCaseBlocName}Editing;
}
`;
}

function getFreezedFactoryString(fields: Array<FormBlocField>): string {
  let submitString = `${fields.length > 0 ? ", " : ""}@Default(false) bool isSubmitting,`;
  return `{${fields.map((field) => `${field.stateType.slice(-1) === "?" ? "" : "required "}${field.stateType} ${field.name}`).join(", ")}${submitString}}`;
}

function getConstructorString(fields: Array<FormBlocField>): string {
  let constructorString = '';
  if (fields.length > 0) {
    constructorString = `{${fields.map((field) => `this.${field.name}`).join(", ")}, this.isSubmitting = false}`;
  }
  return constructorString;
}

function getFieldsString(fields: Array<FormBlocField>): string {
  return fields.map((field) => `final ${field.stateType} ${field.name};`).join("\n");
}

function getPropsString(fields: Array<FormBlocField>): string {
  let submitString = '';
  if (fields.length > 0) {
    submitString = ', isSubmitting';
  } else { submitString = 'isSubmitting'; }

  return `[${fields.map((field) => field.name).join(", ")}${submitString}]`;
}
