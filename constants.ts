import { User, Vehicle, Booking, Role, Review } from './types';

type UserData = {
    password?: string;
    role: Role;
    name: string;
    avatarUrl: string;
    memberSince: string;
    averageRating: number;
    isVerified: boolean;
};

export const USERS: Record<string, UserData> = {
    'cliente': { password: 'cliente123', role: 'cliente', name: 'Juan Cliente', avatarUrl: 'https://i.pravatar.cc/150?u=cliente', memberSince: '2023-05-15', averageRating: 4.8, isVerified: true },
    'arrendador': { password: 'arrendador123', role: 'arrendador', name: 'Ana Arrendadora', avatarUrl: 'https://i.pravatar.cc/150?u=arrendador', memberSince: '2022-11-20', averageRating: 4.9, isVerified: true },
    'admin': { password: 'admin123', role: 'admin', name: 'Admin General', avatarUrl: 'https://i.pravatar.cc/150?u=admin', memberSince: '2022-01-01', averageRating: 5.0, isVerified: true },
};

export const VEHICLES: Vehicle[] = [
    {
        id: 1,
        ownerId: 'arrendador',
        brand: 'Toyota',
        name: 'Corolla',
        year: 2023,
        licensePlate: 'ABC-123',
        pricePerDay: 50,
        location: 'Ciudad de México',
        imageUrl: ['https://miautoapp.com.mx/wp-content/uploads/2025/10/Toyota-Corolla.png'],
        specs: { type: 'Sedán', passengers: 5, transmission: 'Automática', fuel: 'Gasolina' },
        features: ['Aire Acondicionado', 'GPS', 'Bluetooth', 'Cámara de Reversa'],
        availability: [],
        averageRating: 4.9,
    },
    {
        id: 2,
        ownerId: 'arrendador',
        brand: 'Honda',
        name: 'CR-V',
        year: 2022,
        licensePlate: 'DEF-456',
        pricePerDay: 75,
        location: 'Guadalajara',
        imageUrl: ['https://miautoapp.com.mx/wp-content/uploads/2025/10/Honda-CR-V.png'],
        specs: { type: 'SUV', passengers: 5, transmission: 'Automática', fuel: 'Gasolina' },
        features: ['Aire Acondicionado', 'Techo Solar', 'Asientos de Piel'],
        availability: [],
        averageRating: 4.8,
    },
    {
        id: 3,
        ownerId: 'arrendador',
        brand: 'Ford',
        name: 'Mustang Shelby',
        year: 2024,
        licensePlate: 'GHI-789',
        pricePerDay: 120,
        location: 'Monterrey',
        imageUrl: ['https://miautoapp.com.mx/wp-content/uploads/2025/10/Ford-Mustang.png'],
        specs: { type: 'Deportivo', passengers: 4, transmission: 'Manual', fuel: 'Gasolina' },
        features: ['Modo Sport', 'Sistema de Sonido Premium', 'Asientos Deportivos'],
        availability: [],
        averageRating: 5.0,
    },
    {
        id: 4,
        ownerId: 'arrendador',
        brand: 'Chevrolet',
        name: 'Suburban',
        year: 2023,
        licensePlate: 'JKL-101',
        pricePerDay: 150,
        location: 'Cancún',
        imageUrl: ['https://miautoapp.com.mx/wp-content/uploads/2025/10/Chevrolet-Suburban.png'],
        specs: { type: 'SUV Grande', passengers: 8, transmission: 'Automática', fuel: 'Diesel' },
        features: ['Entretenimiento DVD', '3 Filas de Asientos', 'Gran Capacidad de Carga'],
        availability: [],
        averageRating: 4.9,
    },
    {
        id: 8,
        ownerId: 'arrendador',
        brand: 'Tesla',
        name: 'Model S',
        year: 2023,
        licensePlate: 'TSL-321',
        pricePerDay: 130,
        location: 'Ciudad de México',
        imageUrl: ['https://miautoapp.com.mx/wp-content/uploads/2025/10/Tesla-Model-3.png'],
        specs: { type: 'Eléctrico', passengers: 5, transmission: 'Automática', fuel: 'Eléctrico' },
        features: ['Autopilot', 'Pantalla Táctil 17"', 'Techo de Cristal'],
        availability: [],
        averageRating: 4.9,
    },
    {
        id: 106,
        ownerId: 'arrendador',
        brand: 'Porsche',
        name: '911 Carrera',
        year: 2024,
        licensePlate: 'PCH-911',
        pricePerDay: 250,
        location: 'Monterrey',
        imageUrl: ['https://miautoapp.com.mx/wp-content/uploads/2025/10/porshe.png'],
        specs: { type: 'Deportivo', passengers: 2, transmission: 'Automática', fuel: 'Gasolina' },
        features: ['Launch Control', 'Suspensión Adaptativa', 'Frenos Cerámicos'],
        availability: [],
        averageRating: 5.0,
    }
];


export const BOOKINGS: Booking[] = [
    {
        id: 1,
        vehicleId: 2,
        ownerId: 'arrendador',
        clientId: 'cliente',
        startDate: '2024-07-10',
        endDate: '2024-07-15',
        totalPrice: 375,
        status: 'completed',
    },
    {
        id: 2,
        vehicleId: 4,
        ownerId: 'arrendador',
        clientId: 'cliente',
        startDate: '2024-08-01',
        endDate: '2024-08-05',
        totalPrice: 600,
        status: 'confirmed',
    },
    {
        id: 3,
        vehicleId: 1,
        ownerId: 'arrendador',
        clientId: 'cliente',
        startDate: '2024-06-20',
        endDate: '2024-06-22',
        totalPrice: 100,
        status: 'cancelled',
    }
];

export const REVIEWS: Review[] = [
    {
        id: 1,
        bookingId: 1,
        vehicleId: 2,
        reviewerId: 'cliente',
        revieweeId: 'arrendador',
        rating: 5,
        comment: '¡El coche estaba impecable y Ana fue muy amable! Una experiencia de 10.',
        timestamp: '2024-07-16T10:00:00Z'
    },
    {
        id: 2,
        bookingId: 1,
        vehicleId: 2,
        reviewerId: 'arrendador',
        revieweeId: 'cliente',
        rating: 5,
        comment: 'Juan cuidó muy bien del vehículo y lo devolvió a tiempo. ¡Excelente cliente!',
        timestamp: '2024-07-16T11:00:00Z'
    }
];