import 'package:flutter/material.dart';

class AccountInfoCard extends StatelessWidget {
  const AccountInfoCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildInfoRow('Active Transactions', '3'),
            const Divider(),
            _buildInfoRow('Wallet Balance', 'R 0.00'),
            const Divider(),
            _buildInfoRow('Funds in Holding Account', 'R 0.00'),
            const Divider(),
            _buildInfoRow('Payable to you', 'R 0.00'),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}