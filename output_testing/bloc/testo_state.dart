part of 'testo_bloc.dart';

@freezed
class TestoState with _$TestoState {
  const factory TestoState.editing({String? testField1, required bool testField2, List<MyEnum>? testField3, @Default(false) bool isSubmitting,}) = _TestoStateEditing;
}
