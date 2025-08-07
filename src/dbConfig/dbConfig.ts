import mongoose from 'mongoose';


export async function connect(){
    try{
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('Connected to MongoDB');
        });

        connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            process.exit(1);
        });



    }catch(err){
        console.error("Error connecting to MongoDB:", err);
    }
}