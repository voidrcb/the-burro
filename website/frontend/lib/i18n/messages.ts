/**
 * Message Externalization per A-3.1.6 (DEC-058)
 *
 * Typed message dictionaries for forms, errors, and UI strings.
 * All user-facing strings should be defined here for translation.
 */

import type { Locale } from './types';

// Common UI messages
export interface CommonMessages {
  nav: {
    home: string;
    about: string;
    stay: string;
    workshops: string;
    experiences: string;
    shop: string;
    rentals: string;
    contact: string;
    blog: string;
    activism: string;
    darkSky: string;
  };
  actions: {
    submit: string;
    cancel: string;
    confirm: string;
    back: string;
    next: string;
    save: string;
    edit: string;
    delete: string;
    close: string;
    viewMore: string;
    learnMore: string;
    bookNow: string;
    register: string;
    addToCart: string;
    checkout: string;
    requestQuote: string;
  };
  status: {
    loading: string;
    error: string;
    success: string;
    pending: string;
    confirmed: string;
    cancelled: string;
    available: string;
    unavailable: string;
    soldOut: string;
    comingSoon: string;
  };
  footer: {
    copyright: string;
    privacyPolicy: string;
    termsOfService: string;
    contactUs: string;
  };
}

// Form-related messages
export interface FormMessages {
  labels: {
    name: string;
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    message: string;
    comments: string;
    date: string;
    startDate: string;
    endDate: string;
    guests: string;
    quantity: string;
  };
  validation: {
    required: string;
    invalidEmail: string;
    invalidPhone: string;
    minLength: string;
    maxLength: string;
    invalidDate: string;
    dateInPast: string;
    endBeforeStart: string;
    mustAcceptTerms: string;
    mustAcceptWaiver: string;
    invalidZipCode: string;
  };
  placeholders: {
    enterName: string;
    enterEmail: string;
    enterPhone: string;
    enterMessage: string;
    selectDate: string;
    selectOption: string;
  };
}

// Error messages
export interface ErrorMessages {
  general: {
    somethingWentWrong: string;
    tryAgainLater: string;
    pageNotFound: string;
    unauthorized: string;
    forbidden: string;
    serverError: string;
    networkError: string;
    timeout: string;
  };
  booking: {
    unavailableDates: string;
    capacityExceeded: string;
    invalidDates: string;
    bookingFailed: string;
    paymentFailed: string;
    alreadyBooked: string;
  };
  workshop: {
    sessionFull: string;
    registrationClosed: string;
    invalidWaiver: string;
  };
  shop: {
    itemOutOfStock: string;
    cartEmpty: string;
    invalidQuantity: string;
    checkoutFailed: string;
  };
}

// Booking-related messages
export interface BookingMessages {
  lodging: {
    selectDates: string;
    checkAvailability: string;
    perNight: string;
    totalNights: string;
    guests: string;
    maxGuests: string;
    amenities: string;
    houseRules: string;
    checkInTime: string;
    checkOutTime: string;
    confirmationSent: string;
  };
  confirmation: {
    thankYou: string;
    confirmationNumber: string;
    detailsSent: string;
    whatNext: string;
    contactInfo: string;
  };
  waiver: {
    title: string;
    agreementText: string;
    acceptButton: string;
    required: string;
  };
}

// Workshop messages
export interface WorkshopMessages {
  registration: {
    registerFor: string;
    spotsAvailable: string;
    duration: string;
    instructor: string;
    materialsIncluded: string;
    whatToBring: string;
    cancellationPolicy: string;
    registrationComplete: string;
    confirmationEmail: string;
  };
  intake: {
    experienceLevel: string;
    dietaryRestrictions: string;
    emergencyContact: string;
    specialRequests: string;
  };
}

// Assistant (Burro) messages per A-3.1.5
export interface AssistantMessages {
  greetings: {
    welcome: string;
    welcomeBack: string;
    howCanIHelp: string;
  };
  responses: {
    processingRequest: string;
    foundResults: string;
    noResultsFound: string;
    needMoreInfo: string;
    contactOperator: string;
  };
  fallback: {
    englishOnly: string;
    translationUnavailable: string;
    spanishAcknowledgment: string;
  };
}

// Combined message dictionary type
export interface MessageDictionary {
  common: CommonMessages;
  forms: FormMessages;
  errors: ErrorMessages;
  booking: BookingMessages;
  workshop: WorkshopMessages;
  assistant: AssistantMessages;
}

