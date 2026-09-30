import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: const Color(0xFFF7F8F4),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 104),
          children: [
            Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: colors.primary,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(Icons.recycling_rounded, color: Colors.white),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Scrap Mama', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
                      Text('Good morning, Asha', style: TextStyle(color: Color(0xFF667085))),
                    ],
                  ),
                ),
                IconButton(
                  tooltip: 'Notifications',
                  onPressed: () {},
                  icon: const Badge(child: Icon(Icons.notifications_none_rounded)),
                ),
              ],
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF1F6B45),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Turn scrap into savings', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 8),
                  const Text('Book a doorstep pickup and get paid based on verified weight.', style: TextStyle(color: Color(0xFFE2F4E8), height: 1.4)),
                  const SizedBox(height: 18),
                  FilledButton.icon(
                    onPressed: () {},
                    style: FilledButton.styleFrom(backgroundColor: Colors.white, foregroundColor: const Color(0xFF175B39)),
                    icon: const Icon(Icons.add_rounded),
                    label: const Text('Schedule pickup'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 28),
            const Text('What can we collect?', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
            const SizedBox(height: 14),
            const _CategoryGrid(),
            const SizedBox(height: 28),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Your next pickup', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                TextButton(onPressed: () {}, child: const Text('View all')),
              ],
            ),
            const _PickupCard(),
            const SizedBox(height: 28),
            const Text('Your impact', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
            const SizedBox(height: 14),
            const Row(
              children: [
                Expanded(child: _ImpactMetric(value: '28 kg', label: 'Scrap recycled', icon: Icons.scale_outlined)),
                SizedBox(width: 12),
                Expanded(child: _ImpactMetric(value: '₹ 420', label: 'Earned so far', icon: Icons.account_balance_wallet_outlined)),
              ],
            ),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: 0,
        onDestinationSelected: (_) {},
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home_rounded), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.calendar_month_outlined), label: 'Pickups'),
          NavigationDestination(icon: Icon(Icons.person_outline_rounded), label: 'Profile'),
        ],
      ),
    );
  }
}

class _CategoryGrid extends StatelessWidget {
  const _CategoryGrid();

  static const _categories = [
    (Icons.menu_book_outlined, 'Paper', '₹12/kg', Color(0xFFFFF1D8)),
    (Icons.local_drink_outlined, 'Plastic', '₹18/kg', Color(0xFFDDF3FA)),
    (Icons.construction_outlined, 'Metal', '₹35/kg', Color(0xFFE8E9EF)),
    (Icons.devices_other_outlined, 'E-waste', 'Best rates', Color(0xFFECE4FA)),
  ];

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _categories.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 1.8,
      ),
      itemBuilder: (context, index) {
        final category = _categories[index];
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18)),
          child: Row(children: [
            Container(
              padding: const EdgeInsets.all(9),
              decoration: BoxDecoration(color: category.$4, borderRadius: BorderRadius.circular(12)),
              child: Icon(category.$1, color: const Color(0xFF344054)),
            ),
            const SizedBox(width: 10),
            Expanded(child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(category.$2, style: const TextStyle(fontWeight: FontWeight.w700)),
                Text(category.$3, style: const TextStyle(fontSize: 12, color: Color(0xFF667085))),
              ],
            )),
          ]),
        );
      },
    );
  }
}

class _PickupCard extends StatelessWidget {
  const _PickupCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: const Color(0xFFE2F4E8), borderRadius: BorderRadius.circular(12)), child: const Icon(Icons.local_shipping_outlined, color: Color(0xFF1F6B45))),
          const SizedBox(width: 12),
          const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Tomorrow, 10:00–12:00', style: TextStyle(fontWeight: FontWeight.w700)), SizedBox(height: 3), Text('Home · 24 Park Street', style: TextStyle(color: Color(0xFF667085)))])),
          const _StatusPill(),
        ]),
        const Padding(padding: EdgeInsets.symmetric(vertical: 14), child: Divider(height: 1)),
        const Text('Paper, plastic & metal', style: TextStyle(color: Color(0xFF475467))),
      ]),
    );
  }
}

class _StatusPill extends StatelessWidget {
  const _StatusPill();
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
    decoration: BoxDecoration(color: const Color(0xFFFFF1D8), borderRadius: BorderRadius.circular(20)),
    child: const Text('Scheduled', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF9A6200))),
  );
}

class _ImpactMetric extends StatelessWidget {
  const _ImpactMetric({required this.value, required this.label, required this.icon});
  final String value;
  final String label;
  final IconData icon;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18)),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Icon(icon, color: const Color(0xFF1F6B45)),
      const SizedBox(height: 12),
      Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
      const SizedBox(height: 2),
      Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF667085))),
    ]),
  );
}
