
export class FormBlocField {
    name: string;
    stateType: string;
    submitType: string;
   
    constructor(fieldName: string, fieldStateType: string, fieldSubmitType: string) {
      this.name = fieldName;
      this.stateType = fieldStateType;
      this.submitType = fieldSubmitType;
    }

    isBool(): boolean {
      return this.submitType === 'bool' || this.submitType === 'bool?';
    }
  }
