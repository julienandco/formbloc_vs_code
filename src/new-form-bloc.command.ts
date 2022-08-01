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
} from "./templates";
import { getBlocType, BlocType, TemplateType } from "./utils";
import {FormBlocField} from "./form-bloc-field";

export const newFormBloc = async (uri: Uri) => {
  const blocName = await promptForFormBlocName();
  if (!blocName || blocName.trim() === "") {
    window.showErrorMessage("The bloc name must not be empty");
    return;
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

  // const blocType = await getBlocType(TemplateType.Bloc); //TODO
  const blocType = BlocType.Freezed;
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  try {
    await generateFormBlocCode(blocName, targetDirectory, blocType);
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

async function generateFormBlocCode(
  blocName: string,
  targetDirectory: string,
  type: BlocType
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

  //TODO
  let testFields = [new FormBlocField("testField1", "String?", "String"), new FormBlocField("testField2", "bool", "bool"), new FormBlocField("testField3", "List<MyEnum>?", "List<MyEnum>")];

  await Promise.all([
    createFormBlocEventTemplate(blocName, blocDirectoryPath, type, testFields),
    createFormBlocStateTemplate(blocName, blocDirectoryPath, type, testFields),
    createFormBlocTemplate(blocName, blocDirectoryPath, type, testFields),
  ]);
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
  type: BlocType,
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
      getFormBlocEventTemplate(blocName, type, fields),
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
  type: BlocType,
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
      getFormBlocStateTemplate(blocName, type, fields),
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
  type: BlocType,
  fields: Array<FormBlocField>,
) {
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  const targetPath = `${targetDirectory}/${snakeCaseBlocName}_bloc.dart`;
  if (existsSync(targetPath)) {
    throw Error(`${snakeCaseBlocName}_bloc.dart already exists`);
  }
  return new Promise<void>(async (resolve, reject) => {
    writeFile(targetPath, getFormBlocTemplate(blocName, type, fields), "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}
