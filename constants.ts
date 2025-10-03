import { User, Vehicle, Booking, Role } from './types';

type UserData = {
    password?: string;
    role: Role;
    name: string;
};

export const USERS: Record<string, UserData> = {
    'cliente': { password: 'cliente123', role: 'cliente', name: 'Juan Cliente' },
    'arrendador': { password: 'arrendador123', role: 'arrendador', name: 'Ana Arrendadora' },
    'admin': { password: 'admin123', role: 'admin', name: 'Admin General' },
};

export const VEHICLES: Vehicle[] = [
    {
        id: 1,
        brand: 'Toyota',
        name: 'Corolla',
        imageUrl: 'https://miautoapp.com.mx/wp-content/uploads/2025/10/Toyota-Corolla.png',
        pricePerDay: 50,
        specs: { type: 'Sedán', passengers: 5, transmission: 'Automática', fuel: 'Gasolina' },
        owner: 'lessor',
    },
    {
        id: 2,
        brand: 'Honda',
        name: 'CR-V',
        imageUrl: 'https://miautoapp.com.mx/wp-content/uploads/2025/10/Honda-CR-V.png',
        pricePerDay: 75,
        specs: { type: 'SUV', passengers: 5, transmission: 'Automática', fuel: 'Gasolina' },
        owner: 'lessor',
    },
    {
        id: 3,
        brand: 'Ford',
        name: 'Mustang Shelby',
        imageUrl: 'https://miautoapp.com.mx/wp-content/uploads/2025/10/Ford-Mustang.png',
        pricePerDay: 120,
        specs: { type: 'Deportivo', passengers: 4, transmission: 'Manual', fuel: 'Gasolina' },
        owner: 'lessor',
    },
    {
        id: 4,
        brand: 'Chevrolet',
        name: 'Suburban',
        imageUrl: 'https://miautoapp.com.mx/wp-content/uploads/2025/10/Chevrolet-Suburban.png',
        pricePerDay: 150,
        specs: { type: 'SUV Grande', passengers: 8, transmission: 'Automática', fuel: 'Diesel' },
        owner: 'lessor',
    },
    {
        id: 5,
        brand: 'Nissan',
        name: 'Versa',
        imageUrl: 'https://miautoapp.com.mx/wp-content/uploads/2025/10/Nissan-Versa.png',
        pricePerDay: 45,
        specs: { type: 'Sedán', passengers: 5, transmission: 'Automática', fuel: 'Gasolina' },
        owner: 'lessor',
    },
    {
        id: 6,
        brand: 'Volkswagen',
        name: 'Jetta',
        imageUrl: 'https://miautoapp.com.mx/wp-content/uploads/2025/10/Volkswagen-Jetta.png',
        pricePerDay: 55,
        specs: { type: 'Sedán', passengers: 5, transmission: 'Automática', fuel: 'Gasolina' },
        owner: 'lessor',
    },
    {
        id: 7,
        brand: 'Jeep',
        name: 'Wrangler',
        imageUrl: 'https://miautoapp.com.mx/wp-content/uploads/2025/10/Jeep-Wrangler.png',
        pricePerDay: 110,
        specs: { type: 'Todoterreno', passengers: 4, transmission: 'Manual', fuel: 'Gasolina' },
        owner: 'lessor',
    },
    {
        id: 8,
        brand: 'Tesla',
        name: 'Model S',
        imageUrl: 'https://miautoapp.com.mx/wp-content/uploads/2025/10/Tesla-Model-3.png',
        pricePerDay: 130,
        specs: { type: 'Eléctrico', passengers: 5, transmission: 'Automática', fuel: 'Eléctrico' },
        owner: 'lessor',
    },
    {
        id: 101,
        brand: 'Mazda',
        name: 'CX-5',
        imageUrl: 'https://miautoapp.com.mx/wp-content/uploads/2025/10/Mazda.png',
        pricePerDay: 80,
        specs: { type: 'SUV', passengers: 5, transmission: 'Automática', fuel: 'Gasolina' },
        owner: 'lessor',
    },
    {
        id: 102,
        brand: 'Kia',
        name: 'Rio',
        imageUrl: 'https://miautoapp.com.mx/wp-content/uploads/2025/10/kia-rio.png',
        pricePerDay: 48,
        specs: { type: 'Sedán', passengers: 5, transmission: 'Manual', fuel: 'Gasolina' },
        owner: 'lessor',
    },
     {
        id: 103,
        brand: 'BMW',
        name: 'Serie 3',
        imageUrl: 'https://miautoapp.com.mx/wp-content/uploads/2025/10/bmw.png',
        pricePerDay: 95,
        specs: { type: 'Sedán de Lujo', passengers: 5, transmission: 'Automática', fuel: 'Gasolina' },
        owner: 'lessor',
    },
    {
        id: 104,
        brand: 'Audi',
        name: 'Q5',
        imageUrl: 'https://miautoapp.com.mx/wp-content/uploads/2025/10/audi.png',
        pricePerDay: 105,
        specs: { type: 'SUV de Lujo', passengers: 5, transmission: 'Automática', fuel: 'Gasolina' },
        owner: 'lessor',
    },
    {
        id: 105,
        brand: 'Ford',
        name: 'Ranger',
        imageUrl: 'https://miautoapp.com.mx/wp-content/uploads/2025/10/ford-ranger.png',
        pricePerDay: 90,
        specs: { type: 'Pickup', passengers: 5, transmission: 'Automática', fuel: 'Diesel' },
        owner: 'lessor',
    },
    {
        id: 106,
        brand: 'Porsche',
        name: '911 Carrera',
        imageUrl: 'https://miautoapp.com.mx/wp-content/uploads/2025/10/porshe.png',
        pricePerDay: 250,
        specs: { type: 'Deportivo', passengers: 2, transmission: 'Automática', fuel: 'Gasolina' },
        owner: 'lessor',
    }
];


export const BOOKINGS: Booking[] = [];