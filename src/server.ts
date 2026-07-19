import express from 'express';
import cors from 'cors';
import doctorRoutes from './routes/doctorRoutes';
import serviceRoutes from './routes/serviceRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import blockedSlotRoutes from './routes/blockedSlotRoutes';
import authRoutes from "./routes/authRoutes";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/doctors', doctorRoutes);
app.use('/services', serviceRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/blocked-slots', blockedSlotRoutes);
app.use("/auth", authRoutes);

app.get('/', (req, res) => {
  res.send('Server is running! 🎉');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});