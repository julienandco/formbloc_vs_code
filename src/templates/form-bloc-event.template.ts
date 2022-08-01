import * as changeCase from "change-case";
import { FormBlocField } from "../form-bloc-field";
import { BlocType } from "../utils";

export function getFormBlocEventTemplate(blocName: string, type: BlocType, fields: Array<FormBlocField>): string {
  switch (type) {
    case BlocType.Freezed:
      return getFreezedFormBlocEvent(blocName, fields);
    case BlocType.Equatable:
      return getEquatableFormBlocEventTemplate(blocName, fields);
    default:
      return getDefaultFormBlocEventTemplate(blocName, fields);
  }
}

//TODO
function getEquatableFormBlocEventTemplate(blocName: string, fields: Array<FormBlocField>): string {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  return `part of '${snakeCaseBlocName}_bloc.dart';

abstract class ${pascalCaseBlocName}Event extends Equatable {
  const ${pascalCaseBlocName}Event();

  @override
  List<Object> get props => [];
}
`;
}

//TODO
function getDefaultFormBlocEventTemplate(blocName: string, fields: Array<FormBlocField>): string {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  return `part of '${snakeCaseBlocName}_bloc.dart';

@immutable
abstract class ${pascalCaseBlocName}Event {}
`;
}

function getFreezedFormBlocEvent(blocName: string, fields: Array<FormBlocField>): string {
  const pascalCaseBlocName = changeCase.pascalCase(blocName) + "Event";
  const pascalCaseBlocNameNoEvent = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  return `part of '${snakeCaseBlocName}_bloc.dart';

@freezed
class ${pascalCaseBlocName} with _\$${pascalCaseBlocName} {
  ${fields.map((field) => `const factory ${pascalCaseBlocName}.${buildEventFactoryForField(field)}`).join('\n')}
  const factory ${pascalCaseBlocName}.submit({void Function()? onFailure, void Function()? onSuccess,}) = _Submit${pascalCaseBlocNameNoEvent};
}`;
}

function buildEventFactoryForField(field: FormBlocField): string {
  let pascalCaseFieldName = changeCase.pascalCase(field.name);
  let isBool = field.submitType === 'bool';
  if (isBool) {
    return `toggle${pascalCaseFieldName}() = _Toggle${pascalCaseFieldName}`;
  } else { 
    return `change${pascalCaseFieldName}({${field.submitType.slice(-1) === "?" ? "" : "required"} ${field.submitType} new${pascalCaseFieldName}}) = _Change${pascalCaseFieldName}`; }
}
