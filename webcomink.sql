-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 04 sep. 2024 à 13:43
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `webcomink`
--

-- --------------------------------------------------------

--
-- Structure de la table `bookmarks`
--

DROP TABLE IF EXISTS `bookmarks`;
CREATE TABLE IF NOT EXISTS `bookmarks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idComics` int NOT NULL,
  `iduser` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_bookmark` (`idComics`,`iduser`),
  KEY `iduser` (`iduser`)
) ENGINE=InnoDB AUTO_INCREMENT=156 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `bookmarks`
--

INSERT INTO `bookmarks` (`id`, `idComics`, `iduser`, `createdAt`) VALUES
(2, 10, 13, '2023-12-22 11:23:35'),
(147, 8, 5, '2023-12-25 10:00:17'),
(149, 2, 5, '2023-12-25 10:02:01'),
(150, 7, 5, '2023-12-26 16:34:31'),
(152, 10, 5, '2023-12-28 12:08:51'),
(155, 1, 5, '2024-03-09 16:11:56');

-- --------------------------------------------------------

--
-- Structure de la table `chapter`
--

DROP TABLE IF EXISTS `chapter`;
CREATE TABLE IF NOT EXISTS `chapter` (
  `idChapter` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `chapterNb` varchar(50) NOT NULL,
  `content` varchar(255) NOT NULL,
  `idComics` int NOT NULL,
  PRIMARY KEY (`idChapter`),
  KEY `Chapter_Comics_FK` (`idComics`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `chapter`
--

INSERT INTO `chapter` (`idChapter`, `name`, `date`, `chapterNb`, `content`, `idComics`) VALUES
(1, 'Chapitre 1', '2023-05-05', '1', '', 10);

-- --------------------------------------------------------

--
-- Structure de la table `comics`
--

DROP TABLE IF EXISTS `comics`;
CREATE TABLE IF NOT EXISTS `comics` (
  `idComics` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `banner` varchar(255) NOT NULL,
  `portrait` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `synopsis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `author` varchar(255) NOT NULL,
  `illustrator` varchar(255) NOT NULL,
  `likes` int NOT NULL DEFAULT '0',
  `bookmarks` int NOT NULL,
  `vue` varchar(50) NOT NULL,
  `genre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idComics`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `comics`
--

