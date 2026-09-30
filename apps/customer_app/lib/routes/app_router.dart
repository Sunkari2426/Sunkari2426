import 'package:flutter/material.dart';
import '../features/home/home_page.dart';

class AppRouter {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    return MaterialPageRoute(builder: (_) => const HomePage());
  }
}
