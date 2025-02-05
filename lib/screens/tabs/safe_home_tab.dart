import 'package:flutter/material.dart';
import 'package:safeswap/widgets/account_info_card.dart';

class SafeHomeTab extends StatelessWidget {
  const SafeHomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SafeHome'),
        backgroundColor: const Color(0xFF7BA7E3),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {},
          ),
        ],
      ),
      body: const Padding(
        padding: EdgeInsets.all(16.0),
        child: AccountInfoCard(),
      ),
    );
  }
}