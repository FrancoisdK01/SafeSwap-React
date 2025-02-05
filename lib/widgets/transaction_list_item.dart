import 'package:flutter/material.dart';

class TransactionListItem extends StatelessWidget {
  final String title;
  final String amount;

  const TransactionListItem({
    super.key,
    required this.title,
    required this.amount,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8.0),
      child: ListTile(
        title: Text(title),
        trailing: Text(
          amount,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        onTap: () {
          // Navigate to transaction details
        },
      ),
    );
  }
}