// English messages (source)
export const enMessages: MessageDictionary = {
  common: {
    nav: {
      home: 'Home',
      about: 'About',
      stay: 'Stay',
      workshops: 'Workshops',
      experiences: 'Experiences',
      shop: 'Shop',
      rentals: 'Rentals',
      contact: 'Contact',
      blog: 'Blog',
      activism: 'Activism',
      darkSky: 'Dark Sky',
    },
    actions: {
      submit: 'Submit',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      close: 'Close',
      viewMore: 'View More',
      learnMore: 'Learn More',
      bookNow: 'Book Now',
      register: 'Register',
      addToCart: 'Add to Cart',
      checkout: 'Checkout',
      requestQuote: 'Request Quote',
    },
    status: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      available: 'Available',
      unavailable: 'Unavailable',
      soldOut: 'Sold Out',
      comingSoon: 'Coming Soon',
    },
    footer: {
      copyright: 'All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      contactUs: 'Contact Us',
    },
  },
  forms: {
    labels: {
      name: 'Name',
      fullName: 'Full Name',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      state: 'State',
      zipCode: 'ZIP Code',
      country: 'Country',
      message: 'Message',
      comments: 'Comments',
      date: 'Date',
      startDate: 'Start Date',
      endDate: 'End Date',
      guests: 'Guests',
      quantity: 'Quantity',
    },
    validation: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      invalidPhone: 'Please enter a valid phone number',
      minLength: 'Must be at least {min} characters',
      maxLength: 'Must be no more than {max} characters',
      invalidDate: 'Please enter a valid date',
      dateInPast: 'Date cannot be in the past',
      endBeforeStart: 'End date must be after start date',
      mustAcceptTerms: 'You must accept the terms and conditions',
      mustAcceptWaiver: 'You must accept the waiver to continue',
      invalidZipCode: 'Please enter a valid ZIP code',
    },
    placeholders: {
      enterName: 'Enter your name',
      enterEmail: 'Enter your email',
      enterPhone: 'Enter your phone number',
      enterMessage: 'Enter your message',
      selectDate: 'Select a date',
      selectOption: 'Select an option',
    },
  },
  errors: {
    general: {
      somethingWentWrong: 'Something went wrong',
      tryAgainLater: 'Please try again later',
      pageNotFound: 'Page not found',
      unauthorized: 'You are not authorized to view this page',
      forbidden: 'Access denied',
      serverError: 'Server error. Please try again later.',
      networkError: 'Network error. Please check your connection.',
      timeout: 'Request timed out. Please try again.',
    },
    booking: {
      unavailableDates: 'Selected dates are not available',
      capacityExceeded: 'Maximum capacity exceeded',
      invalidDates: 'Please select valid dates',
      bookingFailed: 'Booking could not be completed',
      paymentFailed: 'Payment could not be processed',
      alreadyBooked: 'These dates are already booked',
    },
    workshop: {
      sessionFull: 'This session is full',
      registrationClosed: 'Registration is closed',
      invalidWaiver: 'Waiver signature is required',
    },
    shop: {
      itemOutOfStock: 'Item is out of stock',
      cartEmpty: 'Your cart is empty',
      invalidQuantity: 'Invalid quantity',
      checkoutFailed: 'Checkout could not be completed',
    },
  },
  booking: {
    lodging: {
      selectDates: 'Select your dates',
      checkAvailability: 'Check Availability',
      perNight: 'per night',
      totalNights: 'Total nights',
      guests: 'Guests',
      maxGuests: 'Maximum guests',
      amenities: 'Amenities',
      houseRules: 'House Rules',
      checkInTime: 'Check-in time',
      checkOutTime: 'Check-out time',
      confirmationSent: 'Confirmation sent to your email',
    },
    confirmation: {
      thankYou: 'Thank you for your booking!',
      confirmationNumber: 'Confirmation number',
      detailsSent: 'Details have been sent to your email',
      whatNext: 'What happens next?',
      contactInfo: 'If you have questions, contact us at',
    },
    waiver: {
      title: 'Liability Waiver',
      agreementText: 'I have read and agree to the terms of the liability waiver',
      acceptButton: 'I Accept',
      required: 'Waiver acceptance is required',
    },
  },
  workshop: {
    registration: {
      registerFor: 'Register for',
      spotsAvailable: 'spots available',
      duration: 'Duration',
      instructor: 'Instructor',
      materialsIncluded: 'Materials included',
      whatToBring: 'What to bring',
      cancellationPolicy: 'Cancellation policy',
      registrationComplete: 'Registration complete!',
      confirmationEmail: 'A confirmation email has been sent',
    },
    intake: {
      experienceLevel: 'Experience level',
      dietaryRestrictions: 'Dietary restrictions',
      emergencyContact: 'Emergency contact',
      specialRequests: 'Special requests',
    },
  },
  assistant: {
    greetings: {
      welcome: 'Welcome to Big Bend Burro! How can I help you today?',
      welcomeBack: 'Welcome back! How can I assist you?',
      howCanIHelp: 'How can I help you?',
    },
    responses: {
      processingRequest: 'Processing your request...',
      foundResults: 'I found some options for you',
      noResultsFound: 'I could not find what you are looking for',
      needMoreInfo: 'I need a bit more information to help you',
      contactOperator: 'For this request, please contact our team directly',
    },
    fallback: {
      englishOnly: 'This information is currently only available in English',
      translationUnavailable: 'Translation for this content is not yet available',
      spanishAcknowledgment: 'Entendido. Respondo en ingles porque esta informacion aun no esta traducida.',
    },
  },
};

