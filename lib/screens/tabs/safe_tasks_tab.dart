import 'package:flutter/material.dart';
import 'package:safeswap/widgets/task_list_item.dart';

class SafeTasksTab extends StatelessWidget {
  const SafeTasksTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SafeTasks'),
        backgroundColor: const Color(0xFF7BA7E3),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: const [
          TaskListItem(
            title: 'Toolbox',
            taskType: 'Deliver',
            icon: Icons.local_shipping,
          ),
          TaskListItem(
            title: 'Toolbox',
            taskType: 'Payment',
            icon: Icons.payment,
          ),
        ],
      ),
    );
  }
}