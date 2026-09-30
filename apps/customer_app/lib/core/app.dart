import 'package:flutter/material.dart';
import '../routes/app_router.dart';

class ScrapMamaApp extends StatelessWidget {
  const ScrapMamaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Scrap Mama',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFF1F6B45),
        useMaterial3: true,
        fontFamily: 'sans-serif',
      ),
      onGenerateRoute: AppRouter.onGenerateRoute,
    );
  }
}
