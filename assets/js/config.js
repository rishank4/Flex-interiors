/**
 * Flex Interiors — Central Studio Configuration
 * ==============================================
 * All contact details, business hours, social profiles, and form endpoints are defined here.
 * Changes made in this file automatically update across all 6 pages of the website.
 */

const FLEX_CONFIG = {
  brand: {
    name: "Flex Interiors",
    subline: "ARCHITECTURAL INTERIORS",
    tagline: "Spaces that feel effortless.",
    description: "A premier architectural interior design studio dedicated to crafting refined, enduring spaces across luxury residential, commercial, and bespoke retail environments.",
    established: 2012,
  },
  contact: {
    email: "concierge@flexinteriors.com",
    phone: "+1 (555) 389-4200",
    phoneRaw: "+15553894200",
    whatsappNumber: "15553894200", // International format without + or spaces
    whatsappDisplay: "+1 (555) 389-4200",
    address: {
      line1: "450 Architectural Pavilion",
      line2: "Design District, Suite 800",
      city: "New York",
      state: "NY",
      postalCode: "10011",
      country: "United States",
      full: "450 Architectural Pavilion, Design District, Suite 800, New York, NY 10011"
    },
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.238479373809!2d-74.0084!3d40.742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cf377f7c46d!2sMeatpacking%20District%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
    googleMapsDirectionsUrl: "https://maps.google.com/?q=Meatpacking+District+New+York+NY"
  },
  socials: {
    instagram: "https://instagram.com/flexinteriors",
    pinterest: "https://pinterest.com/flexinteriors",
    linkedin: "https://linkedin.com/company/flexinteriors",
    facebook: "https://facebook.com/flexinteriors",
    youtube: "https://youtube.com/@flexinteriors"
  },
  businessHours: [
    { day: "Monday", hours: "09:00 AM – 06:30 PM", dayIndex: 1, openMin: 540, closeMin: 1110 },
    { day: "Tuesday", hours: "09:00 AM – 06:30 PM", dayIndex: 2, openMin: 540, closeMin: 1110 },
    { day: "Wednesday", hours: "09:00 AM – 06:30 PM", dayIndex: 3, openMin: 540, closeMin: 1110 },
    { day: "Thursday", hours: "09:00 AM – 06:30 PM", dayIndex: 4, openMin: 540, closeMin: 1110 },
    { day: "Friday", hours: "09:00 AM – 06:00 PM", dayIndex: 5, openMin: 540, closeMin: 1080 },
    { day: "Saturday", hours: "10:00 AM – 04:00 PM (By Appt)", dayIndex: 6, openMin: 600, closeMin: 960 },
    { day: "Sunday", hours: "Private Consultations Only", dayIndex: 0, openMin: 0, closeMin: 0 }
  ],
  stats: {
    projects: "250+",
    experienceYears: "12+",
    satisfactionRate: "98%",
    awards: "15+"
  },
  form: {
    // FormSubmit endpoint: change to your email or Web3Forms access key
    // For FormSubmit: https://formsubmit.co/ajax/your-email@example.com
    endpoint: "https://formsubmit.co/ajax/concierge@flexinteriors.com",
    recipientEmail: "concierge@flexinteriors.com",
    timeoutMs: 12000
  }
};

// Export to window object
if (typeof window !== "undefined") {
  window.FLEX_CONFIG = FLEX_CONFIG;
}

