// Ikon FontAwesome: aksi + per-kategori.
import {
  faPen, faTrash, faXmark, faHeart, faLocationDot, faBookmark,
  faDice, faBook, faGear,
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
