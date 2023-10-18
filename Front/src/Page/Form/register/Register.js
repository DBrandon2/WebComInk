import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./inscription.module.scss";
import { Link, useNavigate } from "react-router-dom";

export default function Register({ seeLoginForm }) {
  const [feedback, setFeedBack] = useState("");
  const [feedbackGood, setFeedBackGood] = useState("");
  const [isSubmitted, setIsSubmitted] = useState("");

  const navigate = useNavigate();

  const yupSchema = yup.object({
    username: yup
      .string()
      .required("Le champ est obligatoire")
      .min(3, "Le champ doit contenir au minimum 2 caractères")
      .max(16),
    email: yup
      .string()
      .required("Le champ est obligatoire")
      .email("Vous devez saisir un email valide"),
    password: yup
      .string()
      .required("Le champ est obligatoire")
      .min(8, "Mot de passe trop court")
      .max(24, "Mot de passe trop long"),
    confirmPassword: yup
      .string()
      .required("Vous devez confirmer votre mot de passe")
      .oneOf(
        [yup.ref("password", "")],
        "Les mots de passe ne correspondents pas"
      ),
  });

  const defaultValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(yupSchema),
  });

  async function submit(values) {
    try {
      setIsSubmitted(true);
      setFeedBack("");
      console.log(values);
      const response = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const newUser = await response.json();
        if (newUser.message) {
          setFeedBack("Email déjà existant");
        } else {
          setFeedBackGood(newUser.messageGood);
          reset(defaultValues);
          setIsSubmitted(true);
          setTimeout(() => {
            navigate("/Connexion");
          }, 2000);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitted(false);
    }
  }

  return (
    <div
      className={`flex-fill d-flex flex-column justify-content-center align-items-center ${styles.mainDiv}`}
    >
      <div className={`${styles.Entête}`}>
        <h1 className={`${styles.h1}`}>Tu n'es pas encore inscrit ?</h1>
        <span className={`${styles.span}`}>N'attends plus, profite de toutes les fonctionnalitées de WebComInk !</span>
      </div>
      <div className={`${styles.linkdiv}`}>
        <Link to="" className={`${styles.link}`}>
          Inscription
        </Link>
        <p className={`${styles.linkSpace}`}></p>
        <Link to="../Connexion" className={`${styles.link}`}>
          Connexion
        </Link>
      </div>
      {/* Formulaire */}
      <form onSubmit={handleSubmit(submit)}>
        {/* Username */}
        <div className={`d-flex flex-column mb10 ${styles.labelDiv}`}>
          <label htmlFor="username" className="mb10">
            Username
          </label>
          <input type="text" id="username" {...register("username")} />
          {errors?.username && (
            <p className={`${styles.feedback}`}>{errors.username.message}</p>
          )}
        </div>
        {/* Email*/}
        <div className={`d-flex flex-column mb10 ${styles.labelDiv}`}>
          <label htmlFor="email" className="mb10">
            Email
          </label>
          <input type="email" id="email" {...register("email")} />
          {errors?.email && (
            <p className={`${styles.feedback}`}>{errors.email.message}</p>
          )}
        </div>
        {/* Password*/}
        <div className={`d-flex flex-column mb10 ${styles.labelDiv}`}>
          <label htmlFor="password" className="mb10">
            Password
          </label>
          <input type="password" id="password" {...register("password")} />
          {errors?.password && (
            <p className={`${styles.feedback}`}>{errors.password.message}</p>
          )}
        </div>
        {/* Confirm Password*/}
        <div className={`d-flex flex-column mb10 ${styles.labelDiv}`}>
          <label htmlFor="confirmPassword" className="mb10">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword")}
          />
          {errors?.confirmPassword && (
            <p className={`${styles.feedback}`}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {feedback && <p className={`${styles.feedback} mb20`}>{feedback}</p>}
        {feedbackGood && (
          <p className={`${styles.feedbackGood} mb20`}>{feedbackGood}</p>
        )}

        <button disabled={isSubmitted} className={`${styles.submitBtn}`}>
          Submit
        </button>
      </form>
    </div>
  );
}
