export default interface Purchase {
    id: number;
    userId: number;
    bookId: number;
    quantity: number;
    totalPrice: number;
    purchaseDate: Date;
}
  
  