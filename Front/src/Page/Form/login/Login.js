import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./Login.module.scss"
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

export default function Login() {

  const { login } = useContext(AuthContext);
  const [feedback, setFeedback] = useState("")
  const [feedbackGood, setFeedbackGood] = useState("")
  const [isSubmitted, setIsSubmitted] = useState("")
    const navigate = useNavigate();

    const yupSchema = yup.object({
        email: yup
          .string()
          .required("Le champ est obligatoire")
          .email("Vous devez saisir un email valide"),
        password: yup.string().required("Le champ est obligatoire"),
      });

      const defaultValues = {
        email: "",
        password: "",
      };

      const{
        register,
        handleSubmit,
        clearErrors,
        setError,
        formState: {errors, isSubmitting},
      } = useForm({
        defaultValues,
        resolver: yupResolver(yupSchema)
      });

      async function submit(values) {
        try {
          clearErrors();
          await login(values);
          setFeedbackGood("Connexion réussie, vous allez être redirigé")
          setTimeout(() => {
            navigate("../profile")
          }, 1500)
        } catch (error) {
          setError("generic", { type: "generic", message: "Email ou mot de passe incorrect" });
        }
        finally{
          setIsSubmitted(false)
        }
      }



  return (
    <div className={`flex-fill d-flex flex-column justify-content-center align-items-center ${styles.mainDiv}`}>
      <div className={`${styles.Entête}`}>
        <h1 className={`${styles.h1}`}>Tu n'es pas connecté ?</h1>
        <span className={`${styles.span}`}>Connecte toi pour profiter de tous les avantages WebComInk !</span>

      </div>
      <div className={`${styles.linkdiv}`}>
        <NavLink to="../inscription" className={`${styles.link}`}>Inscription</NavLink>
        <p className={`${styles.linkSpace}`}></p>
        <Link to="" className={`${styles.link}`}>Connexion</Link>
        </div>
      
        <form onSubmit={handleSubmit(submit)} className={`${styles.formStyle}`}>
            <div className={`d-flex flex-column mb10 ${styles.labelDiv}`}>
                <label htmlFor="email" className={`mb5 ${styles.labelEmail}`}>
                    Email
                </label>
                <input type="email" id="email" {...register("email")} className={` ${styles.inputEmail}`}/>
                {errors?.email && (
                <p className={`${styles.feedback}`}>{errors.email.message}</p>
                )}
            </div>
            <div className={`d-flex flex-column mb10 ${styles.labelDiv}`}>
                <label htmlFor="password" className={`mb5 ${styles.labelPassword}`}>
                    Password
                </label>
                <input type="password" id="password" {...register("password")} className={` ${styles.inputPassword}`}/>
                {errors?.password && (
                <p className={`${styles.feedback} mb20`}>{errors.password.message}</p>
                )}

              {feedback && <p className={`${styles.feedback} mb20`}>{feedback}</p>}
                        {feedbackGood && (
                          <p className={`${styles.feedbackGood} mb20`}>{feedbackGood}</p>
                        )}
                        {errors?.generic && (
                          <p className={`${styles.feedback}`}>{errors.generic.message}</p>
                        )}

                        <div className={`${styles.mdpReset}`}>
                          <Link to="/motdepasseoublié"><p>Mot de passe oublié ?</p></Link>
                        </div>

            </div>
            <button disabled={isSubmitted} className={`${styles.submitBtn}`}>
                Submit
            </button>
        </form>
    </div>
  );
}



