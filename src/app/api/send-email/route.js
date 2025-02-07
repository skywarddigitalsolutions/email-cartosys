import nodemailer from "nodemailer";

export async function POST(req) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ message: "Todos los campos son obligatorios." }),
      { status: 400 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Configurar el contenido del correo
    await transporter.sendMail({
      from: `"Formulario Web" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO,
      replyTo: email,
      subject: `Nuevo mensaje de contacto de ${name}`,
      text: `Hola,\n\nTienes un nuevo mensaje de contacto en tu sitio web:\n\nNombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}\n\nResponde directamente a este correo para contactar con el cliente.`, // Contenido plano
      html: `
        <p><strong>Hola,</strong></p>
        <p>Tienes un nuevo mensaje de contacto en tu sitio web:</p>
        <ul>
          <li><strong>Nombre:</strong> ${name}</li>
          <li><strong>Correo:</strong> ${email}</li>
        </ul>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
        <p><em>Responde directamente a este correo para contactar con el cliente.</em></p>
      `,
    });

    return new Response(
      JSON.stringify({ message: "Correo enviado con éxito." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error enviando correo:", error);
    return new Response(
      JSON.stringify({ message: "Error al enviar el correo." }),
      { status: 500 }
    );
  }
}
