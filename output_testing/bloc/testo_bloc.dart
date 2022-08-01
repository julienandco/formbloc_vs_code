import 'package:bloc/bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'testo_event.dart';
part 'testo_state.dart';
part 'testo_bloc.freezed.dart';

class TestoBloc extends Bloc<TestoEvent, TestoState> {
  TestoBloc() : super(_Initial()) {
    on<TestoEvent>((event, emit) {
      // TODO: implement event handler
    });
  }
}
