import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./inscription.module.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { createUser } from "../../../apis/users";
import { useState } from "react";


export default function Register() {

  const [feedbackGood, setFeedbackGood] = useState("")

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
    formState: { errors, isSubmitting },
    clearErrors,
    setError,
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(yupSchema),
  });

  async function submit(values) {
    // console.log(values);
    try {
      clearErrors();
      await createUser(values);
      setFeedbackGood("Inscription réussie, redirection vers la page connexion...")
      setTimeout(() => {
        navigate("/connexion");
      }, 2000) 
    } catch (error) {
      setError("generic", { type: "generic", message: "Mail déjà existant" });
    }
  }

  console.log("ok")

  return (
    <div
      className={`flex-fill d-flex flex-column justify-content-center align-items-center ${styles.mainDiv}`}
    >
      <div className={`${styles.Entête}`}>
        <h1 className={`${styles.h1}`}>Tu n'es pas encore inscrit ?</h1>
        <span className={`${styles.span}`}>N'attends plus, profite de toutes les fonctionnalitées de WebComInk !</span>
      </div>
      <div className={`${styles.linkdiv}`}>
        <NavLink to="" className={`${styles.link}`}>
          Inscription
        </NavLink>
        <p className={`${styles.linkSpace}`}></p>
        <NavLink to="../connexion" className={`${styles.link}`}>
          Connexion
        </NavLink>
      </div>
      {/* Formulaire */}
      <form onSubmit={handleSubmit(submit)} className={`${styles.formStyle}`}>
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
        {errors?.generic && ( 
          <p className={`${styles.feedback}`}>{errors.generic.message}</p>
        )}

        {feedbackGood && (
          <p className={`${styles.feedbackGood}`}>
            {feedbackGood}
          </p>
        )}

        <button disabled={isSubmitting} className={`${styles.submitBtn}`}>
          Submit
        </button>
      </form>
    </div>
  );
}
