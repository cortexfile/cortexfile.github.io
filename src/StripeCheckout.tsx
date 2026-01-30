import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { useToast } from './components/Toast';
import Navbar from './components/Navbar';
import SectionTitle from './components/SectionTitle';

// NOTE: This is a test public key. Replace with your own.
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ total }: { total: number }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);

        // Simulator: Only frontend simulation since we don't have a backend edge function yet
        // In a real app, you would fetch a clientSecret from your backend here.

        setTimeout(() => {
            setLoading(false);
            showToast('Payment Successful! (Demo Mode)', 'success');
            // Clear cart
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('cartUpdated'));
            window.location.href = '/user/orders';
        }, 2000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#fff',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>
            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full btn-primary py-3 rounded-lg font-bold text-lg"
            >
                {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
        </form>
    );
};

const StripeCheckout = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-cyber-black text-white">
            <Navbar />
            <div className="container mx-auto px-6 py-32">
                <div className="max-w-md mx-auto">
                    <SectionTitle title="Secure Checkout" subtitle="Powered by Stripe" />

                    <div className="glass-panel p-8 rounded-2xl mt-8">
                        <div className="mb-8 pb-8 border-b border-white/10">
                            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                            {cartItems.map((item: any) => (
                                <div key={item.id} className="flex justify-between py-2 text-gray-400">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between mt-4 text-xl font-bold text-cyber-primary">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <Elements stripe={stripePromise}>
                            <CheckoutForm total={total} />
                        </Elements>

                        <p className="text-xs text-center text-gray-500 mt-6">
                            <span className="flex items-center justify-center gap-1">
                                🔒 SSL Encrypted Payment
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StripeCheckout;
