import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import ButtonAnimated from "../../components/ButtonAnimated";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getMangas } from "../../services/mangaService";
import { enrichMangas, slugify } from "../../utils/mangaUtils";
import { getMangaCoverUrl } from "../../utils/mangaUtils";
import { motion } from "framer-motion";

// Composant utilitaire pour clamp dynamique du nom d'auteur
function AuthorNameClamp({ name }) {
  const spanRef = useRef(null);
  const [small, setSmall] = useState(false);

  useLayoutEffect(() => {
    const el = spanRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      setSmall(true);
    } else {
      setSmall(false);
    }
  }, [name]);

  return (
    <span
      ref={spanRef}
      className={`font-light truncate max-w-[90px] lg:max-w-[180px] inline-block align-bottom ${
        small ? "text-xs lg:text-sm" : "text-sm lg:text-base"
      }`}
      title={name}
    >
      {name}
    </span>
  );
}

export default function MostPopular() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columns, setColumns] = useState(null);
  const [pendingScroll, setPendingScroll] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Reset mangas à chaque retour/navigation sur la page
  useEffect(() => {
    setMangas([]);
    setLoading(true);
  }, [location]);

  // Détermine dynamiquement le nombre de colonnes selon la largeur de l'écran
  function getColumns() {
    if (window.innerWidth >= 1536) return 6; // 2xl
    if (window.innerWidth >= 1280) return 5; // xl
    if (window.innerWidth >= 768) return 4; // md
    return 3; // mobile/sm
  }

  // Initialise columns au mount
  useEffect(() => {
    setColumns(getColumns());
  }, []);

  // Met à jour le nombre de colonnes au resize
  useEffect(() => {
    function handleResize() {
      setColumns(getColumns());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (columns === null) return;
    async function fetchPopularMangas() {
      setLoading(true);
      setError(null);
      try {
        const rows = 2;
        const limit = columns * rows + 1; // +1 pour la bannière
        const params = {
          limit,
          lang: "fr",
          includes: ["cover_art", "author", "artist"],
          sort: "Popularité",
        };
        const data = await getMangas(params);
        const enriched = enrichMangas(data.data);
        setMangas(enriched);
        // Si scroll mémorisé, déclenche la restauration après le rendu
        const saved = sessionStorage.getItem("mostPopularScroll");
        if (saved) {
          setPendingScroll(parseInt(saved, 10));
          sessionStorage.removeItem("mostPopularScroll");
        }
      } catch (err) {
        setError("Erreur lors du chargement des mangas populaires.");
      } finally {
        setLoading(false);
      }
    }
    fetchPopularMangas();
  }, [columns]);

  // Restaure le scroll après le rendu effectif
  useLayoutEffect(() => {
    if (pendingScroll !== false) {
      setTimeout(() => {
        window.scrollTo(0, pendingScroll);
      }, 0);
      setPendingScroll(false);
    }
  }, [pendingScroll, mangas.length]);

  // Déterminer le manga à afficher en bannière (le plus populaire)
  const bannerManga = mangas.length > 0 ? mangas[0] : null;
  // Affiche toujours (colonnes * 2) mangas sous la bannière
  const mangasToShow =
    mangas.length > 1 ? mangas.slice(1, columns * 2 + 1) : [];

  // Génère l'URL de la couverture originale (non redimensionnée) pour la bannière
  const getBannerCoverOriginalUrl = (manga) => {
    if (!manga || !manga.originalData) return "";
    const relationships = manga.originalData.relationships || [];
    const coverRel = relationships.find((rel) => rel.type === "cover_art");
    const coverFileName = coverRel?.attributes?.fileName;
    return coverFileName
      ? `${import.meta.env.VITE_API_URL}/proxy/covers/${
          manga.id
        }/${coverFileName}`
      : "/default-cover.png";
  };

  return (
    <div className="flex flex-col items-center justify-center gap-y-6 lg:gap-y-12 px-3 w-full overflow-x-hidden">
      {/* Titre et sous titre */}
      <div className="flex w-full h-full xl:justify-center">
        <div className="flex w-full justify-center lg:justify-between items-center lg:px-7">
          <div className="flex flex-col">
            <h1 className="text-3xl text-accent text-center lg:text-start font-medium tracking-wider lg:text-4xl">
              Les plus populaires
            </h1>
            <h2 className="text-center lg:text-start font-light">
              Découvre ici les œuvres les plus populaires de la platforme !
            </h2>
          </div>
          <NavLink to="/comics" className="hidden lg:flex">
            <ButtonAnimated text="Decouvrir plus" />
          </NavLink>
        </div>
      </div>

      <div className="flex flex-col items-center gap-y-4 md:gap-y-12 w-full">
        {/* Banner panoramique immersive alignée au contenu */}
        {/* Version md et + uniquement */}
        {bannerManga && (
          <NavLink
            to={`/Comics/${bannerManga.id}/${slugify(bannerManga.title)}`}
            className="relative hidden md:flex flex-row items-center justify-center gap-8 mb-6 mt-6 w-full max-w-full mx-auto h-[260px] md:h-[300px] xl:h-[320px] px-4 md:px-8"
            onClick={() =>
              sessionStorage.setItem("mostPopularScroll", window.scrollY)
            }
          >
            {/* Image de fond floutée */}
            <img
              src={getBannerCoverOriginalUrl(bannerManga)}
              alt={bannerManga.title}
              className="w-full h-full object-cover absolute top-0 left-0 blur-sm scale-110 z-0 transition-all duration-500 object-center"
              style={{ height: "100%", objectPosition: "center" }}
              loading="lazy"
              decoding="async"
              sizes="100vw"
              width={1920}
              height={360}
            />
            {/* Couverture nette à gauche */}
            <div className="z-20 flex-shrink-0 flex flex-col items-center justify-center">
              <div className="shadow-2xl overflow-hidden bg-dark-bg/80 ">
                <img
                  src={getBannerCoverOriginalUrl(bannerManga)}
                  alt={`Couverture de ${bannerManga.title}`}
                  className="object-cover w-[120px] h-[180px] md:w-[180px] md:h-[260px] xl:w-[220px] xl:h-[320px]"
                  style={{ objectPosition: "center" }}
                  decoding="async"
                  loading="lazy"
                  sizes="(min-width:1280px) 220px, (min-width:768px) 180px, 120px"
                  width={220}
                  height={320}
                />
              </div>
            </div>
            {/* Infos à droite */}
            <div className="z-20 flex flex-col justify-center items-start gap-4 ml-4 md:ml-8 bg-dark-bg/60 p-4 md:p-6 rounded-lg shadow-xl min-w-[180px] md:min-w-[280px] max-w-[320px] md:max-w-[420px] text-left">
              <h2 className="text-xl md:text-3xl text-accent font-medium tracking-wider">
                {bannerManga.title}
              </h2>
              <div>
                <div className="text-base md:text-lg text-white font-semibold">
                  Auteur :{" "}
                  <span className="font-normal">{bannerManga.authorName}</span>
                </div>
                {bannerManga.artistName &&
                  bannerManga.artistName !== bannerManga.authorName && (
                    <div className="text-base md:text-lg text-white font-semibold">
                      Artiste :{" "}
                      <span className="font-normal">
                        {bannerManga.artistName}
                      </span>
                    </div>
                  )}
              </div>
              {/* Bouton Découvrir, visible uniquement sur desktop, utilise ButtonAnimated et useNavigate */}
              <div className="hidden md:inline-block mt-2">
                <ButtonAnimated
                  text="Découvrir"
                  onClick={() =>
                    navigate(
                      `/Comics/${bannerManga.id}/${slugify(bannerManga.title)}`
                    )
                  }
                />
              </div>
            </div>
          </NavLink>
        )}
        {/* Version mobile : bannière classique mais dynamique (cover du manga le plus populaire, sans effet) */}
        {bannerManga && (
          <NavLink
            to={`/Comics/${bannerManga.id}/${slugify(bannerManga.title)}`}
            className="relative flex md:hidden flex-col gap-2 mb-0 mt-6 w-full max-w-full mx-auto h-[180px]"
            onClick={() =>
              sessionStorage.setItem("mostPopularScroll", window.scrollY)
            }
          >
            <img
              src={getBannerCoverOriginalUrl(bannerManga)}
              alt={`Bannière ${bannerManga.title}`}
              className="w-full h-full object-cover object-center"
              style={{ height: "100%", objectPosition: "center" }}
              decoding="async"
              sizes="100vw"
              width={1080}
              height={180}
            />
            {/* Dégradé bas */}
            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-1/2 z-10">
              <div className="w-full h-full bg-gradient-to-t from-dark-bg to-transparent" />
            </div>
            {/* Titre dans l'image, centré, sur le dégradé */}
            <div className="absolute bottom-2 left-0 w-full flex justify-center z-20">
              <h2 className="text-2xl text-accent text-center font-medium tracking-wider px-2 py-1 rounded">
                {bannerManga.title}
              </h2>
            </div>
          </NavLink>
        )}

        {/* Liste des mangas dynamiques */}
        {loading ? (
          <div className="text-accent text-lg">Chargement...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 md:gap-x-4 gap-y-6 w-full max-w-full 2xl:w-[90%] xl:gap-x-12 justify-center ">
            {mangasToShow.map((item, index) => (
              <NavLink
                key={item.id || index}
                to={`/Comics/${item.id}/${slugify(item.title)}`}
                onClick={() =>
                  sessionStorage.setItem("mostPopularScroll", window.scrollY)
                }
              >
                <div
                  className={`flex flex-col items-center gap-2 w-full ${
                    index === 10 ? "hidden md:flex" : ""
                  }`}
                >
                  <motion.div
                    className="w-[95px] h-[140px] sm:w-[110px] sm:h-[165px] md:w-[140px] md:h-[210px] lg:w-[180px] lg:h-[270px] xl:w-[220px] xl:h-[330px] bg-gray-200 relative overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <img
                      className="w-full h-full object-cover cursor-pointer transition-opacity duration-500"
                      src={item.coverUrl}
                      alt="Manga Cover"
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width:1536px) 220px, (min-width:1280px) 180px, (min-width:768px) 140px, (min-width:640px) 110px, 95px"
                      width={220}
                      height={330}
                    />
                  </motion.div>
                  <div className="flex flex-col justify-center items-center text-center w-full">
                    <h3 className="font-medium text-accent line-clamp-2 text-sm md:text-base lg:text-lg">
                      {item.title}
                    </h3>
                    <span className="text-xs text-gray-400 md:text-sm line-clamp-2">
                      Auteur : {item.authorName}
                    </span>
                    {item.artistName && item.artistName !== item.authorName && (
                      <span className="text-xs text-gray-400 md:text-sm line-clamp-2">
                        Artiste : {item.artistName}
                      </span>
                    )}
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>
      <NavLink to="/comics" className="lg:hidden">
        <ButtonAnimated text={"Parcourir plus"} />
      </NavLink>
    </div>
  );
}
