import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema(
  {
    coverImage: { type: String, required: true },
    galleryImages: { type: [String], required: true },
    country: { type: String, required: true },
    place: { type: String, required: true },
    rating: { type: Number, default: 0 },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    heading: { type: String, required: true },
    duration: { type: String, required: true },
    type: { type: String, required: true },
    groupSize: { type: Number, required: true },
    language: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    description: { type: String, required: true },
    itinerary: [
      {
        day: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    inclusions: { type: [String], required: true }, // New field
    exclusions: { type: [String], required: true }, // New field

    faq: [
      {
        question: { type: String, required: true }, // Correct field name
        answer: { type: String, required: true },   // Correct field name
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Tour', tourSchema);
