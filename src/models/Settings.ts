import mongoose, { Document, Schema } from 'mongoose';
import type { HomepageImages } from "@/data/homepageImages";

export interface ISettings extends Document {
  homepageImages?: HomepageImages;
  contact: {
    phone: string;
    email: string;
    address: string;
    mapLink: string;
    supportEmail?: string;
    hrEmail?: string;
  };
  about: {
    founderImage: string;
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  maintenanceMode: boolean;
  meta: {
    title: string;
    description: string;
  };
}

const homepagePhoto = new Schema({ src: String, alt: String }, { _id: false });

const SettingsSchema: Schema = new Schema({
  homepageImages: { hero: homepagePhoto, manufacturing: homepagePhoto },
  contact: {
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    mapLink: { type: String, default: '' },
    supportEmail: { type: String, default: '' },
    hrEmail: { type: String, default: '' },
  },
  social: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },
  maintenanceMode: { type: Boolean, default: false },
  about: {
    founderImage: { type: String, default: '/uploads/DP.webp' },
  },
  meta: {
    title: { type: String, default: 'Aster Medicines' },
    description: { type: String, default: 'High-quality pharmaceutical solutions.' },
  },
}, { timestamps: true });

// Prevent model overwrite
const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
