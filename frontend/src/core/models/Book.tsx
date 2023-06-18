export default interface Book {
    id: number;
    preview: File | null;
    title: string;
    author: string;
    description: string;
    price: number;
    genre: string
}
  