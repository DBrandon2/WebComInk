import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { signin } from "../../apis/auth.api";
import { useEffect } from "react";
import { useRef } from "react";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [params] = useSearchParams();
  const message = params.get("message");
  const navigate = useNavigate();

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (message === "success" && !hasShownToast.current) {
      toast.success("Inscription Validée ! Vous pouvez vous connecter");
      hasShownToast.current = true;
      navigate("/login", { replace: true });
    }
  }, [message, navigate]);
  const schema = yup.object({
    email: yup
      .string()
      .email()
      .required("Le champ est obligatoire")
      .matches(
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        "Format de votre email non valide"
      ),
  });

  const defaultValues = {
    email: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  async function submit(values) {
    console.log(values);
    try {
      const response = await signin(values);
      console.log(response);

      if (!response.message) {
        reset(defaultValues);
        toast.success("Connexion réussie");
        login(response);
        navigate("/");
      } else {
        toast.error("Connexion échouée");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded">
        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col gap-4 mb-6 mx-auto max-w-[400px]"
        >
          <div className="flex flex-col mb-2">
            <label htmlFor="email" className="mb-2">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="border border-gray-300 rounded px-3 py-2 focus: outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="password" className="mb-2">
              Mot de passe
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className="border border-gray-300 rounded px-3 py-2 focus: outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
