import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from "./ForgotPassword.module.scss"
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';

function ForgotPassword() {
    const [feedback, setFeedback] = useState("");
    const [feedbackGood, setFeedbackGood] = useState("");
    const navigate = useNavigate();

    const yupSchema = yup.object({
        email:yup
        .string()
        .required("Le champ est obligatoire")
        .matches(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
                "Votre email n'est pas valide"
        ),
    });

    const defaultValues = {
        email: "",
    };

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues,
        mode:"onChange",
        resolver: yupResolver(yupSchema),
    });

    async function submit(values) {
        console.log(values)
        setFeedbackGood("Un lien vous sera envoyé par mail si l'adresse correspond à un compte valide")
        try {
            await fetch(`http://localhost:8000/api/users/changermotdepasse/${values.email}`)
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <div className={`${styles.mainDiv}`}>
        <form onSubmit={handleSubmit(submit)} className={`${styles.formForgot}`}>
        <div className={`${styles.Entête}`}>
            <h1 className={`${styles.h1Forgot}`}>Mot de passe oublié ?</h1>
            <span className={`${styles.spanForgot}`}>Entre ton mail pour réinitialiser ton mot de passe !</span>
        </div>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" {...register("email")} className={`${styles.labelForgot}`}  />
                {errors?.email && (
                    <p className={`${styles.feedback}`}>{errors.email.message}</p>
                )}
            </div>
            {feedback && <p className={`${styles.feedback}`}>{feedback}</p>}
                {feedbackGood && (
                    <p className={`${styles.feedbackGood}`}>{feedbackGood}</p>
                )}
                <button className={`${styles.submitBtn}`} >Submit</button>
        </form>
    </div>
  )
}

export default ForgotPassword