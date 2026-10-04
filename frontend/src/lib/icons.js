// Ikon FontAwesome: aksi + per-kategori.
import {
  faPen, faTrash, faXmark, faHeart, faLocationDot, faBookmark,
  faDice, faBook, faGear, faStar, faChevronLeft, faChevronRight, faCalendarDays, faLock,
  faThumbtack, faCamera, faCheck, faCalendarPlus, faHeartCrack, faCoins, faWandMagicSparkles, faDownload,
  faBowlRice, faFilm, faLandmark, faCat, faTree, faPersonWalking,
  faGamepad, faBagShopping, faMugHot,
} from '@fortawesome/free-solid-svg-icons';

export const ui = {
  pen: faPen,
  trash: faTrash,
  close: faXmark,
  heart: faHeart,
  map: faLocationDot,
  bookmark: faBookmark,
  dice: faDice,
  book: faBook,
  gear: faGear,
  star: faStar,
  prev: faChevronLeft,
  next: faChevronRight,
  calendar: faCalendarDays,
  lock: faLock,
  pin: faThumbtack,
  camera: faCamera,
  check: faCheck,
  plan: faCalendarPlus,
  heartOff: faHeartCrack,
  coins: faCoins,
  sparkle: faWandMagicSparkles,
  download: faDownload,
};

// Ikon per slug kategori.
const BY_SLUG = {
  makan: faBowlRice,
  nonton: faFilm,
  museum: faLandmark,
  hewan: faCat,
  taman: faTree,
  jalan: faPersonWalking,
  main: faGamepad,
  belanja: faBagShopping,
  nongkrong: faMugHot,
};

export const catIcon = (slug) => BY_SLUG[slug] || faLocationDot;
