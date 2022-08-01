part of 'testo_bloc.dart';

@freezed
class TestoEvent with _$TestoEvent {
  const factory TestoEvent.changeTestField1({required String newTestField1}) = _ChangeTestField1
const factory TestoEvent.toggleTestField2() = _ToggleTestField2
const factory TestoEvent.changeTestField3({required List<MyEnum> newTestField3}) = _ChangeTestField3
  const factory TestoEvent.submit({void Function()? onFailure, void Function()? onSuccess,}) = _SubmitTestoEvent;
}