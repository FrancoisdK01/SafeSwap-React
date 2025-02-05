class Transaction {
  final String id;
  final String title;
  final double amount;
  final String safeCode;
  final bool isPudo;

  Transaction({
    required this.id,
    required this.title,
    required this.amount,
    required this.safeCode,
    required this.isPudo,
  });
}