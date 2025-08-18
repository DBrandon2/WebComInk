import React, { useEffect, useState } from "react";
import ButtonAnimated from "../../components/ButtonAnimated";
import { NavLink } from "react-router-dom";
import { getMangas } from "../../services/mangaService";
import {
  enrichMangas,
  getChapterDetails,
  filterSynopsis,
  slugify,
} from "../../utils/mangaUtils";
import { FaCalendarAlt } from "react-icons/fa";

// Shuffle déterministe basé sur une seed (ici, la date du jour)
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
function getSeedFromDate() {
  const now = new Date();
  // Format AAAAMMJJ
  return parseInt(
    `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`,
    10
  );
}
function shuffleArraySeeded(array, seed) {
  const arr = [...array];
  let m = arr.length,
    t,
    i;
  while (m) {
    i = Math.floor(seededRandom(seed + m) * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

// Fonction utilitaire pour obtenir la meilleure qualité de cover
function getBestCoverUrl(manga) {
  const relationships = manga.originalData?.relationships || [];
  const coverRel = relationships.find((rel) => rel.type === "cover_art");
  const coverFileName = coverRel?.attributes?.fileName;
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  return coverFileName
    ? `${API_BASE_URL}/proxy/covers/${manga.id}/${coverFileName}`
    : "/default-cover.png";
}

export default function Discover() {
  const [mangaOfTheDay, setMangaOfTheDay] = useState(null);
  const [chapterNumber, setChapterNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mangaRating, setMangaRating] = useState(null);

  useEffect(() => {
    async function fetchDailyManga() {
      setLoading(true);
      setError(null);
      try {
        const params = {
          limit: 30, // Pool large pour la découverte
          lang: "fr",
          includes: ["cover_art", "author", "artist"],
          sort: "Popularité",
        };
        const data = await getMangas(params);
        const enriched = enrichMangas(data.data);
        const seed = getSeedFromDate();
        const shuffled = shuffleArraySeeded(enriched, seed);
        setMangaOfTheDay(shuffled[0]);
      } catch (err) {
        setError("Erreur lors du chargement du manga du jour.");
      } finally {
        setLoading(false);
      }
    }
    fetchDailyManga();
  }, []);

  // Récupérer le numéro réel du chapitre quand mangaOfTheDay change
  useEffect(() => {
    async function fetchChapterNumber() {
      if (
        mangaOfTheDay &&
        mangaOfTheDay.latestUploadedChapter &&
        mangaOfTheDay.latestUploadedChapter !== "N/A"
      ) {
        const details = await getChapterDetails(
          mangaOfTheDay.latestUploadedChapter
        );
        setChapterNumber(details.chapter);
      } else {
        setChapterNumber(null);
      }
    }
    fetchChapterNumber();
  }, [mangaOfTheDay]);

  // Récupérer la note du manga
  useEffect(() => {
    async function fetchMangaRating() {
      if (mangaOfTheDay && mangaOfTheDay.id) {
        try {
          const API_BASE_URL =
            import.meta.env.VITE_API_URL || "http://localhost:3000";
          const response = await fetch(
            `${API_BASE_URL}/proxy/statistics/manga/${mangaOfTheDay.id}`
          );
          const data = await response.json();
          const stats = data.statistics?.[mangaOfTheDay.id];
          setMangaRating(stats?.rating?.average ?? null);
        } catch (err) {
          setMangaRating(null);
        }
      }
    }
    fetchMangaRating();
  }, [mangaOfTheDay]);

  //

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-6 mx-3 lg:gap-y-12">
      <div className="flex w-full h-full xl:justify-center ">
        <div className="flex w-full justify-center lg:justify-between items-center lg:px-7 ">
          {/* Titre et sous-titre */}
          <div className="flex flex-col">
            <h1 className="text-3xl text-accent text-center lg:text-start font-medium tracking-wider lg:text-4xl">
              Découverte du jour
            </h1>
            <h2 className="text-center lg:text-start font-light">
              Découvre chaque jour une nouvelle œuvre !
            </h2>
          </div>
          <NavLink to="/comics" className="hidden lg:flex">
            <ButtonAnimated text="Decouvrir plus" />
          </NavLink>
        </div>
      </div>

      {loading ? (
        <div className="text-accent text-lg">Chargement...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : mangaOfTheDay ? (
        <div className="flex flex-col items-center w-full lg:flex-row lg:justify-center lg:gap-8 xl:gap-24">
          {/* Image */}
          <NavLink
            to={`/Comics/${mangaOfTheDay.id}/${slugify(mangaOfTheDay.title)}`}
            className="flex justify-center w-full mb-4 lg:mb-0 lg:w-[500px] lg:h-[700px] group"
            aria-label={`Voir la fiche de ${mangaOfTheDay.title}`}
          >
            <img
              src={getBestCoverUrl(mangaOfTheDay)}
              alt={mangaOfTheDay.title}
              className="w-[380px] h-[570px] md:w-[520px] md:h-[750px] lg:w-full lg:h-full object-cover mx-auto transition-transform group-hover:scale-105"
              decoding="async"
              loading="lazy"
              fetchpriority="low"
              sizes="(min-width:1024px) 500px, (min-width:768px) 520px, 380px"
              width={500}
              height={700}
            />
          </NavLink>
          {/* Infos */}
          <div className="flex flex-col justify-start items-center text-center lg:items-start lg:text-start w-full gap-3 lg:w-[40%] mt-2">
            <NavLink
              to={`/Comics/${mangaOfTheDay.id}/${slugify(mangaOfTheDay.title)}`}
              className="font-bold text-xl text-accent text-center lg:text-3xl lg:tracking-wider lg:w-full lg:text-start lg:mb-8 cursor-pointer hover:underline"
            >
              {mangaOfTheDay.title}
            </NavLink>
            <div className="flex w-full justify-center lg:justify-start">
              <p>
                <span className="font-semibold">Auteur :</span>{" "}
                {mangaOfTheDay.authorName}
              </p>
            </div>
            {mangaOfTheDay.artistName &&
              mangaOfTheDay.artistName !== mangaOfTheDay.authorName && (
                <div className="flex w-full justify-center lg:justify-start">
                  <p>
                    <span className="font-semibold">Artiste :</span>{" "}
                    {mangaOfTheDay.artistName}
                  </p>
                </div>
              )}
            <div className="flex w-full justify-center lg:justify-start gap-1">
              <p>
                <span className="font-semibold">Chapitres : </span>{" "}
                {chapterNumber || mangaOfTheDay.chapter}
              </p>
            </div>
            {/* Ajout des infos complémentaires */}
            <div className="flex flex-wrap w-full justify-center lg:justify-start gap-4 mt-2 text-sm">
              {/* Date de parution */}
              {"year" in mangaOfTheDay.originalData.attributes && (
                <span className="flex items-center gap-1">
                  <FaCalendarAlt size={14} className="text-accent" />
                  <span className="font-semibold">Parution :</span>{" "}
                  {mangaOfTheDay.originalData.attributes.year || "N/A"}
                </span>
              )}
              {/* Note du manga */}
              {mangaRating && (
                <span className="flex items-center gap-1">
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="text-accent"
                  >
                    <polygon points="8,1 10.09,5.26 15,6.18 11.5,9.97 12.36,15 8,12.77 3.64,15 4.5,9.97 1,6.18 5.91,5.26" />
                  </svg>
                  <span className="font-semibold">Note :</span>{" "}
                  {mangaRating.toFixed(2)}/10
                </span>
              )}
              {/* Statut */}
              {"status" in mangaOfTheDay.originalData.attributes &&
                (() => {
                  let statusColor = "bg-gray-400";
                  let statusText = mangaOfTheDay.originalData.attributes.status;
                  switch (statusText) {
                    case "ongoing":
                      statusColor = "bg-blue-400";
                      statusText = "En cours";
                      break;
                    case "completed":
                      statusColor = "bg-green-400";
                      statusText = "Terminé";
                      break;
                    case "hiatus":
                      statusColor = "bg-orange-400";
                      statusText = "Hiatus";
                      break;
                    case "cancelled":
                      statusColor = "bg-red-500";
                      statusText = "Annulé";
                      break;
                    default:
                      statusText = statusText || "N/A";
                  }
                  return (
                    <span className="flex items-center gap-1">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${statusColor}`}
                      ></span>
                      <span className="font-semibold">Statut :</span>{" "}
                      {statusText}
                    </span>
                  );
                })()}
            </div>
            <div className="flex flex-col justify-center items-center w-full gap-2 mt-4">
              <span className="w-[90%] h-[1px] bg-accent"></span>
              <p className="description text-gray-200 text-center lg:text-start">
                {filterSynopsis(
                  mangaOfTheDay.originalData?.attributes?.description?.fr ||
                    mangaOfTheDay.originalData?.attributes?.description?.en ||
                    "Pas de description disponible."
                )}
              </p>
              <span className="w-[90%] h-[1px] mt-3 bg-accent"></span>
            </div>
            <div className="lg:hidden w-full mt-4">
              <NavLink
                to={`/Comics/${mangaOfTheDay.id}/${slugify(
                  mangaOfTheDay.title
                )}`}
              >
                <ButtonAnimated
                  text={["En savoir plus"]}
                  justify="justify-end"
                />
              </NavLink>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