INSERT INTO `comics` (`idComics`, `title`, `banner`, `portrait`, `synopsis`, `author`, `illustrator`, `likes`, `bookmarks`, `vue`, `genre`) VALUES
(1, 'One Piece', '1702045796241-Banner-One Piece.jpg', '1702045796350-Cover-OnePiece.png', 'Il fut un temps où Gold Roger était le plus grand de tous les pirates, le \"Roi des Pirates\" était son surnom. A sa mort, son trésor d\'une valeur inestimable connu sous le nom de \"One Piece\" fut caché quelque part sur \"Grand Line\". De nombreux pirates sont partis à la recherche de ce trésor mais tous sont morts avant même de l\'atteindre. Monkey D. Luffy rêve de retrouver ce trésor légendaire et de devenir le nouveau \"Roi des Pirates\". Après avoir mangé un fruit du démon, il possède un pouvoir lui permettant de réaliser son rêve. Il lui faut maintenant trouver un équipage pour partir à l\'aventure !', 'Eiichirō Oda', 'Eiichirō Oda', 103, 12, '2036', 'Action'),
(2, 'Jujutsu Kaisen', '1702046074235-Cover-JJK.png', '1702046074546-JJK-Portrait.webp', 'Chaque année au Japon, on recense plus de 10 000 morts inexpliquées et portés disparus. Dans la majorité des cas, ce sont les sentiments négatifs des êtres humains qui sont en cause. Souffrance, regrets, humiliation : leur accumulation dans un même endroit provoque des malédictions souvent fatales… C’est ce que va découvrir à ses dépens Yuji Itadori, lycéen et membre du club de spiritisme. Il ne croit pas aux fantômes, mais sa force physique hors du commun est un précieux atout pour les missions du groupe… jusqu’à ce que l’une d’elles tourne mal. La relique qu’ils dénichent, le doigt sectionné d’une créature millénaire, attire les monstres ! Le jeune homme n’hésite pas une seconde : il avale la relique pour conjurer le mauvais sort ! Le voilà possédé par Ryomen Sukuna, le célèbre démon à deux visages. Contre toute attente, Yuji réussit à reprendre le contrôle de son corps. C’est du jamais vu ! Malgré tout, il est condamné à mort par l’organisation des exorcistes… Une sentence qui ne pourra être repoussée qu’à une seule condition : trouver et ingérer tous les doigts de Sukuna afin d’éliminer la menace une fois pour toutes. Et pour ça, l’adolescent va devoir s’initier à l’art occulte et mystérieux de l’exorcisme !', 'AKUTAMI Gege', 'AKUTAMI Gege', 0, 1, '5', 'Fantasie'),
(3, 'Dandadan', '1702046372717-Cover-Dandadan.png', '1702046372743-Portrait-DandaDan.jpg', 'Momo Ayase et Ken Takakura sont deux lycéens que tout oppose. Tandis que la première ne croit qu\'aux esprits, le second ne jure que par les extraterrestres. Incapables de se convaincre, ils se lancent alors un défi : Momo devra se rendre dans un hôpital où des créatures de l’espace sont censées se trouver, et Ken dans un tunnel hanté… Or, chacun va faire une rencontre d’un autre genre qui va bouleverser leur vie et lier leur sort. C’est le début d’une romance survoltée où l’occulte, le paranormal et le surnaturel se bousculent dans un chaos haletant !', 'TATSU Yukinobu', 'TATSU Yukinobu', 0, 0, '2', 'Thriller'),
(4, 'Kaiju n°8', '1702046480282-Cover-Kaiju8.jpg', '1702046480311-Portrait-KaijuN8.webp', 'Les kaiju sont d’effroyables monstres géants qui surgissent de nulle part pour attaquer la population. Au Japon, ces apparitions font désormais partie du quotidien. Enfant, Kafka Hibino rêvait d’intégrer les Forces de Défense pour combattre ces terribles ennemis, mais après de nombreux échecs à l’examen d’entrée, ce trentenaire travaille à nettoyer les rues de leurs encombrants cadavres. Jusqu’au jour où une mystérieuse créature s’introduit dans son organisme et le métamorphose en une entitée surpuissante mi-humaine, mi-kaiju. Son nouveau nom de code : “Kaiju n° 8” !', 'MATSUMOTO Naoya', 'MATSUMOTO Naoya', 0, 0, '1', 'Thriller'),
(5, 'Oshi no Ko', '1702046631666-Cover-OshinoKo.jpg', '1702046631787-Portrait-OshiNoKo.jpg', 'Le docteur Gorô est obstétricien dans un hôpital de campagne. Il est loin du monde de paillettes dans lequel évolue Ai Hoshino, une chanteuse au succès grandissant dont il est “un fan absolu”. Ces deux-là vont peut-être se rencontrer dans des circonstances peu favorables, mais cet évènement changera leur vie à jamais !', 'AKASAKA Aka', 'YOKOYARI Mengo', 0, 0, '3', 'Action'),
(6, 'Boruto - Two Blue Vortex', '1702046741507-Banner-Boruto.jpeg', '1702046741507-Boruto-Banner-AV.jpg', 'Les « souvenirs » des gens ont changé et désormais, la vie de Boruto est menacée au village caché de Konoha. La situation est telle que Boruto quitte le village avec Sasuke sans savoir ce qui les attend…', 'IKEMOTO Mikio', 'KISHIMOTO Masashi', 0, 0, '2', 'Romance'),
(7, 'Chainsaw Man', '1702046811514-Banner-chainsawman.png', '1702046811639-Portrait-ChainsawMan.jpg', 'Pour rembourser ses dettes, Denji, jeune homme dans la dèche la plus totale, est exploité en tant que Devil Hunter avec son chien-démon-tronçonneuse, “Pochita”. Mais suite à une cruelle trahison, il voit enfin une possibilité de se tirer des bas-fonds où il croupit ! Devenu surpuissant après sa fusion avec Pochita, Denji est recruté par une organisation et part à la chasse aux démons…', 'FUJIMOTO Tatsuki', 'FUJIMOTO Tatsuki', 1, 1, '4', 'Fantasie'),
(8, 'Frieren', '1702046945824-Banner-Frieren2.jpg', '1702046945841-Portrait-Frieren.jpg', 'Le jeune héros Himmel et ses compagnons, l’elfe Frieren, le nain Eisen et le prêtre Heiter, rentrent victorieux de leur combat contre le roi des démons. Au bout de dix années d’efforts, ils ont ramené la paix dans le royaume. Il est temps pour eux de retrouver une vie normale... Difficile à imaginer après tant d’aventures en commun ! Frieren, elle, ne semble guère touchée par la séparation. Pour la magicienne à la longévité exceptionnelle, une décennie ne pèse pas lourd. Elle reprend la route en solo et promet de retrouver ses camarades un demi-siècle plus tard. Elle tient parole… mais ces retrouvailles sont aussi les derniers instants passés avec Himmel, devenu un vieillard qui s’éteint paisiblement sous ses yeux. Frieren est sous le choc... La vie des humains est si courte ! L’elfe a beau être experte en magie, il lui reste encore un long chemin à parcourir pour comprendre la race humaine... Son nouvel objectif : s’initier aux arcanes du cœur !', 'YAMADA Kanehito', 'ABE Tsukasa', 0, 1, '2', 'Action'),
(9, 'Spy X Family', '1702047002554-Banner-SpyXFamily.png', '1702047002560-Portrait-SpyXFamily.jpg', 'Twilight, le plus grand espion du monde, doit pour sa nouvelle mission créer une famille de toutes pièces afin de pouvoir s’introduire dans la plus prestigieuse école de l’aristocratie. Totalement dépourvu d’expérience familiale, il va adopter une petite fille en ignorant qu’elle est télépathe, et s’associer à une jeune femme timide, sans se douter qu’elle est une redoutable tueuse à gages. Ce trio atypique va devoir composer pour passer inaperçu, tout en découvrant les vraies valeurs d’une famille unie et aimante.', 'ENDO Tatsuya', 'ENDO Tatsuya', 0, 0, '3', 'Horreur'),
(10, 'Mobius', '1702985504307-Cover_rvb cropped.jpg', '1702985504339-Cover_rvb.jpg', 'à venir ...', 'Tristan', 'Tristan', 4, 14, '27', 'Drama');

