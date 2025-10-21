const nodemailer = require("nodemailer");

const useResend = Boolean(process.env.RESEND_API_KEY);
let Resend = null;
let resend = null;

if (useResend) {
  try {
    Resend = require("resend").Resend;
    resend = new Resend(process.env.RESEND_API_KEY);
  } catch (error) {
    console.warn("Resend module non disponible, utilisation de nodemailer uniquement");
    // Fallback vers nodemailer même si useResend était true
  }
}

const transporter = !useResend
  ? nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : null;

const sendConfirmationEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirmation d'inscription",
    html: `<p>Bienvenue sur notre site ! Cliquez sur le lien suivant pour confirmer l'inscription : <a href="${process.env.API_URL}/user/verifyMail/${token}">Confirmer l'inscription</a></p>`,
  };

  if (useResend) {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || `WebComInk <onboarding@resend.dev>`,
      to: email,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
  } else {
    await transporter.sendMail(mailOptions);
  }
};

const sendValidationAccount = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Inscription validée",
    html: `<p>Bienvenue sur notre site ! Cliquez sur le lien suivant pour vous connecter : <a href="${process.env.CLIENT_URL}/login">Se connecter</a></p>`,
  };

  if (useResend) {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || `WebComInk <onboarding@resend.dev>`,
      to: email,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
  } else {
    await transporter.sendMail(mailOptions);
  }
};

const sendInvalidEmailToken = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Problème lors de la validation",
    html: `<p>Token expiré ! Veuillez vous réinscrire : <a href="${process.env.CLIENT_URL}/register">S'inscrire'</a></p>`,
  };

  if (useResend) {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || `WebComInk <onboarding@resend.dev>`,
      to: email,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
  } else {
    await transporter.sendMail(mailOptions);
  }
};

const sendResetPasswordEmail = async (email, token) => {
  console.log("[MAIL] Envoi reset password à :", email, "token:", token);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Réinitialisation du mot de passe",
    html: `<p>Pour réinitialiser votre mot de passe, cliquez sur le lien suivant : <a href="${process.env.CLIENT_URL}/resetpassword?token=${token}">Réinitialiser le mot de passe</a></p>`,
  };
  if (useResend) {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || `WebComInk <onboarding@resend.dev>`,
      to: email,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
    if (error) {
      console.error("[MAIL] Erreur Resend:", error);
    } else {
      console.log("[MAIL] Résultat Resend:", data);
    }
  } else {
    const info = await transporter.sendMail(mailOptions);
    console.log("[MAIL] Résultat nodemailer :", info);
  }
};

module.exports = {
  sendConfirmationEmail,
  sendValidationAccount,
  sendInvalidEmailToken,
  sendResetPasswordEmail,
};
