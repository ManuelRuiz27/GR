import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create event
    const event = await prisma.event.upsert({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        update: {},
        create: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Graduación Arquitectura 2025',
            date: new Date('2025-06-30T18:00:00Z'),
            venue: 'Salón Las Palmas',
            capacity: 1000,
            ticket_price: 1500,
            months_duration: 6,
            initial_payment: 3000,
            thermo_threshold: 70,
            meals_deadline: new Date('2025-05-20T23:59:59Z'),
            layout_version: 1,
            status: 'active',
        },
    });

    console.log('✅ Event created:', event.name);

    // Create tables (100 tables)
    const tables = [];
    for (let i = 1; i <= 100; i++) {
        const row = Math.floor((i - 1) / 10);
        const col = (i - 1) % 10;

        tables.push({
            id: `table-${i}`,
            event_id: event.id,
            label: `Mesa ${i}`,
            capacity: 10,
            position_x: col * 100,
            position_y: row * 100,
            status: 'available',
        });
    }

    await prisma.table.createMany({
        data: tables,
        skipDuplicates: true,
    });

    console.log('✅ Created 100 tables');

    // Create test user (graduate)
    const hashedPassword = await bcrypt.hash('demo123', 10);

    const testGraduate = await prisma.graduate.upsert({
        where: { email: 'demo@graduacion.com' },
        update: {},
        create: {
            email: 'demo@graduacion.com',
            password_hash: hashedPassword,
            full_name: 'Juan Pérez García',
            phone: '5512345678',
            career: 'Arquitectura',
            generation: '2020-2024',
            group: 'A',
            event_id: event.id,
            tickets_step: 'pending',
            layout_step: 'locked',
            meals_step: 'locked',
            payments_step: 'pending',
            thermo_step: 'locked',
        },
    });

    console.log('✅ Test user created:');
    console.log('   📧 Email: demo@graduacion.com');
    console.log('   🔑 Password: demo123');
    console.log('   👤 Name:', testGraduate.full_name);

    console.log('\n🎉 Seeding completed!');
    console.log('\n📝 You can now login with:');
    console.log('   Email: demo@graduacion.com');
    console.log('   Password: demo123');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
