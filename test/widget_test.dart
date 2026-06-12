import 'package:ai_food_passport/app/app.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('app starts on onboarding', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: AiFoodPassportApp()));

    await tester.pump();

    expect(find.text('AI FOOD PASSPORT'), findsOneWidget);
  });
}
