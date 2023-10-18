import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./Login.module.scss"
import { Link, useNavigate } from "react-router-dom";

export default function Login({seeHomepage, getUser}) {
    const [feedback, setFeedBack] = useState("");
    const [feedbackGood, setFeedBackGood] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false)

    const navigate = useNavigate();

    const yupSchema = yup.object({
        email: yup
          .string()
          .required("Le champ est obligatoire")
          .email("Vous devez saisir un email valide"),
        password: yup.string().required("Le champ est obligatoire"),
      });

      const defaultValues = {
        password: "",
        email: "",
      };

      const{
        register,
        handleSubmit,
        reset,
        formState: {errors},
      } = useForm({
        defaultValues,
        mode: "onChange",
        resolver: yupResolver(yupSchema)
      });

      async function submit(values) {
        try{

          setFeedBack("")
          console.log(values);
          const response = await fetch("http://localhost:8000/api/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });
          if (response.ok) {
            const newUser = await response.json();
            if(newUser.message){
              setIsSubmitted(false)
              setFeedBack(newUser.message);
            }
            else{
              setFeedBackGood(" Connexion ...")
              reset(defaultValues);
              setIsSubmitted(true)
              console.log("User récupéré", newUser);
              let user ={};
              user.username = newUser[0].username;
              user.email = newUser[0].email;

              console.log("User modifié", user);
                reset(defaultValues);
                setTimeout(() => {
                  navigate('/');
                    getUser(user);
                  }, 2000);

            }
        }
      } catch (error) {
        console.error(error)
      } finally {
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
        <Link to="../Inscription" className={`${styles.link}`}>Inscription</Link>
        <p className={`${styles.linkSpace}`}></p>
        <Link to="" className={`${styles.link}`}>Connexion</Link>
        </div>
      
        <form onSubmit={handleSubmit(submit)}>
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



