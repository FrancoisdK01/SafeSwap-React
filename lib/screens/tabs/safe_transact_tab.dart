import 'package:flutter/material.dart';
import 'package:safeswap/models/transaction.dart';
import 'package:safeswap/widgets/transaction_list_item.dart';

class SafeTransactTab extends StatelessWidget {
  const SafeTransactTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SafeTransact'),
        backgroundColor: const Color(0xFF7BA7E3),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: const [
          TransactionListItem(
            title: 'Toolbox',
            amount: 'R 2000.00',
          ),
          TransactionListItem(
            title: 'Cellphone',
            amount: 'R 16000.00',
          ),
          TransactionListItem(
            title: 'Guitar',
            amount: 'R 2000.00',
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: const Color(0xFF7BA7E3),
        child: const Icon(Icons.add),
      ),
    );
  }
}