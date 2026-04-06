import 'package:flutter_test/flutter_test.dart';
import 'package:wenxige_store/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const WenxigeApp());
    expect(find.byType(WenxigeApp), findsOneWidget);
  });
}
