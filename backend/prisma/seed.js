"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
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
//# sourceMappingURL=seed.js.map