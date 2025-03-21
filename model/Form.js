import mongoose from 'mongoose';

const formSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    countryCode: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    number: { type: Number, required: false },
    departureMonth: { type: String, required: true },
    inquiryPage: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model('Form', formSchema);
