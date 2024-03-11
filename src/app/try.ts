export default function handler(req:Request, res:Response) {
    // Logique de votre API
    res.status(200).json({ message: 'Route API test' });
}