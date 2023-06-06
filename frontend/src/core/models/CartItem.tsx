class CartItem {
    bookId: number;
    quantity: number;

    constructor(bookId: number, quantity: number) {
        this.bookId = bookId;
        this.quantity = quantity;
    }
}

export default CartItem;