-- --------------------------------------------------------

--
-- Structure de la table `commentchapter`
--

DROP TABLE IF EXISTS `commentchapter`;
CREATE TABLE IF NOT EXISTS `commentchapter` (
  `idChapter` int NOT NULL,
  `iduser` int NOT NULL,
  `user` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `message` varchar(255) NOT NULL,
  PRIMARY KEY (`idChapter`,`iduser`),
  KEY `CommentChapter_User0_FK` (`iduser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
CREATE TABLE IF NOT EXISTS `favorite` (
  `idComics` int NOT NULL,
  `iduser` int NOT NULL,
  PRIMARY KEY (`idComics`,`iduser`),
  KEY `favorite_User0_FK` (`iduser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `genre`
--

DROP TABLE IF EXISTS `genre`;
CREATE TABLE IF NOT EXISTS `genre` (
  `idGenre` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`idGenre`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `genre`
--

INSERT INTO `genre` (`idGenre`, `name`) VALUES
(1, 'Action'),
(2, 'Fantasie'),
(3, 'Thriller'),
(4, 'Tranche de vie'),
(5, 'Sport'),
(6, 'Romance'),
(7, 'Comédie'),
(8, 'Drama'),
(9, 'Horreur');

-- --------------------------------------------------------

--
-- Structure de la table `imagechapter`
--

DROP TABLE IF EXISTS `imagechapter`;
CREATE TABLE IF NOT EXISTS `imagechapter` (
  `idImage` int NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `idChapter` int NOT NULL,
  PRIMARY KEY (`idImage`),
  KEY `Image_Chapter_FK` (`idChapter`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `imagechapter`
--

INSERT INTO `imagechapter` (`idImage`, `url`, `idChapter`) VALUES
(1, 'https://i.imgur.com/ZAsz0jW.jpg', 1),
(2, 'https://i.imgur.com/95e3tdi.jpg', 1),
(3, 'https://i.imgur.com/5zUBZJQ.jpg', 1),
(4, 'https://i.imgur.com/6oTLlV0.jpg', 1),
(5, 'https://i.imgur.com/MzMFRVE.jpg', 1),
(6, 'https://i.imgur.com/umrevqS.jpg', 1),
(7, 'https://i.imgur.com/Ez4m4mo.jpg', 1),
(8, 'https://i.imgur.com/peqA2bK.jpg', 1),
(9, 'https://i.imgur.com/5G6fE3q.jpg', 1),
(10, 'https://i.imgur.com/5G6fE3q.jpg', 1);

-- --------------------------------------------------------

--
-- Structure de la table `likes`
--

DROP TABLE IF EXISTS `likes`;
CREATE TABLE IF NOT EXISTS `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idComics` int NOT NULL,
  `iduser` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_like` (`idComics`,`iduser`),
  KEY `iduser` (`iduser`)
) ENGINE=MyISAM AUTO_INCREMENT=352 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `likes`
--

INSERT INTO `likes` (`id`, `idComics`, `iduser`, `createdAt`) VALUES
(14, 10, 11, '2023-12-21 10:04:00'),
(130, 10, 13, '2023-12-22 10:44:08'),
(351, 1, 5, '2024-03-09 16:11:49'),
(343, 7, 5, '2023-12-26 16:34:30'),
(350, 10, 5, '2023-12-28 14:08:59');

-- --------------------------------------------------------

--
-- Structure de la table `trier`
--

DROP TABLE IF EXISTS `trier`;
CREATE TABLE IF NOT EXISTS `trier` (
  `idGenre` int NOT NULL,
  `idComics` int NOT NULL,
  KEY `Trier_Comics0_FK` (`idComics`),
  KEY `Trier_genre_FK` (`idGenre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `iduser` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profilePicture` varchar(255) NOT NULL,
  `aboutme` varchar(255) NOT NULL,
  `admin` tinyint DEFAULT NULL,
  PRIMARY KEY (`iduser`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`iduser`, `username`, `email`, `password`, `profilePicture`, `aboutme`, `admin`) VALUES
(5, 'Brandon', 'demaretzz.brandon@gmail.com', '$2b$10$.KB5qPet4WaO0uR4FYO0eOnSV258sYIn2qak7lK93xKD0TQF/yKB.', 'resized_1710000660831-full.jpeg', 'Ceci est une description par default', 1),
(11, 'test1', 'test1@gmail.com', '$2b$10$nvzbnaC6DbNGSxydS4kVGuvlJDKRWjOz4TEEL40aE45EXuA.LkL06', '', '', NULL),
(12, 'test3', 'test3@gmail.com', '$2b$10$cN/qzJ4Od0KGh2W./kh1zuRO6TmcuT0ab3Xaj5TMUR6JHFmSLKVHO', '', '', NULL),
(13, 'test2', 'test2@gmail.com', '$2b$10$6mROqZp8yCGsDEe86smQ4OrdxTnzl4FgRwEoqq7Ca/0rHUmDnNP36', '', '', NULL);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD CONSTRAINT `bookmarks_ibfk_1` FOREIGN KEY (`idComics`) REFERENCES `comics` (`idComics`),
  ADD CONSTRAINT `bookmarks_ibfk_2` FOREIGN KEY (`iduser`) REFERENCES `user` (`iduser`);

--
-- Contraintes pour la table `chapter`
--
ALTER TABLE `chapter`
  ADD CONSTRAINT `Chapter_Comics_FK` FOREIGN KEY (`idComics`) REFERENCES `comics` (`idComics`);

--
-- Contraintes pour la table `commentchapter`
--
ALTER TABLE `commentchapter`
  ADD CONSTRAINT `CommentChapter_Chapter_FK` FOREIGN KEY (`idChapter`) REFERENCES `chapter` (`idChapter`),
  ADD CONSTRAINT `CommentChapter_User0_FK` FOREIGN KEY (`iduser`) REFERENCES `user` (`iduser`);

--
-- Contraintes pour la table `favorite`
--
ALTER TABLE `favorite`
  ADD CONSTRAINT `favorite_Comics_FK` FOREIGN KEY (`idComics`) REFERENCES `comics` (`idComics`),
  ADD CONSTRAINT `favorite_User0_FK` FOREIGN KEY (`iduser`) REFERENCES `user` (`iduser`);

--
-- Contraintes pour la table `imagechapter`
--
ALTER TABLE `imagechapter`
  ADD CONSTRAINT `imagechapter_ibfk_1` FOREIGN KEY (`idChapter`) REFERENCES `chapter` (`idChapter`) ON DELETE CASCADE;

--
-- Contraintes pour la table `trier`
--
ALTER TABLE `trier`
  ADD CONSTRAINT `Trier_Comics0_FK` FOREIGN KEY (`idComics`) REFERENCES `comics` (`idComics`),
  ADD CONSTRAINT `Trier_genre_FK` FOREIGN KEY (`idGenre`) REFERENCES `genre` (`idGenre`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
