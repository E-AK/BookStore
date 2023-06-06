class Purchase {
    id: number;
    userId: number;
    bookId: number;
    quantity: number;
    totalPrice: number;
    purchaseDate: Date;
  
    constructor(
      id: number,
      userId: number,
      bookId: number,
      quantity: number,
      totalPrice: number,
      purchaseDate: Date
    ) {
      this.id = id;
      this.userId = userId;
      this.bookId = bookId;
      this.quantity = quantity;
      this.totalPrice = totalPrice;
      this.purchaseDate = purchaseDate;
    }
  }
  
  export default Purchase;
  