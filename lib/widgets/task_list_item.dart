import 'package:flutter/material.dart';

class TaskListItem extends StatelessWidget {
  final String title;
  final String taskType;
  final IconData icon;

  const TaskListItem({
    super.key,
    required this.title,
    required this.taskType,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8.0),
      child: ListTile(
        title: Text(title),
        subtitle: Text(taskType),
        trailing: Icon(icon),
        onTap: () {
          // Navigate to task details
        },
      ),
    );
  }
}