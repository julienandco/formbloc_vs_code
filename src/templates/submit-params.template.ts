import { FormBlocField } from "../form-bloc-field";

export function getSubmissionParamsTemplate(blocName: string,  fields: Array<FormBlocField>): string {
    return `import 'package:equatable/equatable.dart';
class Submit${blocName}Params extends Equatable {
    ${fields.map((field) => `final ${field.submitType} ${field.name};`).join('\n\t\t')}
    final int skip;
    final int limit;
    
    const Submit${blocName}Params({
    ${fields.map((field) => `required this.${field.name},`).join('\n\t\t')}
    this.skip = 0,
    this.limit = 10,
    });
    
    @override
    List<Object?> get props => [
        ${fields.map((field) => `${field.name},`).join('\n\t\t\t\t')}
        skip,
        limit,
    ];
}`;
}