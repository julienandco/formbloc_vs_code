import * as changeCase from "change-case";
import { BlocType } from "../utils";
import { FormBlocField } from "../form-bloc-field";


export function getFormBlocTemplate(blocName: string, type: BlocType, fields: Array<FormBlocField>): string {
  switch (type) {
    case BlocType.Freezed:
      return getFreezedFormBlocTemplate(blocName, fields);
    case BlocType.Equatable:
      return getEquatableFormBlocTemplate(blocName, fields);
    default:
      return getDefaultFormBlocTemplate(blocName, fields);
  }
}

//TODO
function getEquatableFormBlocTemplate(blocName: string, fields: Array<FormBlocField>) {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  const blocState = `${pascalCaseBlocName}State`;
  const blocEvent = `${pascalCaseBlocName}Event`;
  return `import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

part '${snakeCaseBlocName}_event.dart';
part '${snakeCaseBlocName}_state.dart';

class ${pascalCaseBlocName}Bloc extends Bloc<${blocEvent}, ${blocState}> {
  ${pascalCaseBlocName}Bloc() : super(${pascalCaseBlocName}Initial()) {
    on<${blocEvent}>((event, emit) {
      // TODO: implement event handler
    });
  }
}
`;
}

//TODO
function getDefaultFormBlocTemplate(blocName: string, fields: Array<FormBlocField>) {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  const blocState = `${pascalCaseBlocName}State`;
  const blocEvent = `${pascalCaseBlocName}Event`;
  return `import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';

part '${snakeCaseBlocName}_event.dart';
part '${snakeCaseBlocName}_state.dart';

class ${pascalCaseBlocName}Bloc extends Bloc<${blocEvent}, ${blocState}> {
  ${pascalCaseBlocName}Bloc() : super(${pascalCaseBlocName}Initial()) {
    on<${blocEvent}>((event, emit) {
      // TODO: implement event handler
    });
  }
}
`;
}

//TODO
export function getFreezedFormBlocTemplate(blocName: string, fields: Array<FormBlocField>) {
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
  ${pascalCaseBlocName}Bloc() : super(_Initial()) {
    on<${blocEvent}>((event, emit) {
      // TODO: implement event handler
    });
  }
}
`;
}
