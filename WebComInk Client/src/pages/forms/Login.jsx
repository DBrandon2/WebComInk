import React, { useContext, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { signin } from "../../apis/auth.api";
import { MdOutlineArrowBackIos } from "react-icons/md";
import SwitchBtn from "../../components/shared/SwitchBtn";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [params] = useSearchParams();
  const message = params.get("message");
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Connexion");
  const [previousFilter, setPreviousFilter] = useState(null);

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
    password: yup.string().required("Le mot de passe est obligatoire"),
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

  const handleSwitchClick = (newFilter) => {
    setPreviousFilter(activeFilter);
    setActiveFilter(newFilter);

    // Navigation vers la page d'inscription si "Inscription" est sélectionnée
    if (newFilter === "Inscription") {
      navigate("/register");
    }
  };

  return (
    <div className=" w-full min-h-screen bg-dark-bg flex flex-col gap-6">
      {/* Header avec bouton retour */}
      <div className="flex justify-between items-center px-6 py-4 lg:hidden">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <MdOutlineArrowBackIos className="text-3xl" />
        </button>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col gap-8 ">
        {/* Titre principal */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl text-accent text-center lg:text-start font-medium tracking-wider lg:text-4xl">
            Tu n'es pas connecté ?
          </h1>
          <p className="text-center lg:text-start font-light w-[90%]">
            Connecte toi pour profiter de tous les avantages WebComink !
          </p>
        </div>

        {/* Onglets avec SwitchBtn */}
        <div className="mb-8">
          <SwitchBtn
            btnleft="Connexion"
            btnright="Inscription"
            activeFilter={activeFilter}
            previousFilter={previousFilter}
            onSwitchClick={handleSwitchClick}
          />
        </div>

        {/* Formulaire - Affiché seulement si "Connexion" est actif */}
        {activeFilter === "Connexion" && (
          <>
            <form onSubmit={handleSubmit(submit)} className="space-y-6">
              {/* Champ Email */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full bg-transparent border-b border-gray-600 py-2 px-0 text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                  placeholder=""
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Champ Mot de passe */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Mot de passe
                </label>
                <input
                  {...register("password")}
                  type="password"
                  className="w-full bg-transparent border-b border-gray-600 py-2 px-0 text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                  placeholder=""
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Bouton de connexion */}
              <div className="pt-8">
                <button
                  type="submit"
                  className="w-full border border-yellow-400 text-yellow-400 py-3 px-6 hover:bg-yellow-400 hover:text-black transition-colors duration-200 font-medium"
                >
                  Se connecter
                </button>
              </div>
            </form>

            {/* Lien mot de passe oublié */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-gray-400 text-sm hover:text-yellow-400 transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </>
        )}

        {/* Contenu pour l'inscription - Si vous voulez afficher quelque chose */}
        {activeFilter === "Inscription" && (
          <div className="text-center py-8">
            <p className="text-gray-300">Redirection vers l'inscription...</p>
          </div>
        )}
      </div>
    </div>
  );
}
