import { strategy } from "../src/utils/strategy";

const paymentStrategies = {
	creditCard: (amount: number) => `Paid $${amount} via Credit Card`,
	paypal: (amount: number) => `Paid $${amount} via PayPal`,
	bankTransfer: (amount: number) => `Paid $${amount} via Bank Transfer`,
};

const processPayment = strategy(paymentStrategies);

console.log(processPayment("creditCard", 100));
console.log(processPayment("paypal", 50));
console.log(processPayment("bankTransfer", 200));
