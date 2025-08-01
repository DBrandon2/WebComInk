import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMangas } from "../../services/mangaService";
import { enrichMangas, slugify, filterSynopsis } from "../../utils/mangaUtils";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import axios from "axios";
import TopBarMobile from "./TopBarMobile";
import ChaptersList from "./ChaptersList";
import FavoriteButton from "../../components/FavoriteButton";
import { getCustomCategories } from "../../services/favoriteService";
import Breadcrumb from "../../components/shared/Breadcrumb";

export default function ComicsDetails() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meanRating, setMeanRating] = useState(null);
  const [scanGroups, setScanGroups] = useState({ fr: [], en: [] });
  const [modalTranslatorsOpen, setModalTranslatorsOpen] = useState(false);
  const [customCategories, setCustomCategories] = useState([]);

  // Extraction et fallback automatique du synopsis (fr > en)
  const rawDescFr = manga?.originalData?.attributes?.description?.fr || "";
  const rawDescEn = manga?.originalData?.attributes?.description?.en || "";
  const descFrFiltered = filterSynopsis(rawDescFr);
  const descEnFiltered = filterSynopsis(rawDescEn);
  const descFr =
    descFrFiltered && descFrFiltered.length > 0 ? descFrFiltered : rawDescFr;
  const descEn =
    descEnFiltered && descEnFiltered.length > 0 ? descEnFiltered : rawDescEn;
  // Déterminer la langue par défaut : fr si dispo, sinon en
  const hasFr = !!descFr && descFr.trim().length > 0;
  const hasEn = !!descEn && descEn.trim().length > 0;
  const [synopsisLang, setSynopsisLang] = useState(
    hasFr ? "fr" : hasEn ? "en" : "fr"
  );
  const synopsis =
    synopsisLang === "fr" && hasFr ? descFr : hasEn ? descEn : "";
  // Puis le reste des hooks
  const [isExpanded, setIsExpanded] = useState(false);
  const synopsisRef = useRef(null); // Pour desktop
  const synopsisRefMobile = useRef(null); // Pour mobile
  const [isClamped, setIsClamped] = useState(false);
  const [isClampedMobile, setIsClampedMobile] = useState(false);

  // Ajout pour le modal auteur/artiste
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null); // { type: 'author'|'artist', data: {...} }

  // Extraction détaillée des auteurs/artistes (objets complets)
  const relationships = manga?.originalData?.relationships || [];
  const authorRels = relationships.filter((rel) => rel.type === "author");
  const artistRels = relationships.filter((rel) => rel.type === "artist");

  // Ajout du modal pour le titre complet
  const [modalTitleOpen, setModalTitleOpen] = useState(false);
  function TitleModal({ open, onClose, title }) {
    if (!open) return null;
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-dark-bg rounded-xl shadow-2xl p-6 w-full max-w-xs md:max-w-md relative mx-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-accent text-xl font-bold hover:text-white transition cursor-pointer"
              onClick={onClose}
              aria-label="Fermer"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-accent mb-4 text-center">
              Titre complet
            </h2>
            <div className="text-white text-lg text-center break-words">
              {title}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Fonction pour ouvrir le modal avec les infos
  function handleOpenModal(type, rel) {
    setModalData({ type, data: rel });
    setModalOpen(true);
  }
  function handleCloseModal() {
    setModalOpen(false);
    setModalData(null);
  }

  // Composant modal
  function AuthorArtistModal({ open, onClose, info }) {
    if (!open || !info) return null;
    const { type, data } = info;
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-dark-bg rounded-xl shadow-2xl p-6 w-full max-w-xs md:max-w-md relative mx-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-accent text-xl font-bold hover:text-white transition cursor-pointer"
              onClick={onClose}
              aria-label="Fermer"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-accent mb-2">
              {type === "author" ? "Auteur" : "Artiste"}
            </h2>
            <div className="mb-2">
              <span className="font-semibold">Nom :</span>{" "}
              {data?.attributes?.name || "Inconnu"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">ID :</span> {data?.id}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Biographie :</span>
              <div className="text-sm mt-1 whitespace-pre-line max-h-40 overflow-y-auto">
                {(() => {
                  const bio = data?.attributes?.biography;
                  if (
                    !bio ||
                    (typeof bio === "string" && bio.trim() === "") ||
                    (typeof bio === "object" &&
                      Object.values(bio).every(
                        (val) => !val || val.trim() === ""
                      ))
                  ) {
                    return (
                      <span className="italic text-gray-400">
                        Biographie non disponible pour le moment.
                      </span>
                    );
                  }
                  if (typeof bio === "string") return bio;
                  return Object.values(bio)[0];
                })()}
              </div>
            </div>
            {data?.attributes?.twitter && (
              <div className="mb-2">
                <span className="font-semibold">Twitter :</span>{" "}
                {data.attributes.twitter}
              </div>
            )}
            {data?.attributes?.pixiv && (
              <div className="mb-2">
                <span className="font-semibold">Pixiv :</span>{" "}
                {data.attributes.pixiv}
              </div>
            )}
            {data?.attributes?.website && (
              <div className="mb-2">
                <span className="font-semibold">Site web :</span>{" "}
                {data.attributes.website}
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Ajout de l'état pour le modal des tags
  const [modalTagsOpen, setModalTagsOpen] = useState(false);
  function TagsModal({ open, onClose, tags }) {
    if (!open) return null;
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-dark-bg rounded-xl shadow-2xl p-6 w-full max-w-xs md:max-w-md relative mx-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-accent text-xl font-bold hover:text-white transition cursor-pointer"
              onClick={onClose}
              aria-label="Fermer"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-accent mb-4 text-center">
              Tous les tags
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {tags.map((tag, i) => (
                <span
                  key={tag.id || i}
                  className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-medium shadow-sm drop-shadow-md whitespace-nowrap"
                  style={{
                    fontSize: "0.75rem",
                    maxWidth: "120px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "inline-block",
                  }}
                >
                  {tag.name?.fr ||
                    tag.name?.en ||
                    tag.name?.ja ||
                    tag.name?.["ja-ro"] ||
                    Object.values(tag.name || {})[0] ||
                    "Tag"}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Extraction des groupes de scantrad FR/EN à partir des chapitres
  useEffect(() => {
    async function fetchScanGroups() {
      if (!id) return;
      const langs = ["fr", "en"];
      const result = { fr: [], en: [] };
      for (const lang of langs) {
        try {
          const res = await fetch(
            `${
              import.meta.env.VITE_API_URL || "http://localhost:3000"
            }/proxy/chapter?manga=${id}&limit=100&translatedLanguage[]=${lang}&order[chapter]=desc&includes[]=scanlation_group`
          );
          const data = await res.json();
          const groups = new Set();
          (data.data || []).forEach((ch) => {
            (ch.relationships || []).forEach((rel) => {
              if (rel.type === "scanlation_group" && rel.attributes?.name) {
                groups.add(rel.attributes.name);
              }
            });
          });
          result[lang] = Array.from(groups);
        } catch {}
      }
      setScanGroups(result);
    }
    fetchScanGroups();
  }, [id]);

  useEffect(() => {
    async function fetchManga() {
      setLoading(true);
      setError(null);
      try {
        // Recherche rapide par id
        const data = await getMangas({
          limit: 1,
          ids: [id],
          includes: ["author", "artist", "cover_art"],
        });
        const enriched = enrichMangas(data.data);
        const manga = enriched[0] || null;
        setManga(manga);

        // Si le slug ne correspond pas, redirige vers la bonne URL (SEO)
        if (manga && slugify(manga.title) !== slug) {
          navigate(`/Comics/${manga.id}/${slugify(manga.title)}`, {
            replace: true,
          });
        }

        // Récupération de la note moyenne via le proxy backend
        if (manga && manga.id) {
          try {
            const resp = await fetch(
              `${
                import.meta.env.VITE_API_URL || "http://localhost:3000"
              }/proxy/statistics/manga/${manga.id}`
            );
            const statsData = await resp.json();
            const stats = statsData.statistics?.[manga.id];
            setMeanRating(stats?.rating?.average ?? null);
          } catch (e) {
            setMeanRating(null);
          }
        }
      } catch (err) {
        setError("Erreur lors du chargement du manga.");
      } finally {
        setLoading(false);
      }
    }
    fetchManga();
  }, [id, slug, navigate]);

  useEffect(() => {
    const loadCustomCategories = async () => {
      try {
        const cats = await getCustomCategories();
        setCustomCategories(Array.isArray(cats) ? cats : []);
      } catch (err) {
        setCustomCategories([]);
      }
    };
    loadCustomCategories();
  }, []);

  useEffect(() => {
    // Logique pour desktop
    if (isExpanded) {
      setIsClamped(true); // Toujours afficher le bouton Réduire quand ouvert
    } else if (synopsisRef.current) {
      const el = synopsisRef.current;
      setIsClamped(el.scrollHeight > el.clientHeight + 2); // marge de sécurité
    }
  }, [synopsis, synopsisLang, isExpanded]);

  // Logique pour mobile - basée sur la longueur du texte (plus simple et fiable)
  useEffect(() => {
    if (isExpanded) {
      setIsClampedMobile(true); // Toujours afficher le bouton Réduire quand ouvert
    } else {
      // Si le synopsis fait plus de 300 caractères, on considère qu'il faut un bouton
      setIsClampedMobile(synopsis && synopsis.length > 300);
    }
  }, [synopsis, synopsisLang, isExpanded]);

  if (loading || !manga) return <div>Chargement...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  // Extraction des tags enrichis
  const tags = manga.tags || [];

  // Fonction pour obtenir la cover originale (pleine qualité)
  function getBannerCoverOriginalUrl(manga) {
    if (!manga || !manga.originalData) return "";
    const relationships = manga.originalData.relationships || [];
    const coverRel = relationships.find((rel) => rel.type === "cover_art");
    const coverFileName = coverRel?.attributes?.fileName;
    return coverFileName
      ? `${import.meta.env.VITE_API_URL}/proxy/covers/${
          manga.id
        }/${coverFileName}`
      : "/default-cover.png";
  }

  // Placeholders pour vues et favoris
  const views = "N/A";
  const rating = meanRating !== null ? meanRating.toFixed(2) : "N/A";

  // Infos supplémentaires
  const publishedAt = manga.originalData?.attributes?.year || null;
  const statusRaw = manga.originalData?.attributes?.status || "";
  let status = "";
  let statusColor = "bg-gray-400";
  switch (statusRaw) {
    case "ongoing":
      status = "En cours";
      statusColor = "bg-blue-400";
      break;
    case "completed":
      status = "Terminé";
      statusColor = "bg-green-400";
      break;
    case "hiatus":
      status = "Hiatus";
      statusColor = "bg-orange-400";
      break;
    case "cancelled":
      status = "Annulé";
      statusColor = "bg-red-500";
      break;
    default:
      status = statusRaw;
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", link: "/" },
          { label: "Comics", link: "/Comics" },
          { label: manga?.title || "Détails" },
        ]}
      />
      <AuthorArtistModal
        open={modalOpen}
        onClose={handleCloseModal}
        info={modalData}
      />
      {/* Modal titre complet */}
      <TitleModal
        open={modalTitleOpen}
        onClose={() => setModalTitleOpen(false)}
        title={manga.title}
      />
      {/* Modal tags complet */}
      <TagsModal
        open={modalTagsOpen}
        onClose={() => setModalTagsOpen(false)}
        tags={tags}
      />
      {/* Section avec image de fond et bannière - hauteur fixe sur mobile */}
      <div className="relative w-full min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center">
        {/* TopBarMobile au-dessus de l'image de fond */}
        <div className="absolute top-0 left-0 w-full z-20 block md:hidden">
          <TopBarMobile />
        </div>
        {/* Fond flou en cover */}
        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
          <img
            src={getBannerCoverOriginalUrl(manga)}
            alt={manga.title}
            className="w-full h-full object-cover blur-none md:blur-[4px] brightness-50 scale-100 z-0 "
          />
          {/* Dégradé bas pour lisibilité */}
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-1/2 z-10">
            <div className="w-full h-full bg-gradient-to-t from-dark-bg to-transparent" />
          </div>
        </div>
        {/* Bannière */}
        <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-12 w-full max-w-5xl px-4 py-8">
          {/* Cover nette */}
          <div className="flex flex-col items-center">
            <motion.div className="shadow-2xl rounded-lg overflow-hidden min-w-[160px] min-h-[240px]">
              <img
                src={manga.coverUrl}
                alt={manga.title}
                className="object-cover w-[160px] h-[240px] md:w-[220px] md:h-[330px]"
              />
            </motion.div>
            <div className="mt-4 flex justify-center w-full">
              <FavoriteButton
                mangaId={manga.id}
                title={manga.title}
                coverImage={manga.coverUrl}
                customCategories={customCategories}
              />
            </div>
          </div>
          {/* Infos */}
          <div className="flex flex-col gap-2 md:gap-3 items-center md:items-start w-full max-w-3xl md:h-[330px] justify-start">
            {/* Titre cliquable, réduit sur mobile, 2 lignes max */}
            <h1
              className="text-xl md:text-4xl font-bold text-accent drop-shadow-lg text-center md:text-left w-full cursor-pointer select-none line-clamp-2  md:whitespace-normal flex items-center gap-2"
              title={manga.title}
              onClick={() => setModalTitleOpen(true)}
              style={{
                WebkitLineClamp: 2,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                paddingBottom: "0.3em",
                ...(window.innerWidth >= 768
                  ? {
                      WebkitLineClamp: "unset",
                      display: "flex",
                      WebkitBoxOrient: "unset",
                      overflow: "visible",
                      textOverflow: "unset",
                    }
                  : {}),
              }}
            >
              {manga.title}
              {/* Icône info traducteurs à droite du titre */}
              {(scanGroups.fr.length > 0 || scanGroups.en.length > 0) && (
                <button
                  className="text-accent hover:text-accent/80 text-sm focus:outline-none flex-shrink-0 ml-2 cursor-pointer"
                  title="Voir les groupes de traduction"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalTranslatorsOpen(true);
                  }}
                  style={{ opacity: 0.7 }}
                >
                  <FaInfoCircle size={20} />
                </button>
              )}
            </h1>
            <div className="flex flex-col gap-1 mt-2 text-white/90 text-sm md:text-base drop-shadow-md">
              <span className="flex flex-row items-center gap-1">
                <span>Auteur :</span>{" "}
                {authorRels.length > 0 ? (
                  <span
                    className="font-semibold cursor-pointer line-clamp-1 md:line-clamp-2 hover:text-accent transition-all"
                    title={authorRels[0].attributes?.name}
                    onClick={() => handleOpenModal("author", authorRels[0])}
                  >
                    {authorRels[0].attributes?.name}
                  </span>
                ) : (
                  <span className="font-semibold line-clamp-1 md:line-clamp-2">
                    Inconnu
                  </span>
                )}
              </span>
              {artistRels.length > 0 &&
                artistRels[0].attributes?.name !==
                  authorRels[0]?.attributes?.name && (
                  <span className="flex flex-row items-center gap-1">
                    <span>Artiste :</span>{" "}
                    <span
                      className="font-semibold cursor-pointer line-clamp-1 md:line-clamp-2 hover:text-accent transition-all"
                      title={artistRels[0].attributes?.name}
                      onClick={() => handleOpenModal("artist", artistRels[0])}
                    >
                      {artistRels[0].attributes?.name}
                    </span>
                  </span>
                )}
            </div>
            {/* Affichage limité des tags sur mobile, complet sur desktop */}
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.length > 0 ? (
                <>
                  {/* Mobile : seulement les 8 premiers tags, puis bouton */}
                  <span className="md:hidden w-full flex flex-wrap justify-start text-left relative pr-8 max-h-[52px] overflow-hidden">
                    {tags.slice(0, 8).map((tag, i) => (
                      <span
                        key={tag.id || i}
                        className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-medium whitespace-nowrap mr-1 mb-1"
                        style={{
                          fontSize: "0.75rem",
                          maxWidth: "120px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "inline-block",
                        }}
                      >
                        {tag.name?.fr ||
                          tag.name?.en ||
                          tag.name?.ja ||
                          tag.name?.["ja-ro"] ||
                          Object.values(tag.name || {})[0] ||
                          "Tag"}
                      </span>
                    ))}
                    {tags.length > 8 && (
                      <button
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full bg-accent text-dark-bg hover:bg-accent/80 transition"
                        style={{ lineHeight: 0 }}
                        onClick={() => setModalTagsOpen(true)}
                        aria-label="Voir tous les tags"
                      >
                        <FiPlus size={18} />
                      </button>
                    )}
                  </span>
                  {/* Desktop : tous les tags */}
                  <span className="hidden md:flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                      <span
                        key={tag.id || i}
                        className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-medium shadow-sm drop-shadow-md whitespace-nowrap"
                        style={{
                          fontSize: "0.75rem",
                          maxWidth: "120px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "inline-block",
                        }}
                      >
                        {tag.name?.fr ||
                          tag.name?.en ||
                          tag.name?.ja ||
                          tag.name?.["ja-ro"] ||
                          Object.values(tag.name || {})[0] ||
                          "Tag"}
                      </span>
                    ))}
                  </span>
                </>
              ) : (
                <span className="text-gray-400 text-xs drop-shadow-md">
                  Aucun tag
                </span>
              )}
            </div>
            {/* Infos supplémentaires sous les tags */}
            <div className="flex flex-wrap gap-4 mt-1 text-xs md:text-sm text-white/80 drop-shadow-md">
              {publishedAt && (
                <span className="flex items-center gap-1">
                  <FaCalendarAlt size={14} className="text-accent" />{" "}
                  <span className="font-semibold">{publishedAt}</span>
                </span>
              )}
              {status && (
                <span className="flex items-center gap-1">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${statusColor}`}
                  ></span>
                  <span>
                    Status : <span className="font-semibold">{status}</span>
                  </span>
                </span>
              )}
              <span className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="inline text-accent"
                  >
                    <polygon points="8,1 10.09,5.26 15,6.18 11.5,9.97 12.36,15 8,12.77 3.64,15 4.5,9.97 1,6.18 5.91,5.26" />
                  </svg>{" "}
                  {rating}/10
                </span>
                <span className="flex items-center gap-1">
                  <FaEye size={15} className="text-accent" /> {views}
                </span>
              </span>
            </div>
            {/* Synopsis visible uniquement sur desktop */}
            <div
              className={`hidden md:block mt-2 text-white/90 text-sm drop-shadow-md max-h-[180px] ${
                isClamped
                  ? "overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-accent"
                  : ""
              } rounded-md`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">Synopsis :</span>
                {hasFr && hasEn && descFr !== descEn && (
                  <button
                    className="px-2 py-0.5 rounded bg-accent/20 text-accent text-xs font-medium hover:bg-accent/40 transition cursor-pointer"
                    onClick={() =>
                      setSynopsisLang((l) => (l === "fr" ? "en" : "fr"))
                    }
                  >
                    {synopsisLang === "fr"
                      ? "Voir en anglais"
                      : "Voir en français"}
                  </button>
                )}
              </div>
              <motion.div
                ref={synopsisRef}
                className={isExpanded ? "" : "line-clamp-4"}
                initial={false}
                animate={{
                  height: isExpanded
                    ? "auto"
                    : synopsisRef.current
                    ? synopsisRef.current.scrollHeight + "px"
                    : "96px",
                  opacity: isExpanded ? 1 : 0.95,
                }}
                transition={{
                  height: { type: "spring", stiffness: 200, damping: 30 },
                  opacity: { duration: 0.25 },
                }}
                style={{ overflow: "hidden" }}
              >
                {synopsis}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis mobile - en dehors de la section avec image de fond */}
      <div className="block md:hidden w-full px-4 mb-8 bg-dark-bg mt-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 justify-center mb-3">
            <span className="font-semibold text-accent">Synopsis :</span>
            {hasFr && hasEn && descFr !== descEn && (
              <button
                className="px-2 py-0.5 rounded bg-accent/20 text-accent text-xs font-medium hover:bg-accent/40 transition"
                onClick={() =>
                  setSynopsisLang((l) => (l === "fr" ? "en" : "fr"))
                }
              >
                {synopsisLang === "fr" ? "Voir en anglais" : "Voir en français"}
              </button>
            )}
          </div>
          <div className="relative text-white/90 text-center text-sm leading-relaxed">
            <div className="relative">
              <motion.div
                ref={synopsisRefMobile}
                initial={false}
                animate={{
                  height: isExpanded ? "auto" : "96px",
                  opacity: 1,
                }}
                transition={{
                  height: { type: "spring", stiffness: 200, damping: 30 },
                  opacity: { duration: 0.25 },
                }}
                style={{
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: isExpanded ? "unset" : 4,
                }}
              >
                {synopsis}
              </motion.div>
              {/* Dégradé si clampé et pas expand - positionné au-dessus du bouton */}
              {!isExpanded && isClampedMobile && (
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-8 flex flex-col items-center justify-end pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-dark-bg to-transparent" />
                </motion.div>
              )}
            </div>
            {/* Bouton Afficher plus/Réduire sous le synopsis, avec barre accent */}
            {isClampedMobile && (
              <motion.div
                className="flex flex-col items-center w-full mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <span className="block h-[2px] w-[80%] bg-accent mx-auto" />
                <motion.button
                  className="mt-0 px-4 py-1 rounded-b bg-accent text-dark-bg text-xs font-semibold shadow-lg hover:bg-accent/80 transition block mx-auto"
                  style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                  onClick={() => setIsExpanded((v) => !v)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isExpanded ? "Réduire" : "Afficher plus"}
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Liste des chapitres */}
      <div className="w-full max-w-5xl mx-auto mb-24 px-4">
        <ChaptersList mangaId={manga.id} />
      </div>

      {/* Modal traducteurs */}
      {modalTranslatorsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setModalTranslatorsOpen(false)}
        >
          <div
            className="bg-dark-bg rounded-xl shadow-2xl p-6 w-full max-w-xs md:max-w-md relative mx-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-accent text-xl font-bold hover:text-white transition cursor-pointer"
              onClick={() => setModalTranslatorsOpen(false)}
              aria-label="Fermer"
            >
              ×
            </button>
            <h2 className="text-lg font-bold text-accent mb-4 text-center">
              Groupes de traduction
            </h2>
            {scanGroups.fr.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold text-accent">Français :</span>
                <ul className="list-disc list-inside text-white text-sm mt-1">
                  {scanGroups.fr.map((name, i) => (
                    <li key={name + i}>{name}</li>
                  ))}
                </ul>
              </div>
            )}
            {scanGroups.en.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold text-accent">Anglais :</span>
                <ul className="list-disc list-inside text-white text-sm mt-1">
                  {scanGroups.en.map((name, i) => (
                    <li key={name + i}>{name}</li>
                  ))}
                </ul>
              </div>
            )}
            {scanGroups.fr.length === 0 && scanGroups.en.length === 0 && (
              <div className="text-gray-400 text-sm text-center">
                Aucun groupe de traduction trouvé.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
