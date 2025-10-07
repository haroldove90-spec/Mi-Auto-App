import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        paypal: any;
    }
}

interface PayPalButtonProps {
    amount: string;
    onSuccess: () => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, onSuccess }) => {
    const paypalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.paypal && paypalRef.current && paypalRef.current.childElementCount === 0) {
            window.paypal.Buttons({
                createOrder: (data: any, actions: any) => {
                    return actions.order.create({
                        purchase_units: [{
                            description: 'Reserva de vehículo en Mi Auto App',
                            amount: {
                                currency_code: 'USD', // Using USD as it's universally supported by PayPal sandbox
                                value: amount,
                            },
                        }],
                    });
                },
                onApprove: async (data: any, actions: any) => {
                    // This function is called when the payment is approved by the buyer.
                    // You can perform additional validation here on the server side if needed.
                    await actions.order.capture();
                    onSuccess();
                },
                onError: (err: any) => {
                    console.error('Error en el pago de PayPal:', err);
                    // You can show an error message to the user here.
                },
            }).render(paypalRef.current);
        }
    }, [amount, onSuccess]);

    return <div ref={paypalRef}></div>;
};

export default PayPalButton;