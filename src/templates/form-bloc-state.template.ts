import * as changeCase from "change-case";
import { FormBlocField } from "../form-bloc-field";

export function getFormBlocStateTemplate(blocName: string, fields: Array<FormBlocField>): string {
  return getFreezedFormBlocStateTemplate(blocName, fields);
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