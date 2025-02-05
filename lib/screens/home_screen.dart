import 'package:flutter/material.dart';
import 'package:safeswap/screens/tabs/safe_home_tab.dart';
import 'package:safeswap/screens/tabs/safe_transact_tab.dart';
import 'package:safeswap/screens/tabs/safe_buy_tab.dart';
import 'package:safeswap/screens/tabs/safe_tasks_tab.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _tabs = [
    const SafeHomeTab(),
    const SafeTransactTab(),
    const SafeBuyTab(),
    const SafeTasksTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _tabs[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        type: BottomNavigationBarType.fixed,
        backgroundColor: const Color(0xFFABC7E9),
        selectedItemColor: Colors.white,
        unselectedItemColor: Colors.white70,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.shopping_bag), label: 'Transact'),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Buy'),
          BottomNavigationBarItem(icon: Icon(Icons.checklist), label: 'Tasks'),
        ],
      ),
    );
  }
}