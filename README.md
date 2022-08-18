# formbloc 📝

A VSCode extension to generate [Blocs](https://pub.dev/packages/bloc) that handle forms. Say goodbye to all the boilerplate event factories and event handlers à la ```void _onSth(Event event, Emitter emit) => emit(state.copyWith(sth: event.sth));```, just generate it!

## Features 🚀

Generates boilerplate bloc code to be used as state management of some fill-out-form within your flutter app!

## Usage 👨🏻‍💻

When run, it will prompt you for

- the name of the bloc (as the regular bloc VSCode extension does)
- the number of attributes (if your bloc manages name, email and password, you would type in "3" here)

Then for each attribute:

- its name (the name of the attribute in the code)
- its stateType (the type it holds within the bloc state)
- its submissionType (the type it holds when you send it to the backend)

And last but not least

- generate submission params (yes, no)

This is part of the clean code architecture I established, if you do not know what this is, feel free to check it out or just respond "No" to this prompt.

### Why stateType and submissionType?

Say you want to receive a user input to set a value of your ```MyEnum``` enum. If you use the type ```MyEnum``` in the bloc's state, you will have to pass it some value when instantiating the blocstate, thus you will need to define an initial value, or define which one of the values you want to have there initially. If on the other hand you used ```MyEnum?``` (i.e. made it nullable) within the bloc's state, you can circumvent this intial value problem. So here, you would pass MyEnum? as ```stateType``` and MyEnum as ```submissionType```. On the other hand, if you DO want an initial value (say for instance ```MyEnum.dessert```), then you can of course just pass ```MyEnum``` as stateType, as well as submissionType.

## Requirements ℹ️

This is not a strong requirement per se, as the extension will always work, but it will generate code that uses syntax of the flutter package [freezed](https://pub.dev/packages/freezed). Thus, if you do not use freezed in your flutter app, you might be having a hard time finding this extension useful.

## Roadmap 🛣

Additional templates with syntax that supports users of [Equatable](https://pub.dev/packages?q=equatable) or nothing (i.e. a default mode, that will always compile) will maybe be added in the future, depending on how this [issue](https://github.com/felangel/bloc/issues/3466) turns out.

## Extension Settings ⚙️

This extension contributes the following settings:

- `formbloc.newFormBlocTemplate.createDirectory`: Whether to create a directory called "bloc" and create the new form bloc inside of it.

**Enjoy!**
