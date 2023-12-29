import React, { useState } from "react";
import styles from "./ResetPassword.module.scss";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

function ResetPassword() {
  const [feedback, setFeedBack] = useState("");
  const [feedbackGood, setFeedBackGood] = useState("");

  const yupSchema = yup.object({
    password: yup
      .string()
      .required("Veuillez rentrer un mot de passe")
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
    console.log(values);
    try {
      const response = await fetch(
        "http://localhost:8000/api/users/changepassword",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      if (response.ok) {
        setFeedBackGood("Mot de passe modifier avec succès");
        reset(defaultValues);
      } else {
        setFeedBack("Erreur lors de la modification du mot de passe");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={`${styles.mainDiv}`}>
      <form onSubmit={handleSubmit(submit)}>
        <h1>Changer de mot de passe</h1>
        <span>zeinfeirogeorbgerg regejobgegeg</span>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" {...register(`password`)} />
          {errors.password && errors.password.message && (
            <p className={`${styles.feedback}`}>{errors.password.message}</p>
          )}

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            {...register(`confirmPassword`)}
          />
          {errors.confirmPassword && errors.confirmPassword.message && (
            <p className={`${styles.feedback}`}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        {feedback && <p className={`${styles.feedback} mb20`}>{feedback}</p>}
        {feedbackGood && (
          <p className={`${styles.feedbackGood} mb20`}>{feedbackGood}</p>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ResetPassword;