// Spanish messages (target)
export const esMessages: MessageDictionary = {
  common: {
    nav: {
      home: 'Inicio',
      about: 'Nosotros',
      stay: 'Hospedaje',
      workshops: 'Talleres',
      experiences: 'Experiencias',
      shop: 'Tienda',
      rentals: 'Alquiler',
      contact: 'Contacto',
      blog: 'Blog',
      activism: 'Activismo',
      darkSky: 'Cielo Oscuro',
    },
    actions: {
      submit: 'Enviar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      back: 'Atras',
      next: 'Siguiente',
      save: 'Guardar',
      edit: 'Editar',
      delete: 'Eliminar',
      close: 'Cerrar',
      viewMore: 'Ver Mas',
      learnMore: 'Mas Informacion',
      bookNow: 'Reservar Ahora',
      register: 'Registrarse',
      addToCart: 'Agregar al Carrito',
      checkout: 'Pagar',
      requestQuote: 'Solicitar Cotizacion',
    },
    status: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Exito',
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      cancelled: 'Cancelado',
      available: 'Disponible',
      unavailable: 'No Disponible',
      soldOut: 'Agotado',
      comingSoon: 'Proximamente',
    },
    footer: {
      copyright: 'Todos los derechos reservados.',
      privacyPolicy: 'Politica de Privacidad',
      termsOfService: 'Terminos de Servicio',
      contactUs: 'Contactenos',
    },
  },
  forms: {
    labels: {
      name: 'Nombre',
      fullName: 'Nombre Completo',
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo Electronico',
      phone: 'Telefono',
      address: 'Direccion',
      city: 'Ciudad',
      state: 'Estado',
      zipCode: 'Codigo Postal',
      country: 'Pais',
      message: 'Mensaje',
      comments: 'Comentarios',
      date: 'Fecha',
      startDate: 'Fecha de Inicio',
      endDate: 'Fecha de Fin',
      guests: 'Huespedes',
      quantity: 'Cantidad',
    },
    validation: {
      required: 'Este campo es requerido',
      invalidEmail: 'Por favor ingrese un correo electronico valido',
      invalidPhone: 'Por favor ingrese un numero de telefono valido',
      minLength: 'Debe tener al menos {min} caracteres',
      maxLength: 'Debe tener no mas de {max} caracteres',
      invalidDate: 'Por favor ingrese una fecha valida',
      dateInPast: 'La fecha no puede estar en el pasado',
      endBeforeStart: 'La fecha de fin debe ser posterior a la fecha de inicio',
      mustAcceptTerms: 'Debe aceptar los terminos y condiciones',
      mustAcceptWaiver: 'Debe aceptar la exencion para continuar',
      invalidZipCode: 'Por favor ingrese un codigo postal valido',
    },
    placeholders: {
      enterName: 'Ingrese su nombre',
      enterEmail: 'Ingrese su correo electronico',
      enterPhone: 'Ingrese su numero de telefono',
      enterMessage: 'Ingrese su mensaje',
      selectDate: 'Seleccione una fecha',
      selectOption: 'Seleccione una opcion',
    },
  },
  errors: {
    general: {
      somethingWentWrong: 'Algo salio mal',
      tryAgainLater: 'Por favor intente de nuevo mas tarde',
      pageNotFound: 'Pagina no encontrada',
      unauthorized: 'No esta autorizado para ver esta pagina',
      forbidden: 'Acceso denegado',
      serverError: 'Error del servidor. Por favor intente de nuevo mas tarde.',
      networkError: 'Error de red. Por favor verifique su conexion.',
      timeout: 'La solicitud expiro. Por favor intente de nuevo.',
    },
    booking: {
      unavailableDates: 'Las fechas seleccionadas no estan disponibles',
      capacityExceeded: 'Capacidad maxima excedida',
      invalidDates: 'Por favor seleccione fechas validas',
      bookingFailed: 'No se pudo completar la reserva',
      paymentFailed: 'No se pudo procesar el pago',
      alreadyBooked: 'Estas fechas ya estan reservadas',
    },
    workshop: {
      sessionFull: 'Esta sesion esta llena',
      registrationClosed: 'El registro esta cerrado',
      invalidWaiver: 'Se requiere la firma de la exencion',
    },
    shop: {
      itemOutOfStock: 'Articulo agotado',
      cartEmpty: 'Su carrito esta vacio',
      invalidQuantity: 'Cantidad invalida',
      checkoutFailed: 'No se pudo completar la compra',
    },
  },
  booking: {
    lodging: {
      selectDates: 'Seleccione sus fechas',
      checkAvailability: 'Verificar Disponibilidad',
      perNight: 'por noche',
      totalNights: 'Total de noches',
      guests: 'Huespedes',
      maxGuests: 'Maximo de huespedes',
      amenities: 'Comodidades',
      houseRules: 'Reglas de la Casa',
      checkInTime: 'Hora de entrada',
      checkOutTime: 'Hora de salida',
      confirmationSent: 'Confirmacion enviada a su correo electronico',
    },
    confirmation: {
      thankYou: 'Gracias por su reserva!',
      confirmationNumber: 'Numero de confirmacion',
      detailsSent: 'Los detalles han sido enviados a su correo electronico',
      whatNext: 'Que sigue?',
      contactInfo: 'Si tiene preguntas, contactenos en',
    },
    waiver: {
      title: 'Exencion de Responsabilidad',
      agreementText: 'He leido y acepto los terminos de la exencion de responsabilidad',
      acceptButton: 'Acepto',
      required: 'Se requiere la aceptacion de la exencion',
    },
  },
  workshop: {
    registration: {
      registerFor: 'Registrarse para',
      spotsAvailable: 'lugares disponibles',
      duration: 'Duracion',
      instructor: 'Instructor',
      materialsIncluded: 'Materiales incluidos',
      whatToBring: 'Que traer',
      cancellationPolicy: 'Politica de cancelacion',
      registrationComplete: 'Registro completado!',
      confirmationEmail: 'Se ha enviado un correo de confirmacion',
    },
    intake: {
      experienceLevel: 'Nivel de experiencia',
      dietaryRestrictions: 'Restricciones dieteticas',
      emergencyContact: 'Contacto de emergencia',
      specialRequests: 'Solicitudes especiales',
    },
  },
  assistant: {
    greetings: {
      welcome: 'Bienvenido a Big Bend Burro! Como puedo ayudarte hoy?',
      welcomeBack: 'Bienvenido de nuevo! Como puedo asistirte?',
      howCanIHelp: 'Como puedo ayudarte?',
    },
    responses: {
      processingRequest: 'Procesando su solicitud...',
      foundResults: 'Encontre algunas opciones para usted',
      noResultsFound: 'No pude encontrar lo que busca',
      needMoreInfo: 'Necesito un poco mas de informacion para ayudarte',
      contactOperator: 'Para esta solicitud, por favor contacte a nuestro equipo directamente',
    },
    fallback: {
      englishOnly: 'Esta informacion actualmente solo esta disponible en ingles',
      translationUnavailable: 'La traduccion de este contenido aun no esta disponible',
      spanishAcknowledgment: 'Entendido. Respondo en ingles porque esta informacion aun no esta traducida.',
    },
  },
};

// Message dictionary by locale
export const messages: Record<Locale, MessageDictionary> = {
  en: enMessages,
  es: esMessages,
};

// Get messages for a specific locale
export function getMessages(locale: Locale): MessageDictionary {
  return messages[locale] ?? messages.en;
}

// Type-safe message accessor
export function getMessage<
  N extends keyof MessageDictionary,
  K extends keyof MessageDictionary[N],
  S extends keyof MessageDictionary[N][K]
>(
  locale: Locale,
  namespace: N,
  category: K,
  key: S
): MessageDictionary[N][K][S] {
  const localeMessages = getMessages(locale);
  return localeMessages[namespace][category][key];
}

// Interpolate message with values
export function formatMessage(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`));
}
