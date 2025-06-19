import React, { useContext, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthContext } from "../../context/AuthContext";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  NavLink,
} from "react-router-dom";
import toast from "react-hot-toast";
import { signin, signup } from "../../apis/auth.api";
import { MdOutlineArrowBackIos } from "react-icons/md";
import SwitchBtn from "../../components/shared/SwitchBtn";

export default function Auth() {
  const { login } = useContext(AuthContext);
  const [params] = useSearchParams();
  const location = useLocation();
  const message = params.get("message");
  const navigate = useNavigate();

  const getInitialTab = () => {
    if (location.pathname === "/register") return "Inscription";
    if (location.pathname === "/login") return "Connexion";
    return "Connexion";
  };

  const [activeFilter, setActiveFilter] = useState(getInitialTab());
  const [previousFilter, setPreviousFilter] = useState(null);
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (message === "success" && !hasShownToast.current) {
      toast.success("Inscription Validée ! Vous pouvez vous connecter");
      hasShownToast.current = true;
      navigate("/auth", { replace: true });
    } else if (message === "error" && !hasShownToast.current) {
      toast.error("Token invalide ! Veuillez vous réinscrire");
      hasShownToast.current = true;
      setActiveFilter("Inscription");
      navigate("/auth", { replace: true });
    }
  }, [message, navigate]);

  const loginSchema = yup.object({
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

  const registerSchema = yup.object({
    username: yup.string().required("Le champ est obligatoire"),
    email: yup
      .string()
      .email()
      .required("Le champ est obligatoire")
      .matches(
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        "Format de votre email non valide"
      ),
    password: yup
      .string()
      .required("Le champ est obligatoire")
      .min(5, "trop court")
      .max(20, "trop long"),
    confirmPassword: yup
      .string()
      .required("Le champ est obligatoire")
      .oneOf(
        [yup.ref("password"), ""],
        "Les mots de passe ne correspondent pas"
      ),
    rgpd: yup
      .boolean()
      .oneOf([true], "Vous devez accepter les termes et conditions"),
  });

  const loginForm = useForm({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const registerForm = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      rgpd: false,
    },
    resolver: yupResolver(registerSchema),
    mode: "onChange",
  });

  async function submitLogin(values) {
    try {
      const response = await signin(values);
      if (!response.message) {
        loginForm.reset();
        toast.success("Connexion réussie");
        login(response);
        navigate("/");
      } else {
        toast.error("Connexion échouée");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  }

  async function submitRegister(values) {
    try {
      const feedback = await signup(values);
      if (!feedback.message) {
        registerForm.reset();
        toast.success(feedback.messageOk);
        setActiveFilter("Connexion");
      } else {
        toast.error(feedback.message);
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  }

  const handleSwitchClick = (newFilter) => {
    setPreviousFilter(activeFilter);
    setActiveFilter(newFilter);
  };
  return (
    <div className="w-full min-h-screen bg-dark-bg flex flex-col">
      {/* Header mobile */}
      <div className="flex justify-between items-center px-6 py-4 lg:hidden">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:text-gray-300 transition-colors cursor-pointer"
        >
          <MdOutlineArrowBackIos className="text-3xl" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-start items-center px-6 pb-8 w-full max-w-xl mx-auto">
        {/* Titre + texte */}
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-2xl text-accent font-medium tracking-wider lg:text-4xl mb-2">
            {activeFilter === "Connexion"
              ? "Tu n'es pas connecté ?"
              : "Rejoins-nous !"}
          </h1>
          <p className="font-light text-gray-300">
            {activeFilter === "Connexion"
              ? "Connecte-toi pour profiter de tous les avantages WebComink !"
              : "Crée ton compte et découvre l'univers WebComink !"}
          </p>
        </div>

        {/* Switch Button */}
        <div className="mb-8 w-full">
          <SwitchBtn
            btnleft="Connexion"
            btnright="Inscription"
            activeFilter={activeFilter}
            previousFilter={previousFilter}
            onSwitchClick={handleSwitchClick}
          />
        </div>

        {/* Formulaire */}
        <div className="w-full">
          {activeFilter === "Connexion" && (
            <form
              onSubmit={loginForm.handleSubmit(submitLogin)}
              className="space-y-6"
            >
              {/* Email */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Email
                </label>
                <input
                  {...loginForm.register("email")}
                  type="email"
                  className="w-full bg-transparent border-b-2 border-gray-600 py-3 px-0 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                  placeholder="votre@email.com"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-400 text-sm mt-2">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Mot de passe
                </label>
                <input
                  {...loginForm.register("password")}
                  type="password"
                  className="w-full bg-transparent border-b-2 border-gray-600 py-3 px-0 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                  placeholder="••••••••"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-400 text-sm mt-2">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Bouton */}
              <div className="pt-8">
                <button
                  type="submit"
                  className="w-full border-2 border-accent text-accent py-4 px-6 hover:bg-accent hover:text-dark-bg transition-all duration-300 font-medium text-lg rounded-lg cursor-pointer"
                >
                  Se connecter
                </button>
              </div>

              {/* Mot de passe oublié */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-gray-400 text-sm hover:text-accent transition-colors cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </form>
          )}

          {activeFilter === "Inscription" && (
            <form
              onSubmit={registerForm.handleSubmit(submitRegister)}
              className="space-y-6"
            >
              {/* Username */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Pseudo
                </label>
                <input
                  {...registerForm.register("username")}
                  type="text"
                  className="w-full bg-transparent border-b-2 border-gray-600 py-3 px-0 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                  placeholder="Votre pseudo"
                />
                {registerForm.formState.errors.username && (
                  <p className="text-red-400 text-sm mt-2">
                    {registerForm.formState.errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Email
                </label>
                <input
                  {...registerForm.register("email")}
                  type="email"
                  className="w-full bg-transparent border-b-2 border-gray-600 py-3 px-0 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                  placeholder="votre@email.com"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-400 text-sm mt-2">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Mot de passe
                </label>
                <input
                  {...registerForm.register("password")}
                  type="password"
                  className="w-full bg-transparent border-b-2 border-gray-600 py-3 px-0 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                  placeholder="••••••••"
                />
                {registerForm.formState.errors.password && (
                  <p className="text-red-400 text-sm mt-2">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirmation */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Confirmation du mot de passe
                </label>
                <input
                  {...registerForm.register("confirmPassword")}
                  type="password"
                  className="w-full bg-transparent border-b-2 border-gray-600 py-3 px-0 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                  placeholder="••••••••"
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-2">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* RGPD */}
              <div className="flex items-start space-x-3 pt-2 cursor-pointer">
                <input
                  {...registerForm.register("rgpd")}
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-accent bg-transparent border-2 border-gray-600 rounded focus:ring-accent focus:ring-2 cursor-pointer"
                  id="rgpd"
                />
                <label
                  htmlFor="rgpd"
                  className="text-gray-300 text-sm leading-relaxed cursor-pointer"
                >
                  En soumettant ce formulaire j'accepte les{" "}
                  <NavLink to>
                    <span className="text-accent hover:underline cursor-pointer">
                      termes et conditions
                    </span>
                  </NavLink>
                </label>
              </div>
              {registerForm.formState.errors.rgpd && (
                <p className="text-red-400 text-sm">
                  {registerForm.formState.errors.rgpd.message}
                </p>
              )}

              {/* Bouton */}
              <div className="pt-8">
                <button
                  type="submit"
                  className="w-full border-2 border-accent text-accent py-4 px-6 hover:bg-accent hover:text-dark-bg transition-all duration-300 font-medium text-lg rounded-lg cursor-pointer"
                >
                  S'inscrire
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
