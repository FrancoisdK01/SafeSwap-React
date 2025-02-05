import 'package:flutter/material.dart';
import 'package:safeswap/screens/home_screen.dart';

void main() {
  runApp(const SafeSwapApp());
}

class SafeSwapApp extends StatelessWidget {
  const SafeSwapApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SafeSwap',
      theme: ThemeData(
        primaryColor: const Color(0xFF7BA7E3),
        scaffoldBackgroundColor: Colors.white,
      ),
      home: const HomeScreen(),
    );
  }
}