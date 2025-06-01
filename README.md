Guía de Implementación de Servicios Externos
1. Geolocalización con ipstack
Pasos de implementación:
Registro en ipstack:

Crear cuenta en ipstack.com

Obtener API Key gratuita

Configuración del servicio:

typescript
// services/geolocationService.ts
import axios from 'axios';

export const getCountryByIP = async (ip: string) => {
  const response = await axios.get(
    `http://api.ipstack.com/${ip}?access_key=${process.env.IPSTACK_API_KEY}`
  );
  return response.data.country_name || 'Desconocido';
};
Integración en controlador:

typescript
// En método add() del controlador
const ip = getClientIp(req);
const country = await getCountryByIP(ip);
await ContactosModel.addContact({...req.body, ip, country});
2. Google Analytics
Pasos de implementación:
Crear propiedad en Google Analytics:

Acceder a analytics.google.com

Crear nueva propiedad y obtener ID de seguimiento (G-XXXXXXX)

Insertar código en vistas:

html
<!-- views/layout.ejs -->
<head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-S2CFX5MH3V"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-S2CFX5MH3V');
  </script>
</head>
Registrar eventos personalizados:

javascript
// En submit de formularios
document.getElementById('contact-form').addEventListener('submit', () => {
  gtag('event', 'form_submit', {event_category: 'Contacto'});
});
3. Google reCAPTCHA v2
Pasos de implementación:
Registrar sitio en reCAPTCHA:

Visitar google.com/recaptcha

Registrar dominio y obtener claves (site key y secret key)

Agregar widget a formularios:

html
<!-- En vistas de formularios -->
<div class="g-recaptcha" data-sitekey="<%= process.env.RECAPTCHA_SITE_KEY %>"></div>
<script src="https://www.google.com/recaptcha/api.js"></script>
Validación en backend:

typescript
// middlewares/recaptchaMiddleware.ts
export const verifyRecaptcha = async (token: string) => {
  const response = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    null,
    {params: {secret: process.env.RECAPTCHA_SECRET_KEY, response: token}}
  );
  return response.data.success;
};

// En controlador antes de procesar
const isValid = await verifyRecaptcha(req.body['g-recaptcha-response']);
if (!isValid) throw new Error('Verificación reCAPTCHA fallida');
4. Notificaciones por Email
Pasos de implementación:
Configurar transporte Nodemailer:

typescript
// services/emailService.ts
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
Crear función de notificación:

typescript
export const sendContactNotification = (contactData: any) => {
  const html = `
    <h3>Nuevo contacto recibido</h3>
    <p><strong>Nombre:</strong> ${contactData.nombre}</p>
    <p><strong>Email:</strong> ${contactData.email}</p>
    <p><strong>Comentario:</strong> ${contactData.comentario}</p>
    <p><strong>IP:</strong> ${contactData.ip}</p>
    <p><strong>País:</strong> ${contactData.country}</p>
    <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
  `;
  
  transporter.sendMail({
    to: ['programacion2ais@yopmail.com'],
    subject: 'Nuevo formulario completado',
    html: html
  });
};
Integrar en controlador:

typescript
// Después de guardar en BD
await sendContactNotification({ email, nombre, comentario, ip, country });
5. Fake Payment API
Pasos de implementación:
Obtener API Key:

Visitar fakepayment.onrender.com

Registrar aplicación y obtener API Key

Crear servicio de pagos:

typescript
// services/paymentService.ts
export const processPayment = async (paymentData: any) => {
  const response = await axios.post(
    'https://fakepayment.onrender.com/payments',
    {
      cardNumber: paymentData.cardNumber,
      amount: paymentData.amount,
      cvv: paymentData.cvv,
      currency: paymentData.currency,
      reference: `txn_${Date.now()}`
    },
    {
      headers: { 
        Authorization: `Bearer ${process.env.FAKEPAYMENT_API_KEY}` 
      }
    }
  );
  return response.data;
};
Integrar en controlador de pagos:

typescript
// En paymentAdd()
const paymentResult = await processPayment(req.body);
if (paymentResult.status === 'success') {
  await ContactosModel.paymentAdd(req.body);
} else {
  throw new Error('Error en el pago');
}
6. Gestión de Seguridad
Pasos de implementación:
Crear archivo .env:

env
IPSTACK_API_KEY=tu_clave_ipstack
RECAPTCHA_SITE_KEY=tu_clave_frontend
RECAPTCHA_SECRET_KEY=tu_clave_backend
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=contraseña_app
FAKEPAYMENT_API_KEY=tu_api_key
Configurar acceso en app.ts:

typescript
import dotenv from 'dotenv';
dotenv.config();
Ignorar en control de versiones (.gitignore):

.env
node_modules/