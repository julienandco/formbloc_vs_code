import * as _ from "lodash";
import * as changeCase from "change-case";
import * as mkdirp from "mkdirp";

import {
  InputBoxOptions,
  OpenDialogOptions,
  Uri,
  window,
  workspace,
} from "vscode";
import { existsSync, lstatSync, writeFile } from "fs";
import {
  getFormBlocEventTemplate,
  getFormBlocStateTemplate,
  getFormBlocTemplate,
  getSubmissionParamsTemplate,
} from "./templates";
import { FormBlocField } from "./form-bloc-field";

export const newFormBloc = async (uri: Uri) => {
  const blocName = await promptForFormBlocName();
  if (!blocName || blocName.trim() === "") {
    window.showErrorMessage("The bloc name must not be empty");
    return;
  }

  const numOfAttributesInput = await promptForNumberOfAttributes();
  if (!numOfAttributesInput || numOfAttributesInput.trim() === "") {
    window.showErrorMessage("The bloc has to have fields!");
    return;
  }
  const numberOfAttributes = parseInt(numOfAttributesInput);
  if (isNaN(numberOfAttributes)) {
    window.showErrorMessage("Please type in a valid integer!");
    return;
  } else if (numberOfAttributes < 0) {
    window.showErrorMessage("Please type in a positive integer!");
    return;
  }

  let blocFields = [];
  for (let i = 0; i < numberOfAttributes; i++) {
    let name = await promptForAttributeName();
    if (!name || name.trim() === "") {
      window.showErrorMessage("The name of the attribute must not be empty");
      return;
    }
    let stateType = await promptForAttributeStateType();
    if (!stateType || stateType.trim() === "") {
      window.showErrorMessage("The state type of the attribute must not be empty");
      return;
    }
    let submissionType = await promptForAttributeSubmissionType();
    if (!submissionType || submissionType.trim() === "") {
      window.showErrorMessage("The submission type of the attribute must not be empty");
      return;
    }

    blocFields.push(new FormBlocField(name, stateType, submissionType));
  }

  let generateSubmissionParamsInput = await promptForSubmissionParamsGeneration();
  let generateSubmissionParams;
  if (generateSubmissionParamsInput && (generateSubmissionParamsInput.trim() === "y" || generateSubmissionParamsInput.trim() === "yes" || generateSubmissionParamsInput.trim() === "Y" || generateSubmissionParamsInput.trim() === "Yes")) {
    generateSubmissionParams = true;
  }
  else {
    generateSubmissionParams = false;
  }

  let targetDirectory;
  if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
    targetDirectory = await promptForTargetDirectory();
    if (_.isNil(targetDirectory)) {
      window.showErrorMessage("Please select a valid directory");
      return;
    }
  } else {
    targetDirectory = uri.fsPath;
  }

  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  try {
    await generateFormBlocCode(blocName, targetDirectory, blocFields);
    if (generateSubmissionParams) {
      await generateSubmissionParamsCode(blocName, targetDirectory, blocFields);
    }
    window.showInformationMessage(
      `Successfully Generated ${pascalCaseBlocName} FormBloc`
    );
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

function promptForFormBlocName(): Thenable<string | undefined> {
  const formBlocNamePromptOptions: InputBoxOptions = {
    prompt: "FormBloc Name",
    placeHolder: "counter",
  };
  return window.showInputBox(formBlocNamePromptOptions);
}

async function promptForTargetDirectory(): Promise<string | undefined> {
  const options: OpenDialogOptions = {
    canSelectMany: false,
    openLabel: "Select a folder to create the form bloc in",
    canSelectFolders: true,
  };

  return window.showOpenDialog(options).then((uri) => {
    if (_.isNil(uri) || _.isEmpty(uri)) {
      return undefined;
    }
    return uri[0].fsPath;
  });
}

function promptForNumberOfAttributes(): Thenable<string | undefined> {
  const formBlocNamePromptOptions: InputBoxOptions = {
    prompt: "How many attributes do you need?",
    placeHolder: "1",
  };
  return window.showInputBox(formBlocNamePromptOptions);
}

function promptForAttributeName(): Thenable<string | undefined> {
  const formBlocNamePromptOptions: InputBoxOptions = {
    prompt: "Attribute Name",
    placeHolder: "myAttribute",
  };
  return window.showInputBox(formBlocNamePromptOptions);
}

function promptForAttributeStateType(): Thenable<string | undefined> {
  const formBlocNamePromptOptions: InputBoxOptions = {
    prompt: "Attribute State Type (What type does this attribute have within the bloc state?):",
    placeHolder: "String?",
  };
  return window.showInputBox(formBlocNamePromptOptions);
}

function promptForAttributeSubmissionType(): Thenable<string | undefined> {
  const formBlocNamePromptOptions: InputBoxOptions = {
    prompt: "Attribute Submission Type (What type does this attribute have when submitting?):",
    placeHolder: "String",
  };
  return window.showInputBox(formBlocNamePromptOptions);
}

function promptForSubmissionParamsGeneration(): Thenable<string | undefined> {
  const formBlocNamePromptOptions: InputBoxOptions = {
    prompt: "Do you want to generate submission params?",
    placeHolder: "Yes/No (y/n)",
  };
  return window.showInputBox(formBlocNamePromptOptions);
}

async function generateFormBlocCode(
  blocName: string,
  targetDirectory: string,
  fields: Array<FormBlocField>
) {
  const shouldCreateDirectory = workspace
    .getConfiguration("formbloc")
    .get<boolean>("newFormBlocTemplate.createDirectory");
  const blocDirectoryPath = shouldCreateDirectory
    ? `${targetDirectory}/bloc`
    : targetDirectory;
  if (!existsSync(blocDirectoryPath)) {
    await createDirectory(blocDirectoryPath);
  }


  await Promise.all([
    createFormBlocEventTemplate(blocName, blocDirectoryPath, fields),
    createFormBlocStateTemplate(blocName, blocDirectoryPath, fields),
    createFormBlocTemplate(blocName, blocDirectoryPath, fields),
  ]);
}

async function generateSubmissionParamsCode(blocName: string, targetDirectory: string,

  fields: Array<FormBlocField>) {
  const shouldCreateDirectory = workspace
    .getConfiguration("formbloc")
    .get<boolean>("newFormBlocTemplate.createDirectory");
  const blocDirectoryPath = shouldCreateDirectory
    ? `${targetDirectory}/bloc`
    : targetDirectory;
  if (!existsSync(blocDirectoryPath)) {
    await createDirectory(blocDirectoryPath);
  }
  await createSubmissionParamsTemplate(blocName, blocDirectoryPath, fields);
}

function createDirectory(targetDirectory: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdirp(targetDirectory, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

function createFormBlocEventTemplate(
  blocName: string,
  targetDirectory: string,
  fields: Array<FormBlocField>,
) {
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  const targetPath = `${targetDirectory}/${snakeCaseBlocName}_event.dart`;
  if (existsSync(targetPath)) {
    throw Error(`${snakeCaseBlocName}_event.dart already exists`);
  }
  return new Promise<void>(async (resolve, reject) => {
    writeFile(
      targetPath,
      getFormBlocEventTemplate(blocName, fields),
      "utf8",
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      }
    );
  });
}

function createFormBlocStateTemplate(
  blocName: string,
  targetDirectory: string,
  fields: Array<FormBlocField>,
) {
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  const targetPath = `${targetDirectory}/${snakeCaseBlocName}_state.dart`;
  if (existsSync(targetPath)) {
    throw Error(`${snakeCaseBlocName}_state.dart already exists`);
  }

  return new Promise<void>(async (resolve, reject) => {
    writeFile(
      targetPath,
      getFormBlocStateTemplate(blocName, fields),
      "utf8",
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      }
    );
  });
}

function createFormBlocTemplate(
  blocName: string,
  targetDirectory: string,
  fields: Array<FormBlocField>,
) {
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  const targetPath = `${targetDirectory}/${snakeCaseBlocName}_bloc.dart`;
  if (existsSync(targetPath)) {
    throw Error(`${snakeCaseBlocName}_bloc.dart already exists`);
  }
  return new Promise<void>(async (resolve, reject) => {
    writeFile(targetPath, getFormBlocTemplate(blocName, fields), "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

function createSubmissionParamsTemplate(
  blocName: string,
  targetDirectory: string,
  fields: Array<FormBlocField>,
) {
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  const pascalCaseBlocName = changeCase.pascalCase(blocName);

  const targetPath = `${targetDirectory}/submit_${snakeCaseBlocName}_params.dart`;
  if (existsSync(targetPath)) {
    throw Error(`submit_${snakeCaseBlocName}_params.dart already exists`);
  }
  return new Promise<void>(async (resolve, reject) => {
    writeFile(targetPath, getSubmissionParamsTemplate(pascalCaseBlocName, fields), "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}
