Implementación de Servicios Avanzados en el Proyecto
🌍 Geolocalización por IP
Implementación en el controlador:

typescript
// En el método add()
const ip = getClientIp(req) || 'unknown';
// Luego de obtener la IP:
const country = await ipstackService.getCountry(ip);
await ContactosModel.addContact({email, nombre, comentario, ip, country});
Flujo completo:

Obtenemos la IP del cliente usando getClientIp()

Consultamos la API de ipstack con esta IP

Extraemos el nombre del país de la respuesta

Almacenamos país + IP junto con los datos del formulario

📊 Google Analytics
Implementación en vistas:

ejs
<!-- En views/layout.ejs -->
<head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-S2CFX5MH3V"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-S2CFX5MH3V');
  </script>
</head>
Eventos personalizados:

javascript
// En submit del formulario
gtag('event', 'form_submit', {
  event_category: 'Contacto',
  event_label: 'Nuevo mensaje'
});

// En pagos exitosos
gtag('event', 'purchase', {
  value: amount,
  currency: currency
});
🛡️ Google reCAPTCHA
Middleware de validación:

typescript
// recaptchaMiddleware.ts
export const verifyRecaptcha = async (token: string) => {
  const response = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    { secret: process.env.RECAPTCHA_SECRET, response: token }
  );
  return response.data.success;
};
Uso en controlador:

typescript
// En método add()
const isValid = await verifyRecaptcha(req.body['g-recaptcha-response']);
if (!isValid) {
  return res.status(400).json({ error: 'Verificación reCAPTCHA fallida' });
}
✉️ Notificaciones por Email
Servicio de correo:

typescript
// emailService.ts
export const sendContactNotification = (contactData: any) => {
  const html = `
    <h3>Nuevo contacto recibido</h3>
    <p><strong>Nombre:</strong> ${contactData.nombre}</p>
    <p><strong>Email:</strong> ${contactData.email}</p>
    <p><strong>Comentario:</strong> ${contactData.comentario}</p>
    <p><strong>IP:</strong> ${contactData.ip}</p>
    <p><strong>País:</strong> ${contactData.country}</p>
  `;
  
  transporter.sendMail({
    to: ['programacion2ais@yopmail.com', 'admin@empresa.com'],
    subject: 'Nuevo formulario completado',
    html: html
  });
};
Integración en controlador:

typescript
// Después de guardar en BD
await sendContactNotification({ email, nombre, comentario, ip, country });
💳 Integración con Fake Payment API
Servicio de pagos:

typescript
// paymentService.ts
export const processPayment = async (paymentData: any) => {
  const response = await axios.post(
    'https://fakepayment.onrender.com/payments',
    {
      cardNumber: paymentData.cardNumber,
      amount: paymentData.amount,
      cvv: paymentData.cvv,
      currency: paymentData.currency
    },
    {
      headers: { 
        Authorization: `Bearer ${process.env.FAKEPAYMENT_API_KEY}` 
      }
    }
  );
  return response.data;
};
Uso en controlador:

typescript
// En paymentAdd()
const paymentResult = await processPayment({
  cardNumber,
  amount,
  cvv,
  currency
});

if (paymentResult.status === 'success') {
  // Guardar en BD
  await ContactosModel.paymentAdd({...req.body});
}
🔐 Gestión de Seguridad
Archivo .env:

env
# Credenciales sensibles
RECAPTCHA_SECRET=6Le...
FAKEPAYMENT_API_KEY=eyJhb...
IPSTACK_API_KEY=abc123...
EMAIL_PASS=app_password_gmail