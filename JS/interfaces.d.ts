export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    discountedPrice?: number;
    image: string;
    category: "coffee" | "tea" | "dessert";
    sizes: SizeOption[];
    additives: AdditiveOption[];
}
export interface SizeOption {
    name: string;
    volume: number;
    price: number;
    discountedPrice?: number;
}
export interface AdditiveOption {
    name: string;
    price: number;
    discountedPrice?: number;
}
export interface User {
    id: number;
    username: string;
    email: string;
    token: string;
    isRegistered: boolean;
    address?: Address;
}
export interface Address {
    city: string;
    street: string;
    houseNumber: number;
}
export interface CartItem {
    product: Product;
    selectedSize: SizeOption;
    selectedAdditives: AdditiveOption[];
    quantity: number;
    totalPrice: number;
}
export interface FavoriteCoffee {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}
export interface MenuProduct {
    additives: any;
    sizes: any;
    id: number;
    name: string;
    description: string;
    price: number;
    discountedPrice: number;
    category: "coffee" | "tea" | "dessert";
    image?: string;
}
//# sourceMappingURL=interfaces.d.ts.map