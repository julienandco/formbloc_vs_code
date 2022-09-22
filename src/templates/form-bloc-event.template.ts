import * as changeCase from "change-case";
import { FormBlocField } from "../form-bloc-field";

export function getFormBlocEventTemplate(blocName: string, fields: Array<FormBlocField>): string {
  return getFreezedFormBlocEvent(blocName, fields);
}

function getFreezedFormBlocEvent(blocName: string, fields: Array<FormBlocField>): string {
  const pascalCaseEventName = changeCase.pascalCase(blocName) + "Event";
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  return `part of '${snakeCaseBlocName}_bloc.dart';

@freezed
class ${pascalCaseEventName} with _\$${pascalCaseEventName} {
  ${fields.map((field) => `const factory ${pascalCaseEventName}.${buildEventFactoryForField(field)}`).join('\n\t')}
  const factory ${pascalCaseEventName}.submit({void Function()? onFailure, void Function()? onSuccess,}) = _Submit${pascalCaseBlocName};
}`;
}

function buildEventFactoryForField(field: FormBlocField): string {
  let pascalCaseFieldName = changeCase.pascalCase(field.name);
  if (field.isBool()) {
    return `${buildEventNameForField(field, false)}() = _${buildEventNameForField(field, true)};`;
  } else {
    return `${buildEventNameForField(field, false)}({${field.submitType.slice(-1) === "?" ? "" : "required"} ${field.submitType} new${pascalCaseFieldName}}) = _${buildEventNameForField(field, true)};`;
  }
}

export function buildEventNameForField(field: FormBlocField, capitalize: boolean): string {
  let pascalCaseFieldName = changeCase.pascalCase(field.name);
  if (field.isBool()) {
    return `${capitalize ? "T" : "t"}oggle${pascalCaseFieldName}`;
  } else {
    return `${capitalize ? "C" : "c"}hange${pascalCaseFieldName}`;
  }
}
