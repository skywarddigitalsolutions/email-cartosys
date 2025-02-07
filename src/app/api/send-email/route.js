import nodemailer from "nodemailer";

export async function POST(req) {
  // Configurar cabeceras CORS
  const headers = new Headers({
    "Access-Control-Allow-Origin": "https://cartosys.com.ar",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  // Manejar solicitudes preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // Procesar solicitud POST
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ message: "Todos los campos son obligatorios." }),
        { status: 400, headers }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Formulario Web" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO,
      replyTo: email,
      subject: `Nuevo mensaje de contacto de ${name}`,
      text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`,
    });

    return new Response(
      JSON.stringify({ message: "Correo enviado con éxito." }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return new Response(
      JSON.stringify({ message: "Error al enviar el correo." }),
      { status: 500, headers }
    );
  }
}